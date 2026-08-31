const asyncHandler = require("../utils/errorHandler");
const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");
const Transaction = require("../models/transaction");
const Review = require("../models/review");
const Collection = require("../models/collection");

// Create a new product (Vendor only
const addProduct = asyncHandler(async (req, res) => {
    // authorization middleware should set req.acessToken
    const vendorId = req.acessToken.userID; 
    const { name, description, price, category, imageUrl, isAvailable } = req.body;

    if(!name || !price) {
        return res.status(400).json({ message: "Product name and price are required." });
    }

    const newProduct = await Product.create({
        vendorId,
        name,
        description,
        price,
        category,
        imageUrl,
        isAvailable
    });

    res.status(201).json({
        message: "Product added successfully",
        product: newProduct
    });
});

// Get vendor's own products (Vendor only)
const getMyProducts = asyncHandler(async (req, res) => {
    const vendorId = req.acessToken.userID; 
    const products = await Product.find({ vendorId });
    res.status(200).json({ products });
});

// Customer route: Get all open vendors
const getAllVendors = asyncHandler(async (req, res) => {
    const { type } = req.query;
    
    // We filter by role "vendor" and ideally where isOpen is true
    let filter = { role: "vendor" };
    if (type) {
        filter["vendorDetails.vendorType"] = type;
    }

    const vendors = await User.find(filter)
        .select("-password -bankDetails -agentDetails");
    res.status(200).json({ vendors });
});

// Customer route: Get products for a specific vendor
const getVendorProducts = asyncHandler(async (req, res) => {
    const { vendorId } = req.params;
    const products = await Product.find({ vendorId, isAvailable: true });
    res.status(200).json({ products });
});

// Customer route: Get vendor profile by ID
const getVendorProfileById = asyncHandler(async (req, res) => {
    const { vendorId } = req.params;
    const vendor = await User.findOne({ _id: vendorId, role: "vendor" }).select("-password -bankDetails -agentDetails");
    
    if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({ vendor });
});

// Update vendor profile (Vendor only)
const updateVendorProfile = asyncHandler(async (req, res) => {
    const vendorId = req.acessToken.userID;
    const { vendorType, restaurantName, businessStatus, coverImage, profileImage, storeAddress, description } = req.body;

    const user = await User.findById(vendorId);
    if (!user) {
        return res.status(404).json({ message: "Vendor not found" });
    }

    if (!user.vendorDetails) {
        user.vendorDetails = {};
    }

    if (restaurantName !== undefined) user.vendorDetails.restaurantName = restaurantName;
    if (vendorType !== undefined) user.vendorDetails.vendorType = vendorType;
    if (businessStatus !== undefined) user.vendorDetails.businessStatus = businessStatus;
    if (coverImage !== undefined) user.vendorDetails.coverImage = coverImage;
    if (profileImage !== undefined) user.vendorDetails.profileImage = profileImage;
    if (storeAddress !== undefined) user.vendorDetails.storeAddress = storeAddress;
    if (description !== undefined) user.vendorDetails.description = description;

    await user.save();

    res.status(200).json({
        message: "Vendor profile updated successfully",
        vendor: user
    });
});

// Get vendor analytics (Vendor only)
const getVendorAnalytics = asyncHandler(async (req, res) => {
    const vendorId = req.acessToken.userID;
    
    const orders = await Order.find({ vendorId });
    
    let totalSales = 0;
    let activeOrders = 0;
    let completedOrders = 0;
    let cancelledOrders = 0;

    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday
    const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - daysToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklySalesMap = {
        Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0
    };
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    orders.forEach(order => {
        if (order.status === "DELIVERED") {
            totalSales += order.totalAmount;
            completedOrders++;
            
            // Check if order is in current week
            const orderDate = new Date(order.createdAt || order.updatedAt || new Date());
            if (orderDate >= startOfWeek) {
                const dayName = dayNames[orderDate.getDay()];
                weeklySalesMap[dayName] += order.totalAmount;
            }
        } else if (order.status === "CANCELLED") {
            cancelledOrders++;
        } else {
            activeOrders++;
        }
    });
    
    const weeklySales = [
        { day: 'Mon', sales: weeklySalesMap['Mon'] },
        { day: 'Tue', sales: weeklySalesMap['Tue'] },
        { day: 'Wed', sales: weeklySalesMap['Wed'] },
        { day: 'Thu', sales: weeklySalesMap['Thu'] },
        { day: 'Fri', sales: weeklySalesMap['Fri'] },
        { day: 'Sat', sales: weeklySalesMap['Sat'] },
        { day: 'Sun', sales: weeklySalesMap['Sun'] },
    ];

    res.status(200).json({
        totalSales,
        activeOrders,
        completedOrders,
        cancelledOrders,
        totalOrders: orders.length,
        balance: totalSales * 0.9, // example logic
        weeklySales
    });
});

