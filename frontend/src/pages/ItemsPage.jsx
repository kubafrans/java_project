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

export default function ItemsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    quantity: '',
    price: '',
  });
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    quantity: '',
    price: '',
  });

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost/api/items', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
    } catch {
      setError('Failed to fetch items');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.quantity || !form.price) {
      setError('Name, quantity, and price are required');
      return;
    }
    try {
      await axios.post(
        'http://localhost/api/items',
        {
          ...form,
          quantity: Number(form.quantity),
          price: Number(form.price),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setForm({ name: '', description: '', quantity: '', price: '' });
      fetchItems();
    } catch {
      setError('Failed to add item');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await axios.delete(`http://localhost/api/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchItems();
    } catch {
      setError(`Failed to delete item with id ${id}`);
    }
  };

  const handleEditClick = (item) => {
    setEditId(item.id);
    setEditForm({
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      price: item.price,
    });
    setError('');
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id) => {
    setError('');
    try {
      await axios.put(
        `http://localhost/api/items/${id}`,
        {
          ...editForm,
          quantity: Number(editForm.quantity),
          price: Number(editForm.price),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditId(null);
      fetchItems();
    } catch {
      setError(`Failed to update item with id ${id}`);
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditForm({
      name: '',
      description: '',
      quantity: '',
      price: '',
    });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Items
      </Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box
          component="form"
          onSubmit={handleAdd}
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            mb: 2,
          }}
        >
          <TextField
            name="name"
            label="Name"
            value={form.name}
            onChange={handleChange}
            required
            size="small"
          />
          <TextField
            name="description"
            label="Description"
            value={form.description}
            onChange={handleChange}
            size="small"
          />
          <TextField
            name="quantity"
            label="Quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            required
            size="small"
          />
          <TextField
            name="price"
            label="Price"
            type="number"
            value={form.price}
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
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                {editId === item.id ? (
                  <>
                    <TableCell>
                      <TextField
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="quantity"
                        type="number"
                        value={editForm.quantity}
                        onChange={handleEditChange}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name="price"
                        type="number"
                        value={editForm.price}
                        onChange={handleEditChange}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleEditSave(item.id)}
                        sx={{ mr: 1 }}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        color="inherit"
                        size="small"
                        onClick={handleEditCancel}
                      >
                        Cancel
                      </Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={{ ml: 1 }}
                        onClick={() => handleEditClick(item)}
                      >
                        Edit
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
