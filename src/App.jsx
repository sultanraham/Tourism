import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// Layout
import PageLayout from './components/layout/PageLayout';

// Pages
import HomePage from './pages/Home/HomePage';
import DestinationsPage from './pages/Destinations/DestinationsPage';
import DestinationDetail from './pages/Destinations/DestinationDetail';
import HotelsPage from './pages/Hotels/HotelsPage';
import HotelDetail from './pages/Hotels/HotelDetail';
import RestaurantsPage from './pages/Restaurants/RestaurantsPage';
import RestaurantDetail from './pages/Restaurants/RestaurantDetail';
import ItineraryPlannerPage from './pages/Planner/ItineraryPlannerPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import SettingsPage from './pages/Settings/SettingsPage';
import AdminPortal from './pages/Admin/AdminPortal';

// Store
import { useAuthStore } from './stores/auth.store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, profile } = useAuthStore();
  const isAdmin = isAuthenticated && (profile?.role === 'admin' || user?.email?.toLowerCase() === 'admin@devnexes.com');
  return isAdmin ? children : <Navigate to="/" replace />;
};

function App() {
  useEffect(() => {
    useAuthStore.getState().initSession();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AnimatePresence mode="wait">
          <PageLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              {/* Private Routes */}
              <Route path="/destinations" element={<PrivateRoute><DestinationsPage /></PrivateRoute>} />
              <Route path="/destinations/:slug" element={<PrivateRoute><DestinationDetail /></PrivateRoute>} />
              <Route path="/hotels" element={<PrivateRoute><HotelsPage /></PrivateRoute>} />
              <Route path="/hotels/:slug" element={<PrivateRoute><HotelDetail /></PrivateRoute>} />
              <Route path="/restaurants" element={<PrivateRoute><RestaurantsPage /></PrivateRoute>} />
              <Route path="/restaurants/:slug" element={<PrivateRoute><RestaurantDetail /></PrivateRoute>} />
              <Route path="/planner" element={<PrivateRoute><ItineraryPlannerPage /></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminPortal /></AdminRoute>} />

              {/* Catch All */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </PageLayout>
        </AnimatePresence>
      </Router>
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  );
}

export default App;
