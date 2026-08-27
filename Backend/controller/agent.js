const asyncHandler = require("../utils/errorHandler");
const Order = require("../models/order");
const Transaction = require("../models/transaction");
const User = require("../models/user");
const cloudinary = require("cloudinary").v2;

// Agent: Accept a delivery ping
const acceptDelivery = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const agentId = req.acessToken.userID;

    const order = await Order.findOneAndUpdate(
        { _id: orderId, status: "READY_FOR_PICKUP", agentId: null },
        { agentId, status: "AGENT_ASSIGNED" },
        { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not available or already assigned." });

    res.status(200).json({ message: "Delivery accepted.", order });
});

// Agent: Verify Pickup at Vendor
const verifyPickup = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { pickupQrCode } = req.body;
    const agentId = req.acessToken.userID;

    const order = await Order.findOne({ _id: orderId, agentId, status: "AGENT_ASSIGNED" });
    if (!order) return res.status(404).json({ message: "Order not found." });

    if (order.pickupQrCode !== pickupQrCode) {
        return res.status(400).json({ message: "Invalid Pickup QR Code." });
    }

    order.status = "IN_TRANSIT";
    await order.save();

    res.status(200).json({ message: "Pickup verified. Order is now in transit.", order });
});


const submitKYC = asyncHandler(async (req, res) => {
    const agentId = req.acessToken.userID;
    const { idType, idNumber, idDocumentUrl, idDocumentBackUrl, selfieUrl, licenseDocumentUrl, vehicleRegistrationUrl, vehicleType, licensePlate, operatingZone } = req.body;

    const user = await User.findById(agentId);
    if (!user || user.role !== "agent") {
        return res.status(404).json({ message: "Agent not found." });
    }

    if (operatingZone && !operatingZone.toLowerCase().includes("akure")) {
        return res.status(400).json({ message: "Primary operating zone must be within Akure, Ondo State." });
    }

    user.agentDetails = {
        ...user.agentDetails,
        idType,
        idNumber,
        idDocumentUrl,
        idDocumentBackUrl,
        selfieUrl,
        licenseDocumentUrl,
        vehicleRegistrationUrl,
        vehicleType,
        licensePlate,
        operatingZone,
        kycStatus: "pending"
    };

    await user.save();

    res.status(200).json({ message: "KYC details submitted successfully. Status is pending.", user });
});

// Agent: Update Online Status (Availability)
const updateAvailability = asyncHandler(async (req, res) => {
    const agentId = req.acessToken.userID;
    const { isOnline } = req.body;

    const user = await User.findById(agentId);
    if (!user || user.role !== "agent") {
        return res.status(404).json({ message: "Agent not found." });
    }

    user.agentDetails.isOnline = isOnline;
    await user.save();

    res.status(200).json({ message: `Agent is now ${isOnline ? 'online' : 'offline'}.`, isOnline: user.agentDetails.isOnline });
});

// Agent: Get Profile
const getAgentProfile = asyncHandler(async (req, res) => {
    const agentId = req.acessToken.userID;

    const user = await User.findById(agentId).select('-password');
    if (!user || user.role !== "agent") {
        return res.status(404).json({ message: "Agent not found." });
    }

    res.status(200).json({ user });
});

const getAgentOrders = asyncHandler(async (req, res) => {
    const agentId = req.acessToken.userID;

    const user = await User.findById(agentId).select('-password');
    if (!user || user.role !== "agent") {
        return res.status(404).json({ message: "Agent not found." });
    }

    // Get stats
    const agentOrders = await Order.find({ agentId })
        .populate('vendorId', 'vendorDetails.restaurantName vendorDetails.storeAddress')
        .populate('customerId', 'name phoneNumber');
    
    let totalDeliveries = agentOrders.length;
    let completed = 0;
    let pending = 0;
    let failed = 0;
    const activeOrders = [];

    agentOrders.forEach(order => {
        if (order.status === "COMPLETED") completed++;
        else if (order.status === "CANCELLED" || order.status === "FAILED") failed++;
        else {
            pending++;
            activeOrders.push(order);
        }
    });

    // Get available orders
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const availableFilter = { 
        status: "READY_FOR_PICKUP", 
        agentId: null,
        deliveryMethod: "agent",
        rejectedBy: { $ne: agentId }
    };

    const totalAvailableOrders = await Order.countDocuments(availableFilter);

    const availableOrders = await Order.find(availableFilter)
        .populate('vendorId', 'vendorDetails.restaurantName vendorDetails.storeAddress')
        .populate('customerId', 'name phoneNumber')
        .skip(skip)
        .limit(limit);

    res.status(200).json({ 
        stats: { totalDeliveries, completed, pending, failed },
        availableOrders,
        activeOrders,
        pagination: {
            total: totalAvailableOrders,
            page,
            limit,
            totalPages: Math.ceil(totalAvailableOrders / limit)
        }
    });
});

