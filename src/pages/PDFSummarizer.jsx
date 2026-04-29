import React, { useState } from 'react';
import { summarizePdf } from '../services/endpoints';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Clock } from 'lucide-react';

const PDFSummarizer = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.size > 50 * 1024 * 1024) {
            setError('File size exceeds 50MB limit.');
            setFile(null);
            return;
        }
        setFile(selectedFile);
        setError('');
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        setError('');
        try {
            const res = await summarizePdf(file);
            setSummary(res.data.summary);
            setFile(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Error summarizing PDF.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-6">
            <div className="text-center space-y-2">
                <h1 className="text-5xl font-extrabold text-white tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                    AI Document Intelligence
                </h1>
                <p className="text-slate-400 text-lg font-medium">Extract insights and summarize any PDF instantly</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Upload Section */}
                <div className="space-y-6">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-500"></div>
                        
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="p-2 bg-primary/20 rounded-lg mr-3">
                                <FileText className="w-5 h-5 text-primary" />
                            </span>
                            Upload PDF Document
                        </h2>

                        <form onSubmit={handleUpload} className="space-y-6">
                            <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center hover:border-primary/50 transition-all duration-300 cursor-pointer relative bg-white/2 hover:bg-white/5">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="space-y-4">
                                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-slate-200 font-bold text-lg">{file ? file.name : 'Click to upload or drag & drop'}</p>
                                        <p className="text-slate-500 text-sm mt-1">PDF documents only (Max 50MB)</p>
                                    </div>
                                </div>
                            </div>
                            {error && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                                    {error}
                                </motion.div>
                            )}
                            <button
                                type="submit"
                                disabled={!file || loading}
                                className={`w-full py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 transform active:scale-[0.98] ${
                                    !file || loading 
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50' 
                                    : 'bg-primary hover:bg-blue-600 text-white shadow-primary/20'
                                }`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing Document...
                                    </span>
                                ) : 'Generate Summary'}
                            </button>
                        </form>
                    </div>

                    {summary && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-primary/10 border border-primary/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-primary flex items-center">
                                    <Clock className="w-5 h-5 mr-2" />
                                    Latest Summary
                                </h3>
                                <button 
                                    onClick={() => setSummary('')}
                                    className="text-slate-500 hover:text-white transition-colors"
                                >
                                    Dismiss
                                </button>
                            </div>
                            <div className="text-slate-200 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                                {summary}
                            </div>
                            <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                                <p className="text-slate-500 text-sm italic">Summary generated successfully and saved to your dashboard.</p>
                                <Link to="/" className="text-primary hover:underline font-semibold text-sm">
                                    Go to Dashboard →
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PDFSummarizer;
