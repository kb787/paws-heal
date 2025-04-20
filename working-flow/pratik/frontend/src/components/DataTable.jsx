import React, { useState, useMemo } from 'react';
import { Youtube, FileText, Link2, Edit2, Trash2 } from 'lucide-react';

const DataTable = () => {
  const [data, setData] = useState([
    { id: 1, type: 'YouTube', content: 'https://youtube.com/watch?v=123' },
    { id: 2, type: 'PDF', content: 'JavaScript_Guide.pdf' },
    { id: 3, type: 'URL', content: 'https://example.com' },
    { id: 4, type: 'YouTube', content: 'https://youtube.com/watch?v=456' },
    { id: 5, type: 'PDF', content: 'React_Tutorial.pdf' },
    { id: 6, type: 'URL', content: 'https://reactjs.org' },
  ]);

  const [newItem, setNewItem] = useState({ type: '', content: '' });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ type: '', content: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const addItem = () => {
    if (newItem.type && newItem.content) {
      setData([...data, { ...newItem, id: Date.now() }]);
      setNewItem({ type: '', content: '' });
    }
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setNewItem({ type: item.type, content: item.content });
  };

  const saveEdit = () => {
    setData(data.map(item => 
      item.id === editingId ? { ...item, ...newItem } : item
    ));
    setEditingId(null);
    setNewItem({ type: '', content: '' });
  };

  const deleteItem = (id) => {
    setData(data.filter(item => item.id !== id));
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'All' || item.type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [data, searchTerm, filterType]);

  const openModal = (item) => {
    setModalContent(item);
    setShowModal(true);
  };

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
      );
    } else if (type === 'PDF') {
      return (
        <embed src={content} type="application/pdf" width="100%" height="600px" />
      );
    } else if (type === 'URL') {
      return (
        <iframe src={content} width="100%" height="600px" frameBorder="0"></iframe>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="Search by type or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Types</option>
          <option value="YouTube">YouTube</option>
          <option value="PDF">PDF</option>
          <option value="URL">URL</option>
        </select>
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          name="type"
          placeholder="Type"
          value={newItem.type}
          onChange={handleInputChange}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="content"
          placeholder="Content"
          value={newItem.content}
          onChange={handleInputChange}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addItem}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
        >
          Add
        </button>
      </div>

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Type</th>
            <th className="px-4 py-2 text-left">Content</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="px-4 py-2">
                {editingId === item.id ? (
                  <input
                    type="text"
                    name="type"
                    value={newItem.type}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                ) : (
                  item.type
                )}
              </td>
              <td className="px-4 py-2">
                {editingId === item.id ? (
                  <input
                    type="text"
                    name="content"
                    value={newItem.content}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                ) : (
                  <button
                    onClick={() => openModal(item)}
                    className="text-blue-500 hover:underline"
                  >
                    {item.content}
                  </button>
                )}
              </td>
              <td className="px-4 py-2">
                {editingId === item.id ? (
                  <button
                    onClick={saveEdit}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
                  >
                    Save
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => startEditing(item)}
                      className="p-1 text-blue-500 hover:text-blue-700 transition duration-300"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-1 text-red-500 hover:text-red-700 transition duration-300 ml-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
            <h2 className="text-xl font-bold mb-4">{modalContent.type} Content</h2>
            <ContentViewer type={modalContent.type} content={modalContent.content} />
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;

