import { useEffect, useState } from 'react';
import { getSummaries } from '../services/endpoints';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Clock, ChevronRight } from 'lucide-react';

const Dashboard = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDocs();
    }, []);

    const fetchDocs = async () => {
        try {
            const res = await getSummaries();
            // Assuming getSummaries returns an array of summaries
            setDocuments(res.data);
        } catch (e) {
            console.error("Failed fetching", e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-4xl font-extrabold text-white tracking-tight">Processed Documents</h2>
                    <p className="text-slate-400 mt-2">View and manage your AI-summarized PDF files</p>
                </div>
            </div>
            
            {documents.length === 0 ? (
                <div className="text-center py-20 glass-panel">
                    <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg italic">No documents processed yet.</p>
                    <Link to="/summarize" className="inline-block mt-4 text-primary hover:underline">
                        Start by summarizing a PDF →
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {documents.map((doc, idx) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                            key={doc._id} 
                            className="glass-panel p-6 group hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 flex flex-col h-full"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold bg-slate-800/50 px-2 py-1 rounded">
                                    {new Date(doc.uploadedAt).toLocaleDateString()}
                                </span>
                            </div>
                            
                            <h3 className="font-bold text-xl mb-2 text-slate-100 line-clamp-1 group-hover:text-primary transition-colors" title={doc.originalFileName}>
                                {doc.originalFileName}
                            </h3>
                            
                            <div className="flex items-center text-xs text-slate-500 mb-4 space-x-3">
                                <span className="flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {(doc.fileSize / (1024 * 1024)).toFixed(2)} MB
                                </span>
                            </div>

                            <p className="text-sm text-slate-400 mb-6 line-clamp-3 italic leading-relaxed flex-grow">
                                "{doc.summary}"
                            </p>
                            
                            <Link 
                                to={`/document/${doc._id}`} 
                                className="mt-auto flex items-center justify-between w-full p-3 bg-white/5 hover:bg-primary text-white rounded-xl transition-all duration-300 group/btn"
                            >
                                <span className="text-sm font-semibold">View Full Details</span>
                                <ChevronRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default Dashboard;
