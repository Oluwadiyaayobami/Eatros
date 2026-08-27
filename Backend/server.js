const express = require("express")
const env = require("dotenv").config()
const cors = require("cors")
const cookieParser = require("cookie-parser")
const dataBaseConnection = require("./database/database.js")
const http = require("http")
const { Server } = require("socket.io")
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: ["https://eatros.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true
  }
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






app.use(cors({
  origin: ["https://eatros.vercel.app", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}))
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
})

server.listen(port, () => console.log(`server running on ${port}`))
