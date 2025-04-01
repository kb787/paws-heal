import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { Youtube, FileText, Link2, Edit2, Trash2 } from "lucide-react";

const DataTable = () => {
  const [data, setData] = useState([]);
  const [newItem, setNewItem] = useState({ type: "", content: "" });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    type: "",
    content: "",
    filename: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const pdfResponse = await axios.get(
          "http://localhost:3000/api/pdf-files"
        );
        const youtubeResponse = await axios.get(
          "http://localhost:3000/api/youtube-links"
        );

        // Create a Set to track unique content
        const uniqueContent = new Set();

        const combinedData = [
          ...pdfResponse.data.files
            .filter((file) => {
              // Check if this content is already seen
              if (uniqueContent.has(file.fullPath)) {
                return false;
              }
              uniqueContent.add(file.fullPath);
              return true;
            })
            .map((file) => ({
              id: file.id,
              type: "PDF",
              content: file.fullPath,
              filename: file.filename || file.originalName || "Unnamed PDF",
            })),
          ...youtubeResponse.data.links
            .filter((link) => {
              // Check if this YouTube link is already seen
              if (uniqueContent.has(link.link)) {
                return false;
              }
              uniqueContent.add(link.link);
              return true;
            })
            .map((link) => ({
              id: link.id,
              type: "YouTube",
              content: link.link,
            })),
        ];

        setData(combinedData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          "Failed to fetch data: " +
            (err.response?.data?.message || err.message)
        );
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const addItem = async () => {
    if (newItem.type && newItem.content) {
      try {
        // Generate a unique id based on type and content
        const newItemWithId = {
          ...newItem,
          id: `${newItem.type.toLowerCase()}-${newItem.content}`,
        };

        // Check if item already exists
        const isDuplicate = data.some((item) => item.id === newItemWithId.id);

        if (!isDuplicate) {
          setData([...data, newItemWithId]);
          setNewItem({ type: "", content: "" });
        } else {
          alert("This item already exists!");
        }
      } catch (err) {
        console.error("Error adding item:", err);
      }
    }
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setNewItem({ type: item.type, content: item.content });
  };

  const saveEdit = () => {
    setData(
      data.map((item) =>
        item.id === editingId ? { ...item, ...newItem } : item
      )
    );
    setEditingId(null);
    setNewItem({ type: "", content: "" });
  };

  const deleteItem = async (id) => {
    try {
      // Clear any previous errors
      setError(null);

      // Call backend delete endpoint
      await axios.delete(`http://localhost:3000/api/delete-resource/${id}`);

      // Remove the item from local state
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting resource:", error);

      // Set error state to show in UI
      setError(error.response?.data?.message || "Failed to delete resource");
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.content &&
          item.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.filename &&
          item.filename.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = filterType === "All" || item.type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [data, searchTerm, filterType]);

  const openModal = (item) => {
    setModalContent({
      type: item.type,
      content: item.content,
      filename: item.filename || "Unnamed PDF",
    });
    setShowModal(true);
  };

  const ContentViewer = ({ type, content, filename }) => {
    if (type === "YouTube") {
      const getYouTubeId = (url) => {
        try {
          const urlParams = new URL(url);
          return (
            urlParams.searchParams.get("v") ||
            url.split("/").pop() ||
            url.split("=").pop()
          );
        } catch (error) {
          console.error("Invalid YouTube URL", error);
          return null;
        }
      };

      const videoId = getYouTubeId(content);

      return videoId ? (
        <iframe
          width="100%"
          height="480"
          src={`https://www.youtube.com/embed/${videoId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <p>Invalid YouTube URL</p>
      );
    } else if (type === "PDF") {
      return (
        <div className="w-full h-[600px]">
          <p className="mb-4 font-semibold">
            Filename: {filename || "Unnamed PDF"}
          </p>
          <iframe
            src={content}
            width="100%"
            height="500px"
            type="application/pdf"
          >
            <p>
              Your browser does not support PDFs.
              <a href={content}>Download the PDF</a> instead.
            </p>
          </iframe>
        </div>
      );
    }
    return null;
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent({ type: "", content: "", filename: "" });
  };

  // Loading and error states
  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  return (
    <div className="space-y-4 p-4 ">
      {/* Modal for Content Viewing */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{modalContent.type} Content</h2>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>
            <ContentViewer
              type={modalContent.type}
              content={modalContent.content}
              filename={modalContent.filename}
            />
          </div>
        </div>
      )}

      {/* Error Handling */}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="Search by type, content, or filename..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Types</option>
          <option value="YouTube" className="bg-black">YouTube Links</option>
          <option value="PDF">PDF Files</option>
        </select>
      </div>

      {/* Add new item section */}
      <div className="flex gap-4">
        <select
          name="type"
          value={newItem.type}
          onChange={handleInputChange}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Type</option>
          <option value="YouTube" >YouTube</option>
          <option value="PDF">PDF</option>
        </select>
        <input
          type="text"
          name="content"
          placeholder="Content URL"
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

      {/* Data Table */}
      <table className="min-w-full text-black bg-white shadow-md rounded-lg overflow-hidden">
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
                  <select
                    name="type"
                    value={newItem.type}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  >
                    <option value="YouTube">YouTube</option>
                    <option value="PDF">PDF</option>
                  </select>
                ) : (
                  <div className="flex items-center">
                    {item.type === "YouTube" ? (
                      <Youtube size={18} className="mr-2" />
                    ) : (
                      <FileText size={18} className="mr-2" />
                    )}
                    {item.type}
                  </div>
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
                    className="text-blue-500 hover:underline truncate max-w-xs flex items-center"
                  >
                    <Link2 size={16} className="mr-2" />
                    {item.type === "PDF"
                      ? item.filename || "Unnamed PDF"
                      : item.content}
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
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(item)}
                      className="p-1 text-blue-500 hover:text-blue-700 transition duration-300"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-1 text-red-500 hover:text-red-700 transition duration-300"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* No items message */}
      {filteredData.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          No items found. Add some YouTube links or PDF files!
        </div>
      )}
    </div>
  );
};

export default DataTable;
