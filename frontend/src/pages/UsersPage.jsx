import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../utils/auth';
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Box,
  Alert,
} from '@mui/material';

export default function UsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
  });
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
  });

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch {
      setError('Failed to fetch users');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    if (
      !form.username ||
      !form.email ||
      !form.password ||
      !form.role
    ) {
      setError('All fields are required');
      return;
    }
    try {
      await axios.post('http://localhost/api/users/', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ username: '', email: '', password: '', role: '' });
      fetchUsers();
    } catch {
      setError('Failed to add user');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch {
      setError('Failed to delete user');
    }
  };

  const handleEditClick = (user) => {
    setEditId(user.id);
    setEditForm({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
    });
    setError('');
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id) => {
    setError('');
    if (!editForm.username || !editForm.email || !editForm.role) {
      setError('Username, email, and role are required');
      return;
    }
    try {
      await axios.put(
        `http://localhost/api/users/${id}`,
        {
          username: editForm.username,
          email: editForm.email,
          password: editForm.password, // send empty string if not changed
          role: editForm.role,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditId(null);
      setEditForm({
        username: '',
        email: '',
        password: '',
        role: '',
      });
      fetchUsers();
    } catch {
      setError('Failed to update user');
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditForm({
      username: '',
      email: '',
      password: '',
      role: '',
    });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box
          component="form"
          onSubmit={handleAdd}
          sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}
        >
          <TextField
            name="username"
            label="Username"
            value={form.username}
            onChange={handleChange}
            required
            size="small"
          />
          <TextField
            name="email"
            label="Email"
            value={form.email}
            onChange={handleChange}
            required
            size="small"
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            size="small"
          />
          <TextField
            name="role"
            label="Role"
            value={form.role}
            onChange={handleChange}
            required
            size="small"
          />
          <Button type="submit" variant="contained" color="primary">
            Add
          </Button>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Table component={Paper}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                {editId === user.id ? (
                  <>
                    <TableCell>
                      <TextField
                        name="username"
                        value={editForm.username}
                        onChange={handleEditChange}
                        size="small"
                        required
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        size="small"
                        required
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="role"
                        value={editForm.role}
                        onChange={handleEditChange}
                        size="small"
                        required
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => handleEditSave(user.id)}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={handleEditCancel}
                      >
                        Cancel
                      </Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => handleEditClick(user)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
