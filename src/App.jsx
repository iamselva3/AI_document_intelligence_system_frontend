import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import DocumentDetail from './pages/DocumentDetail';
import MetricsDashboard from './pages/MetricsDashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-background text-slate-200">
        <Navigation />
        <main className="flex-1 overflow-y-auto w-full p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/document/:id" element={<DocumentDetail />} />
            <Route path="/metrics" element={<MetricsDashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
