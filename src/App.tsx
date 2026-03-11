import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TouristDashboard from './pages/TouristDashboard';
import ListingDetail from './pages/ListingDetail';
import BusinessOnboarding from './pages/BusinessOnboarding';
import PackageSelection from './pages/PackageSelection';
import BusinessDashboard from './pages/BusinessDashboard';
import AdminDashboard from './pages/AdminDashboard';

function DashboardRouter() {
  const { profile, loading } = useAuth();

  if (loading) return null;

  if (profile?.role === 'admin') {
    return <Navigate to="/admin" />;
  }

  if (profile?.role === 'business') {
    if (profile.status === 'draft') return <Navigate to="/onboarding" />;
    return <BusinessDashboard />;
  }

  return <TouristDashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Unified Dashboard Route */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              } 
            />

            {/* Tourist Specific */}
            <Route 
              path="/explore" 
              element={
                <ProtectedRoute role="tourist">
                  <TouristDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/listing/:id" 
              element={
                <ProtectedRoute>
                  <ListingDetail />
                </ProtectedRoute>
              } 
            />

            {/* Business Specific */}
            <Route 
              path="/onboarding" 
              element={
                <ProtectedRoute role="business">
                  <BusinessOnboarding />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/packages" 
              element={
                <ProtectedRoute role="business">
                  <PackageSelection />
                </ProtectedRoute>
              } 
            />

            {/* Admin Specific */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
