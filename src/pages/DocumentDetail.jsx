import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSummaryDetails } from '../services/endpoints';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, FileText, Download, Calendar } from 'lucide-react';

const DocumentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const res = await getSummaryDetails(id);
            setDetails(res.data);
        } catch (e) {
            console.error("Fetch detail failed", e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    if (!details) return (
        <div className="p-10 text-center">
            <p className="text-slate-400">Document not found.</p>
            <button onClick={() => navigate('/')} className="mt-4 text-primary hover:underline">Return to Dashboard</button>
        </div>
    );

    const { summary, displayUrl } = details;

    return (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-6 h-full flex flex-col max-w-[1600px] mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-6">
                    <button onClick={() => navigate(-1)} className="p-3 glass-panel hover:bg-slate-800 transition-all duration-300 group">
                        <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">{summary.originalFileName}</h2>
                        <div className="flex items-center space-x-4 mt-1">
                            <span className="flex items-center text-xs text-slate-400">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(summary.uploadedAt).toLocaleString()}
                            </span>
                            <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                AI Processed
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="flex space-x-4">
                    {displayUrl && (
                        <a 
                            href={displayUrl} 
                            download 
                            className="flex px-6 py-3 border border-slate-700 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-bold items-center transition-all duration-300 shadow-lg"
                        >
                            <Download className="w-4 h-4 mr-2" /> Download Original
                        </a>
                    )}
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
                {/* Left Side: PDF Preview */}
                <div className="glass-panel flex flex-col overflow-hidden relative shadow-2xl">
                    <div className="absolute top-0 w-full p-3 bg-slate-900/90 backdrop-blur-md z-10 flex justify-between items-center text-xs text-slate-300 border-b border-white/5">
                        <span className="flex items-center font-medium">
                            <FileText className="w-4 h-4 mr-2 text-primary" />
                            Original Document Preview
                        </span>
                        {displayUrl && (
                            <a href={displayUrl} target="_blank" rel="noreferrer" className="flex items-center hover:text-primary transition-colors font-bold">
                                Full Screen <ExternalLink className="w-3 h-3 ml-1.5" />
                            </a>
                        )}
                    </div>
                    {displayUrl ? (
                        <iframe src={displayUrl} className="w-full h-full pt-10 border-none" title="PDF Document" />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full bg-slate-900/50 text-slate-500 space-y-4">
                            <FileText className="w-16 h-16 opacity-20" />
                            <p className="italic">PDF preview not available for this legacy document.</p>
                        </div>
                    )}
                </div>

                {/* Right Side: Summary View */}
                <div className="glass-panel p-8 overflow-y-auto shadow-2xl relative">
                    <div className="absolute top-0 right-0 p-4">
                        <div className="w-24 h-24 bg-primary/5 rounded-full blur-3xl"></div>
                    </div>
                    
                    <h3 className="text-2xl font-extrabold text-white mb-8 flex items-center">
                        <span className="w-1.5 h-8 bg-primary rounded-full mr-4"></span>
                        AI Summary & Insights
                    </h3>
                    
                    <div className="space-y-8 relative z-10">
                        <div className="prose prose-invert max-w-none">
                            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl text-slate-200 text-lg leading-relaxed whitespace-pre-wrap shadow-inner font-medium">
                                {summary.summary}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mt-10">
                            <div className="bg-slate-800/40 p-5 rounded-2xl border border-white/5">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">File Size</p>
                                <p className="text-xl font-bold text-slate-200">
                                    {(summary.fileSize / (1024 * 1024)).toFixed(2)} MB
                                </p>
                            </div>
                            <div className="bg-slate-800/40 p-5 rounded-2xl border border-white/5">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Processing Time</p>
                                <p className="text-xl font-bold text-slate-200 text-green-400">
                                    ~2.4 Seconds
                                </p>
                            </div>
                        </div>

                        <div className="pt-8 mt-8 border-t border-white/5">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Key Information Extraction</h4>
                            <div className="flex flex-wrap gap-3">
                                <span className="px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-xl text-sm font-bold">Automatic Summarization</span>
                                <span className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl text-sm font-bold">PDF Parsing</span>
                                <span className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl text-sm font-bold">LLM Intelligence</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default DocumentDetail;