// Get vendor finance data (Vendor only)
const getVendorFinance = asyncHandler(async (req, res) => {
    const vendorId = req.acessToken.userID;
    
    // Get all completed earning transactions or use delivered orders
    // For now, let's calculate total income from DELIVERED orders
    const orders = await Order.find({ vendorId });
    
    let totalIncome = 0;
    let pendingClearance = 0;

    orders.forEach(order => {
        if (order.status === "DELIVERED") {
            totalIncome += order.totalAmount;
        } else if (order.status === "READY_FOR_PICKUP" || order.status === "ACCEPTED_BY_VENDOR" || order.status === "PENDING") {
            pendingClearance += order.totalAmount;
        }
    });

    // Get withdrawals (if any in Transaction model)
    const transactions = await Transaction.find({ userId: vendorId }).sort('-createdAt').limit(10);
    
    let totalWithdrawn = 0;
    transactions.forEach(tx => {
        if (tx.type === "WITHDRAWAL" && tx.status === "COMPLETED") {
            totalWithdrawn += tx.amount;
        }
    });

    res.status(200).json({
        totalIncome,
        totalWithdrawn,
        pendingClearance,
        totalTransactions: transactions.length, // or actual count if we want all
        recentTransactions: transactions
    });
});

// Delete a category and all its products (Vendor only)
const deleteCategory = asyncHandler(async (req, res) => {
    const vendorId = req.acessToken.userID;
    const { categoryName } = req.params;

    if (!categoryName) {
        return res.status(400).json({ message: "Category name is required" });
    }

    // Delete all products for this vendor matching the category name
    const result = await Product.deleteMany({ vendorId, category: categoryName });
    
    // Also delete the collection model if it exists
    await Collection.deleteOne({ vendorId, name: categoryName });

    res.status(200).json({
        message: `Category '${categoryName}' and its products deleted successfully`,
        deletedCount: result.deletedCount
    });
});

// Create a collection (Vendor only)
const createCollection = asyncHandler(async (req, res) => {
    const vendorId = req.acessToken.userID;
    const { name, image } = req.body;

    if (!name) return res.status(400).json({ message: "Collection name is required" });

    // Ensure it doesn't already exist
    const existing = await Collection.findOne({ vendorId, name });
    if (existing) {
        return res.status(400).json({ message: "Collection already exists" });
    }

    const collection = await Collection.create({
        vendorId,
        name,
        image: image || ""
    });

    res.status(201).json({
        message: "Collection created successfully",
        collection
    });
});

// Get collections for logged-in vendor
const getVendorCollections = asyncHandler(async (req, res) => {
    const vendorId = req.acessToken.userID;
    const collections = await Collection.find({ vendorId }).sort('-createdAt');
    res.status(200).json({ collections });
});

// Get collections for a specific vendor profile (Public)
const getPublicCollections = asyncHandler(async (req, res) => {
    const { vendorId } = req.params;
    const collections = await Collection.find({ vendorId }).sort('-createdAt');
    res.status(200).json({ collections });
});

// Toggle Like on a Vendor Profile
const toggleLike = asyncHandler(async (req, res) => {
    const userId = req.acessToken.userID;
    const { vendorId } = req.params;

    const vendor = await User.findOne({ _id: vendorId, role: "vendor" });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    if (!vendor.vendorDetails) vendor.vendorDetails = {};
    if (!vendor.vendorDetails.likes) vendor.vendorDetails.likes = [];

    const hasLiked = vendor.vendorDetails.likes.includes(userId);
    if (hasLiked) {
        vendor.vendorDetails.likes = vendor.vendorDetails.likes.filter(id => id.toString() !== userId);
    } else {
        vendor.vendorDetails.likes.push(userId);
    }

    await vendor.save();
    res.status(200).json({
        message: hasLiked ? "Unliked successfully" : "Liked successfully",
        isLiked: !hasLiked,
        likeCount: vendor.vendorDetails.likes.length
    });
});

// Submit a Rating for a Vendor
const submitRating = asyncHandler(async (req, res) => {
    const userId = req.acessToken.userID;
    const { vendorId } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Valid rating between 1 and 5 is required" });
    }

    const vendor = await User.findOne({ _id: vendorId, role: "vendor" });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    // Create or update review
    await Review.findOneAndUpdate(
        { vendorId, userId },
        { rating },
        { upsert: true, new: true, runValidators: true }
    );

    // Calculate new average
    const allReviews = await Review.find({ vendorId });
    const totalRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = allReviews.length > 0 ? (totalRating / allReviews.length) : 0;

    if (!vendor.vendorDetails) vendor.vendorDetails = {};
    vendor.vendorDetails.rating = Number(averageRating.toFixed(1));
    vendor.vendorDetails.ratingCount = allReviews.length;
    await vendor.save();

    res.status(200).json({
        message: "Rating submitted successfully",
        averageRating: vendor.vendorDetails.rating,
        ratingCount: vendor.vendorDetails.ratingCount
    });
});

// Get User's Interaction with Vendor
const getVendorInteraction = asyncHandler(async (req, res) => {
    const userId = req.acessToken.userID;
    const { vendorId } = req.params;

    const vendor = await User.findOne({ _id: vendorId, role: "vendor" });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const isLiked = vendor.vendorDetails?.likes?.includes(userId) || false;
    const userReview = await Review.findOne({ vendorId, userId });

    res.status(200).json({
        isLiked,
        userRating: userReview ? userReview.rating : null
    });
});

module.exports = {
    addProduct,
    getMyProducts,
    getAllVendors,
    getVendorProducts,
    getVendorProfileById,
    updateVendorProfile,
    getVendorAnalytics,
    getVendorFinance,
    deleteCategory,
    toggleLike,
    submitRating,
    getVendorInteraction,
    createCollection,
    getVendorCollections,
    getPublicCollections
};
