import React, { useState } from 'react';
import * as xlsx from 'xlsx';
import { 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Download,
  Info,
  Settings,
  ChevronRight,
  UploadCloud,
  FileText,
  Hash
} from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const BulkImport = () => {
  const [file, setFile] = useState(null);
  const [importType, setImportType] = useState('students');
  const [preview, setPreview] = useState([]);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setDetails(null);
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target.result;
        const wb = xlsx.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = xlsx.utils.sheet_to_json(ws, { header: 1 });
        if (data.length > 0) {
          const headers = data[0] || [];
          const rows = data.slice(1, 6).map(row => {
            const obj = {};
            headers.forEach((h, i) => obj[h] = row[i]);
            return obj;
          });
          setPreview(rows);
        }
      };
      reader.readAsBinaryString(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus('processing');
    setMessage(`Uploading ${importType} data...`);
    setDetails(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const endpoint = `${API_BASE_URL}/api/import/${importType}`;

      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Upload failed with status: ${res.status}`);
      }

      setStatus('success');
      setMessage(`Successfully imported ${data.recordsInserted} records. Skipped ${data.skipped} rows.`);
      setDetails({
        inserted: data.recordsInserted,
        skipped: data.skipped,
        skippedReasons: data.skippedReasons || [],
        errors: data.errors || []
      });

      setFile(null);
      setPreview([]);
    } catch (err) {
      console.error("Bulk Import Error:", err);
      setStatus('error');
      setMessage(`Import failed: ${err.message}`);
    }
  };

  const getTemplate = () => {
    let headers = [];
    let sampleData = [];
    
    if (importType === 'students') {
      headers = ['Register Number', 'Student Name', 'Department', 'Year', 'Section', 'Semester', 'Gender', 'Date of Birth', 'Email', 'Mobile Number', 'Community'];
      sampleData = ['622023148001', 'AARTHISRI P', 'CSE(AI&ML)', '3', 'B', '5', 'Female', '2004-03-10', 'example@gmail.com', '9876543210', 'BC'];
    } else if (importType === 'marks') {
      headers = ['Register Number', 'Subject', 'Internal', 'External'];
      sampleData = ['622023148001', 'Natural Language Processing', '45', '75'];
    } else if (importType === 'attendance') {
      headers = ['Register Number', 'Subject', 'Date', 'Status'];
      sampleData = ['622023148001', 'Natural Language Processing', '2023-11-20', 'Present'];
    }

    const worksheet = xlsx.utils.aoa_to_sheet([headers, sampleData]);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Template");
    xlsx.writeFile(workbook, `${importType}_template.xlsx`);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <span className="w-6 h-1 bg-[#355c7d] rounded-full"></span>
             <span className="text-[10px] font-black text-[#355c7d] uppercase tracking-[0.3em]">Data Integration</span>
          </div>
          <h1 className="text-4xl font-black text-[#2c2c2c] tracking-tighter">Bulk Acquisition</h1>
          <p className="text-gray-400 text-sm font-semibold mt-1 italic tracking-tight">Massive record ingestion via structural data modules.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm ring-1 ring-[#355c7d]/5 transition-all">
          <Settings size={20} className="text-[#355c7d] ml-3" />
          <select 
            className="bg-transparent border-none focus:ring-0 text-[11px] font-black text-[#2c2c2c] uppercase tracking-widest pr-10 py-3 cursor-pointer"
            value={importType}
            onChange={(e) => {
              setImportType(e.target.value);
              setPreview([]);
              setFile(null);
              setStatus('idle');
              setDetails(null);
            }}
          >
            <option value="students">STUDENT MASTER</option>
            <option value="marks">ACADEMIC SCORES</option>
            <option value="attendance">ATTENDANCE LOGS</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="bg-white p-12 rounded-[40px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col items-center justify-center text-center group hover:border-[#355c7d]/30 transition-all cursor-pointer relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-50 group-hover:bg-[#355c7d] transition-colors duration-500"></div>
            <input 
              type="file" 
              accept=".csv, .xlsx, .xls" 
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className="p-8 bg-gray-50 rounded-[32px] text-[#355c7d] mb-8 group-hover:scale-110 group-hover:bg-[#355c7d] group-hover:text-white transition-all duration-500 shadow-inner">
               <UploadCloud size={48} />
            </div>
            <h3 className="text-xl font-black text-[#2c2c2c] mb-3 tracking-tighter uppercase italic">
              {file ? file.name : `SOURCE ${importType} FILE`}
            </h3>
            <p className="text-gray-400 text-xs max-w-xs leading-relaxed font-black uppercase tracking-widest opacity-60">
              Drag file here or initiate browser. <br/>Supports .xlsx / .csv
            </p>
          </div>

          <div className="bg-[#355c7d]/5 p-8 rounded-[30px] flex gap-6 border border-[#355c7d]/10 group transition-all">
             <div className="text-[#355c7d] grow-0 group-hover:rotate-12 transition-transform"><Info size={28} /></div>
             <div>
                <h4 className="text-[11px] font-black text-[#355c7d] uppercase tracking-[0.2em] mb-2">Acquisition Policy</h4>
                <p className="text-xs text-[#355c7d]/70 italic leading-[1.6] font-medium">
                  {importType === 'students' 
                    ? "Populate student core archives first. Registry IDs & Identity strings are mandatory identifiers."
                    : "Validate Registry IDs against global database before ingestion. Non-indexed rows will be aborted."}
                </p>
             </div>
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || status === 'processing'}
            className={`w-full py-6 rounded-[24px] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl relative overflow-hidden group
              ${status === 'processing' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#355c7d] text-white hover:brightness-110 active:scale-95 shadow-[#355c7d]/20'}
            `}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {status === 'processing' ? 'PROCESSING ENCRYPTION...' : `ENGAGE ${importType} INGESTION`}
              <ChevronRight size={18} />
            </span>
          </button>

          {status === 'success' && (
            <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
              <div className="bg-emerald-50 p-6 rounded-2xl flex items-center gap-4 text-emerald-700 font-black text-[11px] uppercase tracking-widest border border-emerald-100 shadow-sm">
                 <CheckCircle2 size={24} />
                 {message}
              </div>
              
              {details && (details.skipped > 0 || details.errors.length > 0) && (
                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                  {details.skipped > 0 && (
                    <div className="mb-4">
                      <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <AlertCircle size={14} /> Aborted {details.skipped} Rows
                      </p>
                      {details.skippedReasons && details.skippedReasons.length > 0 && (
                        <ul className="space-y-1.5 ml-6">
                          {details.skippedReasons.slice(0, 3).map((r, idx) => <li key={idx} className="text-[10px] font-bold text-amber-700/80 italic">• {r}</li>)}
                          {details.skippedReasons.length > 3 && <li className="text-[10px] font-bold text-amber-400">...additional logs hidden</li>}
                        </ul>
                      )}
                    </div>
                  )}
                  {details.errors && details.errors.length > 0 && (
                     <div>
                       <p className="text-[10px] font-black text-rose-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                         <Hash size={14} /> System Anomalies ({details.errors.length})
                       </p>
                       <ul className="space-y-1.5 ml-6">
                          {details.errors.slice(0, 3).map((err, idx) => <li key={idx} className="text-[10px] font-bold text-rose-600/80 italic">• {err}</li>)}
                       </ul>
                     </div>
                  )}
                </div>
              )}
            </div>
          )}
          {status === 'error' && (
            <div className="bg-rose-50 p-6 rounded-2xl flex items-center gap-4 text-rose-700 font-black text-[11px] uppercase tracking-widest border border-rose-100 shadow-sm animate-in shake-in duration-500">
               <AlertCircle size={24} />
               {message}
            </div>
          )}
        </div>

        <div className="space-y-6">
           <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-sm font-black text-[#2c2c2c] uppercase tracking-[0.2em] flex items-center gap-2">
                <FileText size={18} className="text-[#355c7d]" /> Record Sandbox
              </h2>
              <button 
                onClick={getTemplate}
                className="flex items-center gap-2 text-[9px] font-black text-white bg-[#355c7d] px-5 py-2.5 rounded-full shadow-lg shadow-[#355c7d]/10 hover:brightness-125 transition-all uppercase tracking-widest"
              >
                 <Download size={14} /> Get Blueprint
              </button>
           </div>
           
           <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-50 overflow-hidden group">
              <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead className="bg-gray-50/80 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <tr>
                           {(preview?.length > 0 && preview[0]) ? Object.keys(preview[0]).slice(0, 4).map(key => (
                             <th key={key} className="px-6 py-5 border-b border-gray-100">{key}</th>
                           )) : (
                             <th className="px-6 py-5 border-b border-gray-100">ARCHIVE PREVIEW</th>
                           )}
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50 italic">
                        {preview?.length > 0 ? (
                          preview.map((row, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                               {Object.values(row || {}).slice(0, 4).map((val, j) => (
                                 <td key={j} className="px-6 py-5 text-[#2c2c2c] font-bold text-[13px] whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] tracking-tight">
                                   {val}
                                 </td>
                               ))}
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan="4" className="px-6 py-20 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest italic opacity-60">Source file not engaged for analysis</td></tr>
                        )}
                     </tbody>
                  </table>
              </div>
           </div>
           
           <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
             <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
               <Settings size={14} /> Acquisition Statistics
             </h4>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Max Queue</p>
                   <p className="text-xl font-black text-[#2c2c2c]">10k Records</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Timeout</p>
                   <p className="text-xl font-black text-[#2c2c2c]">300 Seconds</p>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BulkImport;