// Agent: Update Profile (Name, Phone, Profile Picture)
const updateProfile = asyncHandler(async (req, res) => {
    const agentId = req.acessToken.userID;
    const { name, phoneNumber, profilePicture } = req.body;

    const user = await User.findById(agentId);
    if (!user) return res.status(404).json({ message: "Agent not found." });

    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();
    res.status(200).json({ message: "Profile updated successfully.", user });
});

// Agent: Get Finance (Earnings, Balance, Transactions)
const getAgentFinance = asyncHandler(async (req, res) => {
    const agentId = req.acessToken.userID;
    
    const transactions = await Transaction.find({ userId: agentId })
        .populate('orderId', 'createdAt')
        .sort('-createdAt');
    
    let balance = 0;
    let totalEarnings = 0;
    let totalWithdrawn = 0;

    transactions.forEach(tx => {
        if (tx.status === "COMPLETED") {
            if (tx.type === "EARNING") {
                balance += tx.amount;
                totalEarnings += tx.amount;
            } else if (tx.type === "WITHDRAWAL") {
                balance -= tx.amount;
                totalWithdrawn += tx.amount;
            }
        }
    });

    res.status(200).json({
        balance,
        totalEarnings,
        totalWithdrawn,
        transactions
    });
});

// Agent: Request Withdrawal
const requestWithdrawal = asyncHandler(async (req, res) => {
    const agentId = req.acessToken.userID;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount." });
    }

    const transactions = await Transaction.find({ userId: agentId, status: "COMPLETED" });
    let balance = 0;
    transactions.forEach(tx => {
        if (tx.type === "EARNING") balance += tx.amount;
        else if (tx.type === "WITHDRAWAL") balance -= tx.amount;
    });

    if (amount > balance) {
        return res.status(400).json({ message: "Insufficient balance." });
    }

    const withdrawTx = await Transaction.create({
        userId: agentId,
        amount,
        type: "WITHDRAWAL",
        status: "COMPLETED",
        reference: `AGT-WD-${Date.now()}-${Math.floor(Math.random()*1000)}`
    });

    res.status(200).json({ message: "Withdrawal successful.", transaction: withdrawTx, balance: balance - amount });
});

// Agent: Get Bank Details
const getBankDetails = asyncHandler(async (req, res) => {
    const agentId = req.acessToken.userID;
    const user = await User.findById(agentId).select('bankDetails');
    if (!user) return res.status(404).json({ message: "Agent not found." });

    res.status(200).json({ bankDetails: user.bankDetails || {} });
});

// Agent: Update Bank Details
const updateBankDetails = asyncHandler(async (req, res) => {
    const agentId = req.acessToken.userID;
    const { accountNumber, bankName, accountName } = req.body;

    const user = await User.findById(agentId);
    if (!user) return res.status(404).json({ message: "Agent not found." });

    user.bankDetails = {
        ...user.bankDetails,
        accountNumber,
        bankName,
        accountName
    };
    await user.save();

    res.status(200).json({ message: "Bank details updated.", bankDetails: user.bankDetails });
});

// Agent: Update Settings
const updateSettings = asyncHandler(async (req, res) => {
    const agentId = req.acessToken.userID;
    const { payoutPreference } = req.body;

    const user = await User.findById(agentId);
    if (!user) return res.status(404).json({ message: "Agent not found." });

    if (payoutPreference) {
        if (!user.bankDetails) user.bankDetails = {};
        user.bankDetails.payoutPreference = payoutPreference;
    }

    await user.save();
    res.status(200).json({ message: "Settings updated.", bankDetails: user.bankDetails });
});

// Agent: Get Cloudinary Signature for Secure KYC Upload
const getCloudinarySignature = asyncHandler(async (req, res) => {
    const timestamp = Math.round((new Date).getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request({
        timestamp: timestamp,
        type: "private",
        folder: "eatro_kyc"
    }, process.env.CLOUDINARY_API_SECRET);

    res.status(200).json({
        timestamp,
        signature,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY
    });
});

const rejectDelivery = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const agentId = req.acessToken.userID;

    const order = await Order.findByIdAndUpdate(
        orderId,
        { $addToSet: { rejectedBy: agentId } }, // Add agent to rejectedBy list
        { new: true }
    );

    if (!order) {
        return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ message: "Delivery rejected.", order });
});

module.exports = {
    acceptDelivery,
    verifyPickup,
    submitKYC,
    updateAvailability,
    getAgentProfile,
    updateProfile,
    getAgentFinance,
    requestWithdrawal,
    getBankDetails,
    updateBankDetails,
    updateSettings,
    getCloudinarySignature,
    getAgentOrders,
    rejectDelivery
};
