import { useEffect, useState } from 'react';
import { getDocuments } from '../services/endpoints';
import { motion } from 'framer-motion';
import { Activity, Clock, CheckCircle2, XOctagon } from 'lucide-react';

const MetricsDashboard = () => {
    const [docs, setDocs] = useState([]);

    useEffect(() => {
        getDocuments().then(res => setDocs(res.data.data)).catch(console.error);
    }, []);

    const total = docs.length;
    const completed = docs.filter(d => d.status === 'COMPLETED').length;
    const failed = docs.filter(d => d.status === 'FAILED').length;
    const processingTimes = docs.filter(d => d.processingTimeMs).map(d => d.processingTimeMs);
    const avgTime = processingTimes.length 
        ? (processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length / 1000).toFixed(2) 
        : 0;
    const successRate = total ? ((completed / total) * 100).toFixed(1) : 0;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
            <h2 className="text-3xl font-bold mb-8">Monitoring Metrics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="glass-panel p-6 flex flex-col items-center text-center">
                    <Activity className="w-10 h-10 text-primary mb-3" />
                    <h4 className="text-slate-400 text-sm font-medium mb-1">Total Ingested</h4>
                    <span className="text-3xl font-bold">{total}</span>
                </div>
                
                <div className="glass-panel p-6 flex flex-col items-center text-center border-t-4 border-t-green-500">
                    <CheckCircle2 className="w-10 h-10 text-green-500 mb-3" />
                    <h4 className="text-slate-400 text-sm font-medium mb-1">Extraction Success</h4>
                    <span className="text-3xl font-bold">{successRate}%</span>
                </div>

                <div className="glass-panel p-6 flex flex-col items-center text-center">
                    <Clock className="w-10 h-10 text-yellow-400 mb-3" />
                    <h4 className="text-slate-400 text-sm font-medium mb-1">Average Proc Time</h4>
                    <span className="text-3xl font-bold">{avgTime}s</span>
                </div>

                <div className="glass-panel p-6 flex flex-col items-center text-center border-t-4 border-t-red-500">
                    <XOctagon className="w-10 h-10 text-red-500 mb-3" />
                    <h4 className="text-slate-400 text-sm font-medium mb-1">Failed Jobs</h4>
                    <span className="text-3xl font-bold">{failed}</span>
                </div>
            </div>

            <div className="glass-panel p-6">
                <h3 className="text-xl font-bold mb-4">Error Reports & Logs</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-700 bg-slate-800/50">
                                <th className="p-3 text-sm font-medium text-slate-300">File Name</th>
                                <th className="p-3 text-sm font-medium text-slate-300">Status</th>
                                <th className="p-3 text-sm font-medium text-slate-300">Validation Errors</th>
                                <th className="p-3 text-sm font-medium text-slate-300">Error Msg</th>
                            </tr>
                        </thead>
                        <tbody>
                            {docs.filter(d => (d.validationErrors && d.validationErrors.length > 0) || d.errorMessage).map(doc => (
                                <tr key={doc._id} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                                    <td className="p-3 text-sm text-slate-300 truncate max-w-[200px]" title={doc.originalFileName}>{doc.originalFileName}</td>
                                    <td className="p-3 text-xs">
                                        <span className={`px-2 py-1 rounded bg-slate-800 ${doc.status==='FAILED'?'text-red-400':'text-yellow-400'}`}>
                                            {doc.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-sm text-yellow-500">
                                        {doc.validationErrors?.map((err, i) => <div key={i}>• {err}</div>)}
                                    </td>
                                    <td className="p-3 text-sm text-red-400">{doc.errorMessage || '-'}</td>
                                </tr>
                            ))}
                            {docs.filter(d => (d.validationErrors && d.validationErrors.length > 0) || d.errorMessage).length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-6 text-center text-slate-500">No error reports found. System is healthy.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};
export default MetricsDashboard;
