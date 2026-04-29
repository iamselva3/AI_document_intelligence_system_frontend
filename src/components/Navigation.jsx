import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Upload, Activity, FileText, FileSearch, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    
    const links = [
        { name: 'Dashboard', path: '/', icon: Home },
        { name: 'PDF Summarizer', path: '/summarize', icon: FileSearch },
        { name: 'Monitoring Metrics', path: '/metrics', icon: Activity },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="w-64 glass-panel border-r border-slate-800 m-4 p-4 flex flex-col h-[calc(100vh-2rem)]">
            <div className="flex items-center space-x-3 mb-10 px-2 mt-4">
                <FileText className="w-8 h-8 text-primary" />
                <h1 className="text-xl font-bold tracking-wider">AI <span className="text-primary">Docs</span></h1>
            </div>
            
            <div className="flex flex-col space-y-2 flex-1">
                {links.map((link) => {
                    const isActive = location.pathname === link.path;
                    const Icon = link.icon;
                    return (
                        <Link 
                            key={link.path} 
                            to={link.path}
                            className={`relative px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-3 
                                ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            {isActive && (
                                <motion.div 
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-primary/20 rounded-lg border border-primary/50"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <Icon className="w-5 h-5 relative z-10" />
                            <span className="relative z-10 font-medium">{link.name}</span>
                        </Link>
                    )
                })}
            </div>

            <div className="mt-auto border-t border-slate-800 pt-4 space-y-4">
                <div className="px-4 py-2">
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Authenticated as</p>
                    <p className="text-sm font-semibold text-slate-200 truncate">{user?.email}</p>
                </div>
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </nav>
    );
};
export default Navigation;
