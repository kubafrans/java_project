import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  Link,
} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ItemsPage from './pages/ItemsPage';
import OrdersPage from './pages/OrdersPage';
import UsersPage from './pages/UsersPage';
import { AuthProvider, useAuth } from './utils/auth';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

function NavigationBar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  if (!token) return null;

  return (
    <AppBar position="static" color="primary" sx={{ mb: 4 }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={Link} to="/items">
            Items
          </Button>
          <Button color="inherit" component={Link} to="/orders">
            Orders
          </Button>
          <Button color="inherit" component={Link} to="/users">
            Users
          </Button>
        </Box>
        <Button
          color="inherit"
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}

function AppRoutes() {
  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/items"
          element={
            <ProtectedRoute>
              <ItemsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/items" />} />
      </Routes>
    </>
  );
}

// Ensure all API requests in your frontend use port 80 (default for http) or relative URLs.
// Example: axios.get('http://localhost/api/items/') or fetch('http://localhost/api/items/')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
