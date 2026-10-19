const express = require("express")
const path = require("path")
require("dotenv").config({ path: path.join(__dirname, ".env") })
const cors = require("cors")

const cookieParser = require("cookie-parser")
const dataBaseConnection = require("./database/database.js")
const http = require("http")
const { Server } = require("socket.io")
const allowedOrigins = [
  "https://eatros.vercel.app",
  "https://eatro.shop",
  "https://www.eatro.shop",
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

const checkOrigin = (origin, callback) => {
  // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
  if (!origin) return callback(null, true);
  try {
    const url = new URL(origin);
    const host = url.hostname;
    if (
      allowedOrigins.includes(origin) ||
      host.endsWith(".vercel.app") ||
      host === "eatro.shop" ||
      host.endsWith(".eatro.shop") ||
      host === "localhost" ||
      host === "127.0.0.1"
    ) {
      return callback(null, true);
    }
  } catch (err) {
    console.error("CORS Origin Parsing Error:", err);
  }
  // Fallback: reflect the origin so cross-domain Vercel/Render requests with credentials succeed
  return callback(null, true);
};

const corsOptions = {
  origin: checkOrigin,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers"
  ],
  credentials: true,
  optionsSuccessStatus: 204
};

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: corsOptions
})

// Attach io to req so controllers can use it to broadcast events
app.use((req, res, next) => {
  req.io = io;
  next();
})

const routes = require("./routes/user.js")
const vendorRoutes = require("./routes/vendor.js")
const orderRoutes = require("./routes/order.js")
const agentRoutes = require("./routes/agent.js")
const port = process.env.PORT || 5000

// Enable CORS for all routes and preflight requests
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', routes)

app.use('/api/vendor', vendorRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/agent', agentRoutes)

io.on("connection", (socket) => {
  console.log("WebSocket Client connected:", socket.id);

  // Agent emits location
  socket.on("agent:location_update", (data) => {
    // data: { agentId, orderId, lat, lng }
    if (data.orderId) {
      socket.to(`order:track:${data.orderId}`).emit("order:location_update", data);
    }
  });

  // Customer joins room to track order
  socket.on("join_order_tracking", (orderId) => {
    socket.join(`order:track:${orderId}`);
    console.log(`Socket ${socket.id} joined tracking room for order ${orderId}`);
  });

  socket.on("disconnect", () => {
    console.log("WebSocket Client disconnected:", socket.id);
  });
});

// Health check endpoints for Render and pinging
app.get('/', (req, res) => {
  res.status(200).send("Eatro Backend API is alive and running!");
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "ok", service: "eatro-backend", timestamp: new Date().toISOString() });
});

// Global error handler ensuring CORS headers are preserved even on 500 errors
app.use((err, req, res, next) => {
  console.error("Express Error Handler caught:", err);
  const origin = req.headers.origin;
  if (origin) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || "An unexpected server error occurred",
    ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {})
  });
});

server.listen(port, () => console.log(`server running on ${port}`))

