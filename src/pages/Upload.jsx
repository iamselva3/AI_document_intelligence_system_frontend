import { useState, useRef } from 'react';
import { uploadDocument } from '../services/endpoints';
import { motion } from 'framer-motion';
import { UploadCloud, CheckCircle, XCircle } from 'lucide-react';

const Upload = () => {
    const [files, setFiles] = useState([]);
    const [status, setStatus] = useState('idle'); // idle, uploading, success, error
    const [statusText, setStatusText] = useState("");
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
            setFiles(prev => [...prev, ...droppedFiles]);
        }
    };

    const handleUpload = async () => {
        if (files.length === 0) return;
        setStatus('uploading');
        setStatusText(`Uploading ${files.length} document(s)...`);
        
        try {
            await uploadDocument(files);
            setStatus('success');
            setStatusText(`${files.length} invoices uploaded and queued successfully!`);
            setFiles([]);
        } catch (error) {
            setStatus('error');
            setStatusText("Failed to upload documents. Please try again.");
            console.error(error);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Ingest New Document</h2>

            <div className="glass-panel p-10 flex flex-col items-center justify-center min-h-[400px]">
                {status === 'idle' && (
                    <motion.div 
                        initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                        className="flex flex-col items-center cursor-pointer p-10 border-2 border-dashed border-slate-600 hover:border-primary rounded-xl transition-colors w-full"
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                    >
                        <UploadCloud className="w-16 h-16 text-slate-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Drag & Drop or Click</h3>
                        <p className="text-slate-400 text-sm">Upload Invoice PDFs (Bulk supported)</p>
                        {files.length > 0 && <p className="mt-4 text-primary font-medium">{files.length} files selected</p>}
                    </motion.div>
                )}

                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".pdf,application/pdf"
                    multiple={true}
                    onChange={handleFileChange}
                />

                {files.length > 0 && status === 'idle' && (
                    <div className="flex flex-col items-center w-full">
                        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mb-6 w-full max-w-lg">
                            <h4 className="text-lg font-medium text-white mb-4 border-b border-slate-700 pb-2">Ready to ingest ({files.length} files)</h4>
                            <div className="max-h-48 overflow-y-auto mb-6 space-y-2 pr-2">
                                {files.map((f, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm p-2 bg-slate-900/50 rounded">
                                        <span className="truncate flex-1 mr-4">{f.name}</span>
                                        <span className="text-slate-400 whitespace-nowrap">{(f.size / 1024).toFixed(0)} KB</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex space-x-4">
                                <button 
                                    onClick={() => setFiles([])}
                                    className="flex-1 py-2 rounded-lg border border-slate-600 hover:bg-slate-700 transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleUpload}
                                    className="flex-1 py-2 rounded-lg bg-primary hover:bg-blue-600 text-white transition font-medium"
                                >
                                    Process {files.length} Invoices
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {status === 'uploading' && (
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                        <p className="text-lg text-slate-300">{statusText}</p>
                    </div>
                )}

                {status === 'success' && (
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center text-green-400">
                        <CheckCircle className="w-16 h-16 mb-4" />
                        <p className="text-lg font-medium">{statusText}</p>
                        <button onClick={() => setStatus('idle')} className="mt-6 px-6 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-white">
                            Upload Another
                        </button>
                    </motion.div>
                )}

                {status === 'error' && (
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center text-red-400">
                        <XCircle className="w-16 h-16 mb-4" />
                        <p className="text-lg font-medium">{statusText}</p>
                        <button onClick={() => setStatus('idle')} className="mt-6 px-6 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-white">
                            Try Again
                        </button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};
export default Upload;
