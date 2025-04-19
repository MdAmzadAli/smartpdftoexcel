import React, {useRef, useState } from "react";
import { UploadCloud, Settings, XCircle, Loader2 } from "lucide-react";
import axios from "axios";
import FeedbackModal from "./feedback";
import { domain } from "./helper/domain";
const PdfToExcelPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [conversionDone, setConversionDone] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const fileInputRef = useRef();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setDownloadUrl(null);
    if (file?.type === "application/pdf") {
      setSelectedFile(file);
      
    } else {
      alert("Please upload a valid PDF file.");
    }
  };
 
  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    setDownloadUrl(null);
    if (file?.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDelete = () => {
    setSelectedFile(null);
    setIsConverting(false);
    setDownloadUrl(null);
  };

  const handleConvert = async() => {
    // console.log("in convert");
    if (!selectedFile) return;
    setIsConverting(true);
    // console.log("converting with file",selectedFile);
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    try {
      // console.log("sending data to backend");
      const res = await axios.post(`${domain}/convert`, formData);
      // console.log(res.data);
      setDownloadUrl(`${domain}/${res.data.download_url}`);
      setConversionDone(true);
      setShowFeedbackModal(true);
    } catch (err) {
      console.error(err);
      alert('Something went wrong!');
    } finally {
      
      setIsConverting(false);
    } // simulate conversion delay
  };

  return (
    <div className=" bg-gray-100 text-gray-800">
     
      <header className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
        <div className="flex items-center ">
          <span className="text-2xl font-bold text-black">Doc</span>
          <span className="text-2xl font-bold text-black">2</span>
          <span className="text-2xl font-bold text-red-600">Excel</span>
        </div>

        <nav className="hidden md:flex gap-6 font-medium text-sm">
          {/* <a href="#" className="hover:text-red-600">MERGE PDF</a>
          <a href="#" className="hover:text-red-600">SPLIT PDF</a>
          <a href="#" className="hover:text-red-600">COMPRESS PDF</a>
          <a href="#" className="hover:text-red-600">CONVERT PDF</a>
          <a href="#" className="hover:text-red-600">ALL PDF TOOLS</a> */}
        </nav>

        <div className="flex gap-3">
          {/* <button className="border border-gray-300 px-4 py-1 rounded hover:bg-gray-200">Login</button>
          <button className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">Sign up</button> */}
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Convert PDF to EXCEL</h1>
        <p className="text-lg mb-2">Convert PDF Data to EXCEL Spreadsheets.</p>
        {/* <p className="text-sm text-gray-600">
          Powered by <span className="text-red-500 font-medium">Solid Documents</span>.
        </p> */}

        {/* Upload Area */}
        <div
          className={`mt-10 w-full max-w-md border-2 border-dashed rounded-lg p-6 bg-white transition-all duration-200 ${
            dragActive ? "border-red-500" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!selectedFile && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <label >
                <button  onClick={openFilePicker} className="bg-red-500 text-white text-lg font-semibold px-8 py-4 rounded shadow hover:bg-red-600 w-full" >
                  Select PDF file
                </button>
              </label>
              <p className="mt-2 text-sm text-gray-500">or drop PDF here</p>
            </>
          )}

{selectedFile && !conversionDone && (
  <div className="flex flex-col items-center space-y-4">
    <div className="text-green-600 text-sm">
      ✅ Uploaded: <strong>{selectedFile.name}</strong>
    </div>

    <div className="flex gap-4">
      <button
        onClick={handleDelete}
        disabled={isConverting}
        className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700"
      >
        Delete
      </button>

      <button
        onClick={handleConvert}
        disabled={isConverting}
        className={`flex items-center gap-2 px-4 py-2 rounded text-white text-sm font-medium ${
          isConverting ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
        }`}
      >
        {isConverting && (
          <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
        )}
        {isConverting ? "Converting..." : "Convert to Excel"}
      </button>
    </div>
  </div>
)}

{conversionDone && (
  <div className="flex flex-col items-center space-y-4">
    <div className="text-green-700 text-sm font-medium">
      ✅ Conversion complete!
    </div>
     <a href={downloadUrl} download>
    <button
      
      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded shadow"
    >
      Download Excel File
    </button>
    </a>
  </div>
)}
        </div>
      </main>
<FeedbackModal show={showFeedbackModal} onClose={()=>setShowFeedbackModal(false)} />
      {/* Footer */}
      {/* <footer className="text-center text-sm text-gray-400 py-4 border-t">
        © iLovePDF 2025 • Your PDF Editor
      </footer> */}
    </div>
  );
};

export default PdfToExcelPage;
