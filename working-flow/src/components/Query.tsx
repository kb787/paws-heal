// import React, { useState } from "react";

// const Query = () => {
//   // Explicitly define the type of uploadedFile
//   const [uploadedFile, setUploadedFile] = useState<File | null>(null);
//   const [query, setQuery] = useState("");
//   const [response, setResponse] = useState("");

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setUploadedFile(file); // Set the uploaded file
//       console.log(`File uploaded: ${file.name}`);
//     }
//   };

//   const handleQuery = () => {
//     if (uploadedFile) {
//       setResponse(`Response for query: "${query}"`);
//     } else {
//       setResponse("Please upload a document first.");
//     }
//   };

//   return (
//     <div>
//       <h1>Document Ingestion and Query</h1>

//       {/* File Upload Section */}
//       <div>
//         <h2>Upload Document</h2>
//         <input type="file" onChange={handleFileUpload} />
//         <button
//           onClick={() => {
//             if (uploadedFile) {
//               alert(`Document "${uploadedFile.name}" uploaded successfully!`);
//             } else {
//               alert("No document selected.");
//             }
//           }}
//         >
//           Upload Document
//         </button>
//       </div>

//       {/* Query Section */}
//       <div>
//         <h2>Ask a Question</h2>
//         <input
//           type="text"
//           placeholder="Enter your query here..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//         />
//         <button onClick={handleQuery}>Ask</button>
//       </div>

//       {/* Response Section */}
//       <div>
//         <h3>Response:</h3>
//         <p>{response}</p>
//       </div>
//     </div>
//   );
// };

// export default Query;
