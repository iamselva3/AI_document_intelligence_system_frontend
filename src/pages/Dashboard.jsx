import { useEffect, useState } from 'react';
import { getDocuments } from '../services/endpoints';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileSearch, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

const Dashboard = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDocs();
    }, []);

    const fetchDocs = async () => {
        try {
            const res = await getDocuments();
            setDocuments(res.data.data);
        } catch (e) {
            console.error("Failed fetching", e);
        } finally {
            setLoading(false);
        }
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            UPLOADED: "bg-slate-500/20 text-slate-300 border-slate-500/50",
            QUEUED: "bg-blue-500/20 text-blue-300 border-blue-500/50",
            PROCESSING: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
            COMPLETED: "bg-green-500/20 text-green-300 border-green-500/50",
            FAILED: "bg-red-500/20 text-red-300 border-red-500/50"
        };
        return (
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${styles[status]}`}>
                {status}
            </span>
        );
    };

    if (loading) return <div className="text-center mt-20">Loading...</div>;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Processed Invoices</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {documents.map((doc, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                        key={doc._id} 
                        className="glass-panel p-5 group hover:border-primary/50 transition-colors"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <FileSearch className="w-8 h-8 text-primary opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                            <StatusBadge status={doc.status} />
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-1 truncate" title={doc.originalFileName}>
                            {doc.originalFileName}
                        </h3>
                        <p className="text-xs text-slate-400 mb-4">
                            Uploaded: {new Date(doc.uploadedAt).toLocaleString()}
                        </p>
                        
                        {doc.confidenceScore !== undefined && (
                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Confidence Score</span>
                                    <span className={doc.confidenceScore >= 80 ? 'text-green-400' : 'text-yellow-400'}>
                                        {doc.confidenceScore}%
                                    </span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                    <div 
                                        className={`h-1.5 rounded-full ${doc.confidenceScore >= 80 ? 'bg-green-500' : 'bg-yellow-500'}`} 
                                        style={{ width: `${doc.confidenceScore}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        <Link to={`/document/${doc._id}`} className="block w-full text-center py-2 mt-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors font-medium text-sm border border-primary/20">
                            Review & Inspect Fields
                        </Link>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};
export default Dashboard;
