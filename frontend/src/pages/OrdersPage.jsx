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
          ...form,
          quantity: Number(form.quantity),
          itemId: Number(form.itemId),
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
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.itemId}</TableCell>
                <TableCell>{order.userId}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(order.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
