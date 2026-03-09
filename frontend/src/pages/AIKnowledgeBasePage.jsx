import React, { useState } from 'react';
import { UploadCloud, FileText, Search, Trash2, Eye, FileArchive } from 'lucide-react';

const AIKnowledgeBasePage = () => {
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Data Structures Syllabus V2', category: 'Syllabus', date: '2026-03-01', type: 'PDF' },
    { id: 2, name: 'OS Question Paper 2025', category: 'Question Papers', date: '2026-03-05', type: 'PDF' },
    { id: 3, name: 'Academic Calendar 2026', category: 'Academic Calendar', date: '2026-02-15', type: 'DOCX' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Syllabus');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !selectedFile) {
      alert("Please provide a title and select a file.");
      return;
    }
    
    const fileExt = selectedFile.name.split('.').pop().toUpperCase();
    const newDoc = {
      id: Date.now(),
      name: uploadTitle.trim(),
      category: uploadCategory,
      date: new Date().toISOString().split('T')[0],
      type: fileExt
    };

    setDocuments([newDoc, ...documents]);
    setUploadTitle('');
    setUploadCategory('Syllabus');
    setSelectedFile(null);
    e.target.reset(); // reset the file input
  };

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this document from the AI Knowledge Base?")) {
       setDocuments(documents.filter(doc => doc.id !== id));
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center px-6 shrink-0 sticky top-0 z-20">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <UploadCloud className="text-[#0f3d3e]" size={24} />
          AI Knowledge Base Manager
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN: Upload & Bulk Upload */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Single Upload Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
             <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
               <FileText size={20} className="text-[#0f3d3e]" />
               Upload Single Document
             </h2>
             
             <form onSubmit={handleFileUpload} className="space-y-5">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Document Title</label>
                 <input 
                   type="text" 
                   value={uploadTitle}
                   onChange={e => setUploadTitle(e.target.value)}
                   placeholder="e.g. DBMS Unit 1 Notes" 
                   className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f3d3e] transition-colors"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                 <select 
                   value={uploadCategory}
                   onChange={e => setUploadCategory(e.target.value)}
                   className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f3d3e] transition-colors bg-white"
                 >
                   <option>Syllabus</option>
                   <option>Study Materials</option>
                   <option>Question Papers</option>
                   <option>Timetable</option>
                   <option>Academic Calendar</option>
                   <option>Other</option>
                 </select>
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Select File (PDF, DOCX, PPT, TXT)</label>
                 <input 
                   type="file" 
                   accept=".pdf,.docx,.doc,.ppt,.pptx,.txt"
                   onChange={e => setSelectedFile(e.target.files[0])}
                   className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                 />
               </div>

               <button 
                 type="submit"
                 className="w-full bg-[#0f3d3e] text-white rounded-md py-3 font-medium hover:bg-[#0b2b2c] transition-colors flex items-center justify-center gap-2"
               >
                 <UploadCloud size={18} />
                 Upload Document
               </button>
             </form>
          </div>

          {/* Bulk Upload Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
             <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
               <FileArchive size={20} className="text-[#0f3d3e]" />
               Bulk Upload Docs
             </h2>
             <p className="text-sm text-gray-600 mb-4">Upload multiple PDFs at once, or a ZIP file containing multiple documents.</p>
             <label className="w-full bg-gray-50 border border-dashed border-gray-400 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                <UploadCloud size={32} className="text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-700">Click to browse files or ZIP</span>
                <span className="text-xs text-gray-500 mt-1">Accepts multiple .pdf or .zip</span>
                <input type="file" multiple accept=".pdf,.zip" className="hidden" />
             </label>
          </div>

        </div>

        {/* RIGHT COLUMN: Document Table & Search */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col overflow-hidden h-full min-h-[500px]">
          
          <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Uploaded Documents</h2>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search title or category..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f3d3e] focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocs.length > 0 ? (
                  filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                          {doc.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{doc.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-4 transition-colors" title="View Document">
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(doc.id)}
                          className="text-red-600 hover:text-red-900 transition-colors" 
                          title="Delete Document"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-sm text-gray-500 bg-gray-50">
                      No documents found matching "{searchQuery}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 p-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Documents uploaded here will be embedded into the knowledge graph for DAVIZ AI Assistant.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIKnowledgeBasePage;
