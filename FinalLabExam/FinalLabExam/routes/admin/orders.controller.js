const express = require('express');
const Order = require('../../models/order.model');
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ orderDate: -1 });
        res.render('admin/orders', { orders });
    } catch (err) {
        res.status(500).send('Error retrieving orders');
    }
});

module.exports = router;


router.post('/checkout', async (req, res) => {
    const { name, street, city, postalCode, items } = req.body;

    if (!name || !street || !city || !postalCode || !items || items.length === 0) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    let totalAmount = 0;
    items.forEach(item => {
        totalAmount += item.price * item.quantity;
    });


    const orderId = `ORD-${Date.now()}`;
    const order = new Order({
        orderId,
        customerInfo: { name, street, city, postalCode },
        items,
        totalAmount
    });

    await order.save();
    res.status(201).json({ message: 'Order placed successfully', orderId });
});


router.get('/admin/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ orderDate: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving orders' });
    }
});

module.exports = router;
