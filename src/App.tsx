import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './components/ui/Toast';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { FAQ } from './pages/FAQ';
import { Discover } from './pages/Discover';
import { ListingDetail } from './pages/ListingDetail';
import { CreateListing } from './pages/CreateListing';
import { MyListings } from './pages/MyListings';
import { Requests } from './pages/Requests';
import { CreateRequest } from './pages/CreateRequest';
import { Sessions } from './pages/Sessions';
import { SessionDetail } from './pages/SessionDetail';
import { Wallet } from './pages/Wallet';
import { Badges } from './pages/Badges';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return !user ? <>{children}</> : <Navigate to="/" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <Layout>
              <Home />
            </Layout>
          </PublicRoute>
        }
      />
      <Route
        path="/about"
        element={
          <PublicRoute>
            <Layout>
              <About />
            </Layout>
          </PublicRoute>
        }
      />
      <Route
        path="/faq"
        element={
          <PublicRoute>
            <Layout>
              <FAQ />
            </Layout>
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Layout>
              <Login />
            </Layout>
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Layout>
              <Signup />
            </Layout>
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/discover"
        element={
          <PrivateRoute>
            <Layout>
              <Discover />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/listings"
        element={
          <PrivateRoute>
            <Layout>
              <MyListings />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/listings/create"
        element={
          <PrivateRoute>
            <Layout>
              <CreateListing />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/listings/:id"
        element={
          <PrivateRoute>
            <Layout>
              <ListingDetail />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/requests"
        element={
          <PrivateRoute>
            <Layout>
              <Requests />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/requests/create"
        element={
          <PrivateRoute>
            <Layout>
              <CreateRequest />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/sessions"
        element={
          <PrivateRoute>
            <Layout>
              <Sessions />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/sessions/:id"
        element={
          <PrivateRoute>
            <Layout>
              <SessionDetail />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/wallet"
        element={
          <PrivateRoute>
            <Layout>
              <Wallet />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/badges"
        element={
          <PrivateRoute>
            <Layout>
              <Badges />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Layout>
              <Profile />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile/:id"
        element={
          <PrivateRoute>
            <Layout>
              <Profile />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Layout>
              <Settings />
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
