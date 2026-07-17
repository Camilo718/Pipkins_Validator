import { Upload } from 'lucide-react';
import { useState } from 'react';

export default function ExcelUpload({ onFileUpload }) {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileUpload(file);
    }
  };

  return (
    <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-indigo-400 transition">
      <div className="flex items-center justify-center space-x-4">
        <div className="bg-indigo-50 p-3 rounded-lg">
          <Upload className="w-6 h-6 text-indigo-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-700">
            {fileName || 'Drop your Pipkins Excel file here or click to browse'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Supported formats: .xlsx, .xls
          </p>
        </div>
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />
          <span className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
            Browse
          </span>
        </label>
      </div>
    </div>
  );
}