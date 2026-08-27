const express = require('express');
const { userRegistration, login, getProfile, updateProfile, refreshToken } = require('../controller/auth');
const { authorization } = require('../middleware/autorization');
const router = express.Router();

router.post("/register",userRegistration)
router.post("/login",login)
router.post("/refresh", refreshToken)
router.get("/profile", authorization, getProfile)
router.patch("/profile", authorization, updateProfile)

module.exports = router;
