"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'

export function KnowledgeBaseForm() {
  const [formData, setFormData] = useState({
    youtubeUrl: '',
    pdfFile: null,
    websiteUrl: '',
  })

  const handleInputChange = (e) => {
    const { name, value, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData)
    // Reset form after submission
    setFormData({ youtubeUrl: '', pdfFile: null, websiteUrl: '' })
    toast({
      title: "Resource added",
      description: "Your resource has been successfully added to the knowledge base.",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>YouTube URL</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="url"
            name="youtubeUrl"
            placeholder="Enter YouTube URL"
            value={formData.youtubeUrl}
            onChange={handleInputChange}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>PDF Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="file"
            name="pdfFile"
            accept=".pdf"
            onChange={handleInputChange}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Website URL</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="url"
            name="websiteUrl"
            placeholder="Enter website URL"
            value={formData.websiteUrl}
            onChange={handleInputChange}
          />
        </CardContent>
      </Card>

      <div className="col-span-full">
        <Button type="submit" className="w-full">Submit</Button>
      </div>
    </form>
  )
}

