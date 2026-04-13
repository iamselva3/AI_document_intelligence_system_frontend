import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDocumentDetails, updateInvoiceFields, reprocessDocument } from '../services/endpoints';
import { motion } from 'framer-motion';
import { Save, RefreshCw, ArrowLeft, ExternalLink } from 'lucide-react';

const DocumentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);
    const [formData, setFormData] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const res = await getDocumentDetails(id);
            setDetails(res.data.data);
            if (res.data.data.invoice) {
                setFormData(res.data.data.invoice);
            }
        } catch (e) {
            console.error("Fetch detail failed");
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateInvoiceFields(id, formData);
            alert("Updated manually verified fields successfully!");
        } catch (e) {
            alert("Error updating");
        } finally {
            setSaving(false);
        }
    };

    const handleReprocess = async () => {
        if (!confirm("Are you sure you want to force AI Reprocessing? This overrides manual corrections.")) return;
        try {
            await reprocessDocument(id);
            alert("Document queued for reprocessing");
            navigate('/');
        } catch (e) {
            console.error(e);
        }
    };

    if (!details) return <div className="p-10 text-center">Loading Invoice Data...</div>;

    const { document, displayUrl } = details;

    return (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate(-1)} className="p-2 glass-panel hover:bg-slate-800 transition">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold">{document.originalFileName}</h2>
                        <span className="text-xs text-slate-400">Parsed by {document.extractionMethod || 'AI Engine'}</span>
                    </div>
                </div>
                
                <div className="flex space-x-3">
                    <button onClick={handleReprocess} className="flex px-4 py-2 border border-slate-700 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm items-center transition">
                        <RefreshCw className="w-4 h-4 mr-2 text-yellow-500" /> Reprocess
                    </button>
                    <button onClick={handleSave} disabled={saving} className="flex px-4 py-2 bg-primary hover:bg-blue-600 rounded-lg text-sm font-medium shadow-md items-center transition">
                        <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Overrides'}
                    </button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
                {/* Left Side: Display the authenticated PDF directly from S3 safely */}
                <div className="glass-panel h-[750px] flex flex-col overflow-hidden relative">
                    <div className="absolute top-0 w-full p-2 bg-slate-900/80 backdrop-blur z-10 flex justify-between items-center text-xs text-slate-300">
                        <span>Original Ingested PDF Document</span>
                        <a href={displayUrl} target="_blank" rel="noreferrer" className="flex items-center hover:text-white transition">
                            Open External <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                    </div>
                    <iframe src={displayUrl} className="w-full h-full pt-8 border-none" title="PDF Document" />
                </div>

                {/* Right Side: Override Form */}
                <div className="glass-panel h-[750px] p-6 overflow-y-auto">
                    <h3 className="text-lg font-bold mb-4 border-b border-slate-700 pb-2">Extracted Structured Field Review</h3>
                    
                    {document.validationErrors?.length > 0 && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-lg mb-6 text-sm">
                            <ul className="list-disc pl-4">
                                {document.validationErrors.map((err, i) => <li key={i}>{err}</li>)}
                            </ul>
                        </div>
                    )}

                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Vendor Name</label>
                            <input 
                                className="w-full p-3 glass-input rounded-lg" 
                                value={formData.vendor_name || ''} 
                                onChange={(e) => handleInputChange('vendor_name', e.target.value)} 
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Invoice Number</label>
                                <input 
                                    className="w-full p-3 glass-input rounded-lg" 
                                    value={formData.invoice_number || ''} 
                                    onChange={(e) => handleInputChange('invoice_number', e.target.value)} 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Date</label>
                                <input 
                                    type="date"
                                    className="w-full p-3 glass-input rounded-lg" 
                                    value={formData.invoice_date?.split('T')[0] || ''} 
                                    onChange={(e) => handleInputChange('invoice_date', e.target.value)} 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Currency</label>
                                <input 
                                    className="w-full p-3 glass-input rounded-lg" 
                                    value={formData.currency || ''} 
                                    onChange={(e) => handleInputChange('currency', e.target.value)} 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Tax Amount</label>
                                <input 
                                    type="number"
                                    className="w-full p-3 glass-input rounded-lg" 
                                    value={formData.tax_amount || ''} 
                                    onChange={(e) => handleInputChange('tax_amount', e.target.value)} 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Total Amount</label>
                                <input 
                                    type="number"
                                    className="w-full p-3 glass-input rounded-lg font-bold text-white border-primary/50" 
                                    value={formData.total_amount || ''} 
                                    onChange={(e) => handleInputChange('total_amount', e.target.value)} 
                                />
                            </div>
                        </div>

                        <div className="pt-4 mt-6 border-t border-slate-700">
                            <h4 className="text-sm font-semibold mb-3">Line Items ({formData.line_items?.length || 0})</h4>
                            {formData.line_items?.map((item, idx) => (
                                <div key={idx} className="bg-slate-800/50 p-3 rounded mb-2 border border-slate-700/50 flex space-x-2">
                                    <div className="flex-1 text-sm truncate">{item.description}</div>
                                    <div className="text-sm text-slate-400">{item.quantity} x {item.unit_price}</div>
                                    <div className="text-sm font-semibold w-16 text-right">${item.line_total}</div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default DocumentDetail;
