import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PDFSummarizer from './pages/PDFSummarizer';
import DocumentDetail from './pages/DocumentDetail';
import MetricsDashboard from './pages/MetricsDashboard';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!token) return <Login />;
  return children;
};

function AppContent() {
  const { token } = useAuth();
  
  return (
    <div className="flex h-screen overflow-hidden bg-background text-slate-200">
      {token && <Navigation />}
      <main className={`flex-1 overflow-y-auto w-full ${token ? 'p-8' : ''}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
          <Route path="/summarize" element={<ProtectedRoute><PDFSummarizer /></ProtectedRoute>} />
          <Route path="/document/:id" element={<ProtectedRoute><DocumentDetail /></ProtectedRoute>} />
          <Route path="/metrics" element={<ProtectedRoute><MetricsDashboard /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
