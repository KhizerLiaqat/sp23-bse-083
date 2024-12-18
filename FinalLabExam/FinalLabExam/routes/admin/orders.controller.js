const express = require('express');
const Order = require('../../models/order.model');
const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ orderDate: -1 });
        res.render('admin/orders', { orders });
    } catch (err) {
        res.status(500).send('Error retrieving orders');
    }
});

module.exports = router;


// Handle checkout form submission
router.post('/checkout', async (req, res) => {
    const { name, street, city, postalCode, items } = req.body;

    if (!name || !street || !city || !postalCode || !items || items.length === 0) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Calculate total amount
    let totalAmount = 0;
    items.forEach(item => {
        totalAmount += item.price * item.quantity;
    });

    // Create order
    const orderId = `ORD-${Date.now()}`; // Unique order ID based on timestamp
    const order = new Order({
        orderId,
        customerInfo: { name, street, city, postalCode },
        items,
        totalAmount
    });

    await order.save();
    res.status(201).json({ message: 'Order placed successfully', orderId });
});

// Retrieve all orders for the admin panel
router.get('/admin/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ orderDate: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving orders' });
    }
});

module.exports = router;
