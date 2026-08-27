const asyncHandler = require("../utils/errorHandler");
const Order = require("../models/order");
const crypto = require("crypto");
const Transaction = require("../models/transaction");

// Customer: Place an order
const checkout = asyncHandler(async (req, res) => {
    const customerId = req.acessToken.userID;
    const { vendorId, items, totalAmount, deliveryFee, deliveryAddress, deliveryMethod, coordinates, customerInfo } = req.body;

    if (!vendorId || !items || items.length === 0) {
        return res.status(400).json({ message: "Vendor ID and items are required." });
    }

    // Generate secure 6-character codes for pickup and dropoff verification
    const pickupQrCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    const dropoffQrCode = crypto.randomBytes(3).toString('hex').toUpperCase();

    const newOrder = await Order.create({
        customerId,
        vendorId,
        items,
        totalAmount,
        deliveryFee,
        deliveryAddress,
        deliveryMethod: deliveryMethod || "self",
        customerInfo,
        coordinates,
        pickupQrCode,
        dropoffQrCode,
        status: "PENDING"
    });

    if (newOrder.deliveryMethod === "agent" && req.io) {
        // Populate vendor and customer details before emitting so the frontend gets complete info
        const populatedOrder = await Order.findById(newOrder._id)
            .populate('vendorId', 'vendorDetails.restaurantName vendorDetails.storeAddress')
            .populate('customerId', 'name phoneNumber');
            
        req.io.emit('newAvailableOrder', populatedOrder);
    }

    res.status(201).json({
        message: "Order placed successfully",
        order: newOrder
    });
});

// Vendor: Accept Order
const acceptOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const vendorId = req.acessToken.userID;

    const order = await Order.findOneAndUpdate(
        { _id: orderId, vendorId, status: "PENDING" },
        { status: "ACCEPTED_BY_VENDOR" },
        { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found or already accepted." });

    res.status(200).json({ message: "Order accepted.", order });
});

// Vendor: Mark Order Ready (Triggers Dispatch)
const markOrderReady = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const vendorId = req.acessToken.userID;

    const order = await Order.findOneAndUpdate(
        { _id: orderId, vendorId, status: "ACCEPTED_BY_VENDOR" },
        { status: "READY_FOR_PICKUP" },
        { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found or not in accepted state." });

    if (order.deliveryMethod === "agent" && req.io) {
        // We ping the specific agent if they are assigned, or broadcast if not yet assigned
        req.io.emit('orderReadyForPickup', { 
            orderId: order._id, 
            agentId: order.agentId,
            message: "Order is ready for pickup!" 
        });
    }

    res.status(200).json({ message: "Order ready for pickup.", order });
});

// Vendor/Agent: Verify Pickup QR Code
const verifyPickupQr = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { qrCode } = req.body;
    const userId = req.acessToken.userID;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found." });

    if (order.status !== "READY_FOR_PICKUP") {
        return res.status(400).json({ message: "Order is not ready for pickup." });
    }

    // For Self Pickup, the Vendor scans the code.
    if (order.deliveryMethod === "self") {
        if (order.vendorId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Unauthorized. Only the assigned vendor can scan this code." });
        }
    } else {
        // For Agent Delivery, the Agent scans the code.
        // Assume agentId is set when agent accepts the request (not fully implemented yet, but keeping structure)
        if (order.agentId && order.agentId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Unauthorized. Only the assigned agent can scan this code." });
        }
    }

    const dbCode = (order.pickupQrCode || '').toUpperCase();
    const inputCode = (qrCode || '').trim().toUpperCase();

    // Support exact match (new 6-char codes) or prefix match for older 16-char codes that were truncated to 8 chars in UI
    const isMatch = dbCode === inputCode || (dbCode.length > 8 && dbCode.startsWith(inputCode) && inputCode.length === 8);

    if (!isMatch) {
        return res.status(400).json({ message: "Invalid Code." });
    }

    // Update status based on delivery method
    const newStatus = order.deliveryMethod === "self" ? "COMPLETED" : "IN_TRANSIT";
    order.status = newStatus;
    await order.save();

    res.status(200).json({ message: `Order ${newStatus === 'COMPLETED' ? 'completed successfully' : 'in transit'}.`, order });
});

// Customer: Get specific order by ID
const getOrderById = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const customerId = req.acessToken.userID;

    const order = await Order.findById(orderId)
        .populate('vendorId', 'vendorDetails.restaurantName vendorDetails.restaurantImage')
        .populate('items.productId', 'name imageUrl');

    if (!order) {
        return res.status(404).json({ message: "Order not found." });
    }

    if (order.customerId.toString() !== customerId.toString()) {
        return res.status(403).json({ message: "Unauthorized." });
    }

    res.status(200).json({ order });
});

// Customer: Get order history
const getUserOrders = asyncHandler(async (req, res) => {
    const customerId = req.acessToken.userID;
    
    // Populate vendor info so frontend can display restaurant name
    const orders = await Order.find({ customerId })
        .populate('vendorId', 'vendorDetails.restaurantName')
        .sort({ createdAt: -1 });

    res.status(200).json({ orders });
});

// Vendor: Get all orders for this vendor
const getVendorOrders = asyncHandler(async (req, res) => {
    const vendorId = req.acessToken.userID;
    
    const orders = await Order.find({ vendorId })
        .populate('customerId', 'name phoneNumber')
        .populate('items.productId', 'name imageUrl')
        .sort({ createdAt: -1 });

    res.status(200).json({ orders });
});

// Customer: Verify Delivery (Dropoff)
const verifyDelivery = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { dropoffQrCode } = req.body;
    const customerId = req.acessToken.userID;

    const order = await Order.findOne({ _id: orderId, customerId, status: "IN_TRANSIT" });
    if (!order) return res.status(404).json({ message: "Order not found or not in transit." });

    if (order.dropoffQrCode !== dropoffQrCode) {
        return res.status(400).json({ message: "Invalid Dropoff QR Code." });
    }

    order.status = "COMPLETED";
    await order.save();

    // Create Transactions for wallet payout
    // Payout Vendor (Total amount - commission)
    await Transaction.create({
        userId: order.vendorId,
        amount: order.totalAmount * 0.9, // 90% goes to vendor
        type: "EARNING",
        reference: `VEND-PAY-${order._id}`,
        orderId: order._id
    });

    // Payout Agent (Delivery fee)
    if (order.deliveryMethod === 'agent' && order.agentId) {
        await Transaction.create({
            userId: order.agentId,
            amount: order.deliveryFee,
            type: "EARNING",
            reference: `AGT-PAY-${order._id}`,
            orderId: order._id
        });
    }

    if (req.io) {
        req.io.emit('orderCompleted', { orderId: order._id, agentId: order.agentId });
    }

    res.status(200).json({ message: "Delivery verified. Order completed.", order });
});

module.exports = {
    checkout,
    acceptOrder,
    markOrderReady,
    verifyPickupQr,
    getUserOrders,
    getOrderById,
    getVendorOrders,
    verifyDelivery
};
