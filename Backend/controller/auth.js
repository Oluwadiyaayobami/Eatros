const asyncHandler = require("../utils/errorHandler")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { OAuth2Client } = require("google-auth-library")
const userSchema = require("../models/user")

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "703620296200-516k43vgq4vqn4a66km0cuirk4ogghup.apps.googleusercontent.com";
const JWT_SECRET = process.env.jwt || "PkrtmhknjbhvBLVNMUTAJYMDOJNHSBJGVFACGEHBJSHNKDGMLJ";
const REFRESH_SECRET = process.env.refersToken || "ghjnkmlgjfkdbnncjvjvkfkfjfjcnncncbxhcslkgnkbSk";
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);



const userRegistration = asyncHandler(async (req, res) => {
    const { name, email, password, role, phoneNumber, vendorDetails, agentDetails } = req.body 

    if(!name || !email || !password ){
        return res.status(400).json({
            message: "Please provide your name, email, and password."
        })
    }
    
    const validatingExistence = await userSchema.findOne({ email })
    if(validatingExistence) {
        return res.status(400).json({
            message: "User with this email already exists."
        })
    }

    if (role === "agent" && agentDetails && agentDetails.operatingZone) {
        if (!agentDetails.operatingZone.toLowerCase().includes("akure")) {
            return res.status(400).json({
                message: "Primary operating zone must be within Akure, Ondo State."
            })
        }
    }
    
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const addNewUser = await userSchema.create({
        name,
        password: hashedPassword,
        email,
        role: role || "customer",
        phoneNumber: phoneNumber || undefined,
        vendorDetails: vendorDetails || undefined,
        agentDetails: agentDetails || undefined
    })
    
    if(addNewUser) {
        return res.status(201).json({
            message: "Account created! Welcome to Eatro."
        })
    }
})
const login = asyncHandler(async (req,res) => {
    const {email, password } = req.body 
    if(!password || !email){
        return res.status(400).json({
            message : "pls provide email and password okay  "

        })
    }
    const validate = await userSchema.findOne({email})
    if(!validate){
        return res.status(404).json({
            message : "user with this info does not exist "
        })
    }
    const userPassword = validate.password
    const validatePassword = await bcrypt.compare(password,userPassword)
    if(!validatePassword){
        return res.status(400).json({
            message : "incorrect password pls provide the correct password "
        })
    }
    const acessToken = jwt.sign({
        userID : validate._id
    }, JWT_SECRET, { expiresIn: "1d" })

    const refreshToken = jwt.sign({                 
        userID : validate._id,           
    }, REFRESH_SECRET, { expiresIn: "7d" })

    const isProduction = process.env.NODE_ENV === "production" || Boolean(req.headers["x-forwarded-proto"] === "https");
    res.cookie('refreshtoken', refreshToken, {
        httpOnly: true,
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction,
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({
        message : "welcome",
        acessToken,
        role: validate.role
    })
})

const getProfile = asyncHandler(async (req, res) => {
    const userId = req.acessToken.userID;
    
    const user = await userSchema.findById(userId).select('-password');
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ user });
});

const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.acessToken.userID;
    const { name, phoneNumber } = req.body;
    
    const user = await userSchema.findByIdAndUpdate(
        userId,
        { name, phoneNumber },
        { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ message: "Profile updated successfully", user });
});

const refreshToken = asyncHandler(async (req, res) => {
    const token = req.cookies.refreshtoken;
    if (!token) {
        return res.status(401).json({ message: "No refresh token provided. Please log in again." });
    }

    try {
        const decoded = jwt.verify(token, REFRESH_SECRET);
        const user = await userSchema.findById(decoded.userID);
        
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const acessToken = jwt.sign({
            userID: user._id
        }, JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({
            acessToken,
            role: user.role
        });
    } catch (err) {
        return res.status(401).json({ message: "Refresh token is expired or invalid. Please log in again." });
    }
});

const googleAuth = asyncHandler(async (req, res) => {
    const { credential, access_token, role } = req.body;

    if (!credential && !access_token) {
        return res.status(400).json({
            message: "Google token or credential is required."
        });
    }

    let payload;
    if (credential) {
        try {
            const ticket = await googleClient.verifyIdToken({
                idToken: credential,
                audience: GOOGLE_CLIENT_ID,
            });
            payload = ticket.getPayload();
        } catch (err) {
            console.error("Google Token Verification Error:", err.message);
            return res.status(400).json({
                message: "Invalid or expired Google credential."
            });
        }
    } else if (access_token) {
        try {
            const googleRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });
            if (!googleRes.ok) {
                const errText = await googleRes.text();
                console.error("Google UserInfo API Error:", googleRes.status, errText);
                return res.status(400).json({
                    message: "Failed to fetch profile from Google."
                });
            }
            payload = await googleRes.json();
        } catch (err) {
            console.error("Google Access Token Error:", err.message);
            return res.status(400).json({
                message: "Failed to verify Google access token."
            });
        }
    }

    if (!payload || !payload.email) {
        return res.status(400).json({
            message: "Could not retrieve email from Google."
        });
    }

    const { sub: googleId, email, name, picture, email_verified } = payload;

    // Check if user exists by email or googleId safely
    const queryConditions = [{ email: email.toLowerCase() }];
    if (googleId) {
        queryConditions.push({ googleId });
    }
    let user = await userSchema.findOne({ $or: queryConditions });

    if (user) {
        let hasChanges = false;
        if (!user.googleId && googleId) {
            user.googleId = googleId;
            hasChanges = true;
        }
        if (!user.profilePicture && picture) {
            user.profilePicture = picture;
            hasChanges = true;
        }
        if (email_verified && !user.isVerified) {
            user.isVerified = true;
            hasChanges = true;
        }
        if (hasChanges) {
            await user.save();
        }
    } else {
        user = await userSchema.create({
            name: name || "Eatro User",
            email: email.toLowerCase(),
            googleId,
            authProvider: "google",
            profilePicture: picture || "",
            role: role || "customer",
            isVerified: !!email_verified
        });
    }

    const acessToken = jwt.sign({
        userID: user._id
    }, JWT_SECRET, { expiresIn: "1d" });

    const refreshToken = jwt.sign({
        userID: user._id,
    }, REFRESH_SECRET, { expiresIn: "7d" });

    const isProduction = process.env.NODE_ENV === "production" || Boolean(req.headers["x-forwarded-proto"] === "https");
    res.cookie('refreshtoken', refreshToken, {
        httpOnly: true,
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
        message: "welcome",
        acessToken,
        role: user.role,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePicture: user.profilePicture
        }
    });
});

module.exports = {
    userRegistration,
    login,
    getProfile,
    updateProfile,
    refreshToken,
    googleAuth
}