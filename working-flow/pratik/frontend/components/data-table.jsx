"use client"

import { useState, useMemo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function DataTable() {
  const [data, setData] = useState([
    { id: 1, type: 'YouTube', content: 'https://youtube.com/watch?v=123' },
    { id: 2, type: 'PDF', content: 'JavaScript_Guide.pdf' },
    { id: 3, type: 'URL', content: 'https://example.com' },
    { id: 4, type: 'YouTube', content: 'https://youtube.com/watch?v=456' },
    { id: 5, type: 'PDF', content: 'React_Tutorial.pdf' },
    { id: 6, type: 'URL', content: 'https://reactjs.org' },
  ])

  const [newItem, setNewItem] = useState({ type: '', content: '' })
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('All')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewItem(prev => ({ ...prev, [name]: value }))
  }

  const addItem = () => {
    if (newItem.type && newItem.content) {
      setData([...data, { ...newItem, id: Date.now() }])
      setNewItem({ type: '', content: '' })
    }
  }

  const startEditing = (item) => {
    setEditingId(item.id)
    setNewItem({ type: item.type, content: item.content })
  }

  const saveEdit = () => {
    setData(data.map(item => 
      item.id === editingId ? { ...item, ...newItem } : item
    ))
    setEditingId(null)
    setNewItem({ type: '', content: '' })
  }

  const deleteItem = (id) => {
    setData(data.filter(item => item.id !== id))
  }

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.content.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterType === 'All' || item.type === filterType
      return matchesSearch && matchesFilter
    })
  }, [data, searchTerm, filterType])

  const ContentViewer = ({ type, content }) => {
    if (type === 'YouTube') {
      return (
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${content.split('v=')[1]}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )
    } else if (type === 'PDF') {
      return (
        <embed src={content} type="application/pdf" width="100%" height="600px" />
      )
    } else if (type === 'URL') {
      return (
        <iframe src={content} width="100%" height="600px" frameBorder="0"></iframe>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search by type or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            <SelectItem value="YouTube">YouTube</SelectItem>
            <SelectItem value="PDF">PDF</SelectItem>
            <SelectItem value="URL">URL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4">
        <Input
          name="type"
          placeholder="Type"
          value={newItem.type}
          onChange={handleInputChange}
        />
        <Input
          name="content"
          placeholder="Content"
          value={newItem.content}
          onChange={handleInputChange}
        />
        <Button onClick={addItem}>Add</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                {editingId === item.id ? (
                  <Input
                    name="type"
                    value={newItem.type}
                    onChange={handleInputChange}
                  />
                ) : (
                  item.type
                )}
              </TableCell>
              <TableCell>
                {editingId === item.id ? (
                  <Input
                    name="content"
                    value={newItem.content}
                    onChange={handleInputChange}
                  />
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link">{item.content}</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>{item.type} Content</DialogTitle>
                      </DialogHeader>
                      <ContentViewer type={item.type} content={item.content} />
                    </DialogContent>
                  </Dialog>
                )}
              </TableCell>
              <TableCell>
                {editingId === item.id ? (
                  <Button onClick={saveEdit}>Save</Button>
                ) : (
                  <>
                    <Button onClick={() => startEditing(item)} className="mr-2">Edit</Button>
                    <Button onClick={() => deleteItem(item.id)} variant="destructive">Delete</Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

