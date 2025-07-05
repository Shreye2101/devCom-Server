const express = require("express");
const connectDB = require("./src/config/db");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config(); // ✅ Load .env early

const app = express();
const server = http.createServer(app);

// ✅ Allow multiple origins from .env
const allowedOrigins = process.env.CLIENT_URLS
  ? process.env.CLIENT_URLS.split(",")
  : [];

// ✅ Express CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH"],
    credentials: true,
  })
);

// ✅ Socket.IO setup with same CORS
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by Socket.IO CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/auth", require("./src/routes/authRoutes"));
app.use("/profile", require("./src/routes/profileRoutes"));
app.use("/request", require("./src/routes/connectionRoutes"));
app.use("/user", require("./src/routes/userRotutes"));
app.use("/message", require("./src/routes/messageRoute"));

// ✅ Connect to DB and start server
connectDB()
  .then(() => {
    console.log("Database connection established");
    server.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => {
    console.log("Database connection error:", err);
  });

// ✅ Socket.IO Events
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (roomID) => {
    socket.join(roomID);
    console.log(`User ${socket.id} joined room ${roomID}`);
  });

  socket.on("sendMessage", (message) => {
    const roomID = message.conversationID;
    if (roomID) {
      io.to(roomID).emit("receiveMessage", message);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ✅ Root route
app.get("/", (req, res) => {
  res.status(200).send("ok");
});
