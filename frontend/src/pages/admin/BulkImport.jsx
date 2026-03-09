import React, { useState } from 'react';
import Papa from 'papaparse';
import { 
  FileSpreadsheet, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Download,
  Info,
  Settings
} from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const BulkImport = () => {
  const [file, setFile] = useState(null);
  const [importType, setImportType] = useState('students');
  const [preview, setPreview] = useState([]);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      Papa.parse(selectedFile, {
        header: true,
        complete: (results) => {
          setPreview(results.data.slice(0, 5));
        }
      });
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus('processing');
    setMessage(`Uploading ${importType} data...`);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target.result;
        const results = Papa.parse(text, { header: true });
        
        // Remove empty rows
        const validData = (results.data || []).filter(row => row && Object.values(row).some(v => v));
        
        const endpoint = `${API_BASE_URL}/api/${importType}/bulk`;
        console.log(`Processing bulk upload to: ${endpoint}`);

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validData)
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `Upload failed with status: ${res.status}`);
        }

        setStatus('success');
        setMessage(`Successfully imported ${validData.length} records!`);
        setFile(null);
        setPreview([]);
      } catch (err) {
        console.error("Bulk Import Error:", err);
        setStatus('error');
        setMessage(`Import failed: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const getTemplate = () => {
    let content = '';
    if (importType === 'students') content = 'roll,name,department,year,semester,email,phone\n21AIML01,John Doe,AIML,3,1,john@edu.com,9876543210';
    else if (importType === 'marks') content = 'roll,subject,examType,marks,credits\n21AIML01,Mathematics,Internal,85,3';
    else if (importType === 'attendance') content = 'roll,subject,date,status\n21AIML01,Mathematics,2026-03-12,Present';

    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${importType}_template.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Advanced Bulk Import</h1>
          <p className="text-gray-500 text-sm">Efficiently manage thousands of records via CSV modules</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
          <Settings size={18} className="text-gray-400 ml-2" />
          <select 
            className="bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-700 pr-8"
            value={importType}
            onChange={(e) => {
              setImportType(e.target.value);
              setPreview([]);
              setFile(null);
              setStatus('idle');
            }}
          >
            <option value="students">Students Module</option>
            <option value="marks">Academics (Marks)</option>
            <option value="attendance">Attendance Records</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-10 rounded-3xl border-4 border-dashed border-gray-100 flex flex-col items-center justify-center text-center group hover:border-[#0f3d3e] transition-all cursor-pointer relative overflow-hidden">
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className="p-5 bg-[#0f3d3e]/5 rounded-full text-[#0f3d3e] mb-6 group-hover:scale-110 transition-transform">
               <FileSpreadsheet size={40} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {file ? file.name : `Choose ${importType.charAt(0).toUpperCase() + importType.slice(1)} CSV`}
            </h3>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed font-medium">
              Drag and drop your file here or click to browse. Ensure it matches the template.
            </p>
          </div>

          <div className="bg-blue-50/50 p-6 rounded-2xl flex gap-4 border border-blue-100/50">
             <div className="text-blue-500 grow-0"><Info size={24} /></div>
             <div>
                <h4 className="text-sm font-bold text-blue-800 mb-1">Upload Guidelines ({importType})</h4>
                <p className="text-xs text-blue-700/80 italic leading-relaxed">
                  Bulk operations allow you to insert thousands of records instantly. Ensure all roll numbers exist in the students database before importing marks or attendance.
                </p>
             </div>
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || status === 'processing'}
            className={`w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg
              ${status === 'processing' ? 'bg-gray-100 text-gray-400' : 'bg-[#0f3d3e] text-white hover:bg-[#0b2b2c]'}
            `}
          >
            {status === 'processing' ? 'Processing Transaction...' : `Import ${importType} now`}
          </button>

          {status === 'success' && (
            <div className="bg-green-50 p-4 rounded-xl flex items-center gap-3 text-green-700 font-bold border border-green-100 shadow-sm">
               <CheckCircle2 size={20} />
               {message}
            </div>
          )}
          {status === 'error' && (
            <div className="bg-red-50 p-4 rounded-xl flex items-center gap-3 text-red-700 font-bold border border-red-100 shadow-sm">
               <AlertCircle size={20} />
               {message}
            </div>
          )}
        </div>

        <div className="space-y-4">
           <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Preview (First 5 records)</h2>
              <button 
                onClick={getTemplate}
                className="flex items-center gap-2 text-xs font-bold text-[#0f3d3e] bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-all uppercase tracking-tighter"
              >
                 <Download size={14} /> Template
              </button>
           </div>
           
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                     <thead className="bg-gray-50/50 text-gray-500 font-bold uppercase tracking-widest">
                        <tr>
                           {(preview?.length > 0 && preview[0]) ? Object.keys(preview[0]).slice(0, 3).map(key => (
                             <th key={key} className="px-4 py-4">{key}</th>
                           )) : (
                             <th className="px-4 py-4">Preview</th>
                           )}
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50 italic">
                        {preview?.length > 0 ? (
                          preview.map((row, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                               {Object.values(row || {}).slice(0, 3).map((val, j) => (
                                 <td key={j} className="px-4 py-4 text-gray-600 font-medium">
                                   {typeof val === 'string' && val.length > 20 ? val.substring(0, 20) + '...' : val}
                                 </td>
                               ))}
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan="3" className="px-4 py-10 text-center text-gray-400 font-medium">No file selected for preview.</td></tr>
                        )}
                     </tbody>
                  </table>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BulkImport;
