const express = require('express');
const router = express.Router();
const { authorization } = require('../middleware/autorization');
const { addProduct, getMyProducts, getAllVendors, getVendorProducts, getVendorProfileById, updateVendorProfile, getVendorAnalytics, deleteCategory, getVendorFinance, toggleLike, submitRating, getVendorInteraction, createCollection, getVendorCollections, getPublicCollections } = require('../controller/vendor');

// Vendor routes (requires authentication)
router.post('/products', authorization, addProduct);
router.get('/my-products', authorization, getMyProducts);
router.patch('/profile', authorization, updateVendorProfile);
router.get('/analytics', authorization, getVendorAnalytics);
router.get('/finance', authorization, getVendorFinance);
router.delete('/products/category/:categoryName', authorization, deleteCategory);

// Collection routes
router.post('/collections', authorization, createCollection);
router.get('/collections', authorization, getVendorCollections);
router.get('/:vendorId/collections', getPublicCollections);

// Public routes
router.get('/list', getAllVendors);
router.get('/:vendorId/profile', getVendorProfileById);
router.get('/:vendorId/products', getVendorProducts);

// Customer interaction routes (requires authentication)
router.post('/:vendorId/like', authorization, toggleLike);
router.post('/:vendorId/rate', authorization, submitRating);
router.get('/:vendorId/interaction', authorization, getVendorInteraction);

module.exports = router;
