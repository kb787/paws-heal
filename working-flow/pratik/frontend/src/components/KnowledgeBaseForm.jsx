import React, { useState } from "react";
import { Youtube, FileText, Link } from "lucide-react";
import { useSpring, animated } from "@react-spring/web";

const AnimatedContainer = ({ isVisible, children }) => {
  const animation = useSpring({
    opacity: isVisible ? 1 : 0,
    maxHeight: isVisible ? 1000 : 0,
    overflow: "hidden",
  });

  return <animated.div style={animation}>{children}</animated.div>;
};

const KnowledgeBaseForm = () => {
  const [formData, setFormData] = useState({
    youtubeUrl: "",
    pdfFile: null,
    websiteUrl: "",
    excludeKeywords: "",
    excludeDomains: [],
    crawlLimit: "",
  });

  const [activeInput, setActiveInput] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUrlButtons, setShowUrlButtons] = useState(false);
  const [urlMode, setUrlMode] = useState(null); // 'single' or 'crawling'
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    // Special handling for exclude domains to split into array
    if (name === "excludeDomains") {
      const domainsArray = value.split(',').map(domain => domain.trim()).filter(domain => domain !== "");
      setFormData(prev => ({
        ...prev,
        [name]: domainsArray
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleYouTubeSubmit = async () => {
    if (!formData.youtubeUrl) {
      setMessage("Please enter a valid YouTube URL.");
      return;
    }

    try {
      const response = await fetch(
        "http://smart-india-hackathon-2024.onrender.com/admin/youtube/process-channel/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ channel_handle: formData.youtubeUrl }),
        }
      );

      const data = await response.json();
      setMessage(data.message || "YouTube URL processed successfully.");
    } catch (error) {
      console.log(error);
      setMessage("An error occurred while processing the YouTube URL.");
    }
  };

  const handlePdfUpload = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("pdf_file", file, file.name);

    try {
      const response = await fetch("http://smart-india-hackathon-2024.onrender.com/admin/pdf/process-pdfs", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error processing PDF file");
      }

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error("Upload error:", error);
      setMessage(error.message || "Error processing PDF file");
    } finally {
      setLoading(false);
    }
  };

  const handleSingleUrlSubmit = async () => {
    if (!formData.websiteUrl) {
      setMessage("Please enter a valid website URL.");
      return;
    }

    // Prepare request body with proper formatting
    const requestBody = {
      url: formData.websiteUrl,
      exclude_keywords: formData.excludeKeywords 
        ? formData.excludeKeywords.split(',').map(kw => kw.trim())
        : [],
      exclude_domains: formData.excludeDomains || []
    };

    // Add depth limit for crawling mode
    if (urlMode === "crawling" && formData.crawlLimit) {
      requestBody.depth_limit = parseInt(formData.crawlLimit);
    }

    const endpoint =
      urlMode === "single"
        ? "http://smart-india-hackathon-2024.onrender.com/admin/scrapy/scrape"  // Scraping endpoint
        : "http://smart-india-hackathon-2024.onrender.com/admin/scrapy/crawl";  // Crawling endpoint

    try {
      setLoading(true);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();
      setMessage(data.message || "Request processed successfully.");
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while processing the request.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please select a valid PDF file.");
    }
  };

  const inputFields = [
    {
      name: "youtubeUrl",
      icon: Youtube,
      label: "YouTube URL",
      type: "url",
      placeholder: "Enter YouTube URL",
    },
    { name: "pdfFile", icon: FileText, label: "PDF Upload", type: "file" },
    {
      name: "websiteUrl",
      icon: Link,
      label: "Website URL",
      type: "url",
      placeholder: "Enter website URL",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {inputFields.map((field) => (
            <div
              key={field.name}
              className="bg-gray-800 p-6 rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:bg-[#B026FF]"
              onClick={() => {
                setActiveInput(field.name);
                if (field.name === "websiteUrl") {
                  setShowUrlButtons(true);
                } else {
                  setShowUrlButtons(false);
                }
                setUrlMode(null);
              }}
            >
              <div className="flex items-center justify-center">
                <field.icon className="w-8 h-8 text-[#B026FF]" />
              </div>
              <h3 className="text-lg font-semibold text-center mt-2">
                {field.label}
              </h3>
            </div>
          ))}
        </div>

        <AnimatedContainer isVisible={activeInput !== null}>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-6">
            {activeInput === "youtubeUrl" && (
              <div>
                <label
                  htmlFor="youtubeUrl"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  YouTube URL
                </label>
                <input
                  type="url"
                  id="youtubeUrl"
                  name="youtubeUrl"
                  value={formData.youtubeUrl}
                  onChange={handleInputChange}
                  placeholder="Enter YouTube URL"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B026FF] text-white"
                />
                <button
                  type="button"
                  onClick={handleYouTubeSubmit}
                  className="bg-[#B026FF] text-white py-2 px-6 rounded-lg shadow-md hover:bg-purple-800 transition duration-300 mt-4"
                >
                  Submit
                </button>
              </div>
            )}

            {activeInput === "pdfFile" && (
              <div>
                <label
                  htmlFor="pdfFile"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Upload PDF
                </label>
                <input
                  type="file"
                  id="pdfFile"
                  name="pdfFile"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B026FF] text-white"
                />
                <button
                  type="button"
                  onClick={handlePdfUpload}
                  className="bg-[#B026FF] text-white py-2 px-6 rounded-lg shadow-md hover:bg-purple-800 transition duration-300 mt-4"
                >
                  Upload
                </button>
              </div>
            )}

            {activeInput === "websiteUrl" && (
              <div>
                {showUrlButtons && (
                  <div className="mt-6 mb-4 flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setUrlMode("single")}
                      className="bg-gray-700 text-white py-2 px-6 rounded-lg shadow-md border border-gray-600 text-sm font-medium hover:bg-[#B026FF] transition duration-300"
                    >
                      Single URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setUrlMode("crawling")}
                      className="bg-gray-700 text-white py-2 px-6 rounded-lg shadow-md border border-gray-600 text-sm font-medium hover:bg-[#B026FF] transition duration-300"
                    >
                      Crawling
                    </button>
                  </div>
                )}

                {urlMode && (
                  <div className="space-y-4">
                    <label
                      htmlFor="websiteUrl"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Website URL
                    </label>
                    <input
                      type="url"
                      id="websiteUrl"
                      name="websiteUrl"
                      value={formData.websiteUrl}
                      onChange={handleInputChange}
                      placeholder="Enter website URL"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B026FF] text-white"
                    />
                    <div>
                      <label
                        htmlFor="excludeKeywords"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Exclude Keywords (comma-separated)
                      </label>
                      <input
                        type="text"
                        id="excludeKeywords"
                        name="excludeKeywords"
                        value={formData.excludeKeywords}
                        onChange={handleInputChange}
                        placeholder="e.g., keyword1, keyword2"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B026FF] text-white"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="excludeDomains"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Exclude Domains
                      </label>
                      <input
                        type="text"
                        id="excludeDomains"
                        name="excludeDomains"
                        value={formData.excludeDomains.join(', ')}
                        onChange={handleInputChange}
                        placeholder="e.g., example.com, test.com"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B026FF] text-white"
                      />
                    </div>
                    {urlMode === "crawling" && (
                      <div>
                        <label
                          htmlFor="crawlLimit"
                          className="block text-sm font-medium text-gray-300 mb-2"
                        >
                          Crawling Limit
                        </label>
                        <input
                          type="number"
                          id="crawlLimit"
                          name="crawlLimit"
                          value={formData.crawlLimit}
                          onChange={handleInputChange}
                          placeholder="Enter number of pages to crawl"
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B026FF] text-white"
                        />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={handleSingleUrlSubmit}
                      disabled={loading}
                      className={`bg-[#B026FF] text-white py-2 px-6 rounded-lg shadow-md hover:bg-purple-800 transition duration-300 mt-4 ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {loading ? 'Processing...' : 'Submit'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </AnimatedContainer>
        {message && (
          <p className={`text-center text-sm font-semibold mt-4 ${
            message.includes('error') ? 'text-red-500' : 'text-green-500'
          }`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default KnowledgeBaseForm;