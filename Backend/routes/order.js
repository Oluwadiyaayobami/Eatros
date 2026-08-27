const express = require('express');
const router = express.Router();
const { authorization } = require('../middleware/autorization');
const { checkout, acceptOrder, markOrderReady, verifyPickupQr, getOrderById, getUserOrders, getVendorOrders, verifyDelivery } = require('../controller/order');

// Customer routes
router.post('/checkout', authorization, checkout);
router.get('/user', authorization, getUserOrders);

// Vendor routes
router.get('/vendor', authorization, getVendorOrders);
router.patch('/:orderId/vendor-accept', authorization, acceptOrder);
router.patch('/:orderId/ready', authorization, markOrderReady);
router.post('/:orderId/verify-pickup', authorization, verifyPickupQr);

// Keep dynamic routes at the bottom
router.get('/:orderId', authorization, getOrderById);

router.post('/:orderId/verify-delivery', authorization, verifyDelivery);

module.exports = router;
