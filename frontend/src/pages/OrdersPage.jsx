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

export default function OrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    itemId: '',
    quantity: '',
    userId: '',
  });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    itemId: '',
    quantity: '',
    userId: '',
    status: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch {
      setError('Failed to fetch orders');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.itemId || !form.quantity || !form.userId) {
      setError('Item ID, quantity, and user ID are required');
      return;
    }
    try {
      await axios.post(
        'http://localhost/api/orders',
        {
          id: 0,
          itemId: Number(form.itemId),
          quantity: Number(form.quantity),
          status: 'NEW',
          orderDate: new Date().toISOString(),
          userId: Number(form.userId),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setForm({ itemId: '', quantity: '', userId: '' });
      fetchOrders();
    } catch {
      setError('Failed to add order');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders();
    } catch {
      setError('Failed to delete order');
    }
  };

  const handleEdit = (order) => {
    setEditId(order.id);
    setEditForm({
      itemId: order.itemId,
      quantity: order.quantity,
      userId: order.userId,
      status: order.status,
    });
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditForm({ itemId: '', quantity: '', userId: '', status: '' });
  };

  const handleEditSave = async (id) => {
    setError('');
    if (
      !editForm.itemId ||
      !editForm.quantity ||
      !editForm.userId ||
      !editForm.status
    ) {
      setError('All fields are required');
      return;
    }
    try {
      await axios.put(
        `http://localhost/api/orders/${id}`,
        {
          id,
          itemId: Number(editForm.itemId),
          quantity: Number(editForm.quantity),
          status: editForm.status,
          orderDate: new Date().toISOString(),
          userId: Number(editForm.userId),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditId(null);
      setEditForm({
        itemId: '',
        quantity: '',
        userId: '',
        status: '',
      });
      fetchOrders();
    } catch {
      setError('Failed to update order');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Orders
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
            name="itemId"
            label="Item ID"
            value={form.itemId}
            onChange={handleChange}
            required
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
            name="userId"
            label="User ID"
            value={form.userId}
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
              <TableCell>Order ID</TableCell>
              <TableCell>Item ID</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>
                  {editId === order.id ? (
                    <TextField
                      name="itemId"
                      value={editForm.itemId}
                      onChange={handleEditChange}
                      size="small"
                    />
                  ) : (
                    order.itemId
                  )}
                </TableCell>
                <TableCell>
                  {editId === order.id ? (
                    <TextField
                      name="userId"
                      value={editForm.userId}
                      onChange={handleEditChange}
                      size="small"
                    />
                  ) : (
                    order.userId
                  )}
                </TableCell>
                <TableCell>
                  {editId === order.id ? (
                    <TextField
                      name="quantity"
                      type="number"
                      value={editForm.quantity}
                      onChange={handleEditChange}
                      size="small"
                    />
                  ) : (
                    order.quantity
                  )}
                </TableCell>
                <TableCell>
                  {editId === order.id ? (
                    <TextField
                      name="status"
                      value={editForm.status}
                      onChange={handleEditChange}
                      size="small"
                    />
                  ) : (
                    order.status
                  )}
                </TableCell>
                <TableCell>
                  {editId === order.id ? (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => handleEditSave(order.id)}
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
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => handleEdit(order)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(order.id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
