const express = require('express');
const router = express.Router();
const { authorization } = require('../middleware/autorization');
const { 
    acceptDelivery, verifyPickup, submitKYC, updateAvailability, 
    getAgentProfile, getAgentOrders, updateProfile, getAgentFinance, requestWithdrawal, getBankDetails, 
    updateBankDetails, updateSettings, getCloudinarySignature, rejectDelivery 
} = require('../controller/agent');

// Agent routes (requires authentication)
router.patch('/delivery/:orderId/accept', authorization, acceptDelivery);
router.post('/delivery/:orderId/verify-pickup', authorization, verifyPickup);

router.post('/kyc', authorization, submitKYC);
router.patch('/status', authorization, updateAvailability);
router.get('/profile', authorization, getAgentProfile);
router.get('/orders', authorization, getAgentOrders);
router.patch('/profile', authorization, updateProfile);
router.patch('/orders/:orderId/reject', authorization, rejectDelivery);
router.get('/cloudinary-signature', authorization, getCloudinarySignature);

router.get('/finance', authorization, getAgentFinance);
router.post('/withdraw', authorization, requestWithdrawal);
router.route('/bank')
  .get(authorization, getBankDetails)
  .put(authorization, updateBankDetails);
router.patch('/settings', authorization, updateSettings);

module.exports = router;
