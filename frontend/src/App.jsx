import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AccessPortal from './pages/AccessPortal';
import LandingPage from './components/LandingPage';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/auth/portal" element={<AccessPortal />} />
                    <Route path="/auth/login" element={<AccessPortal />} /> {/* Redirect mock */}
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
