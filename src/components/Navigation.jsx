import { Link, useLocation } from 'react-router-dom';
import { Home, Upload, Activity, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const Navigation = () => {
    const location = useLocation();
    
    const links = [
        { name: 'Dashboard', path: '/', icon: Home },
        { name: 'Upload Invoice', path: '/upload', icon: Upload },
        { name: 'Monitoring Metrics', path: '/metrics', icon: Activity },
    ];

    return (
        <nav className="w-64 glass-panel border-r border-slate-800 m-4 p-4 flex flex-col h-[calc(100vh-2rem)]">
            <div className="flex items-center space-x-3 mb-10 px-2 mt-4">
                <FileText className="w-8 h-8 text-primary" />
                <h1 className="text-xl font-bold tracking-wider">AI <span className="text-primary">Docs</span></h1>
            </div>
            
            <div className="flex flex-col space-y-2">
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
        </nav>
    );
};
export default Navigation;
