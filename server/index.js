
// Import required modules and set up initial configurations
const express = require('express');
const { Server } = require('socket.io');
const app = express();
const cors = require('cors');
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const contactUsRoute = require("./routes/Contact");
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);
const dbConnect = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");
const ACTIONS = require('./Actions'); // Import socket event action types
const userSocketMap = {}; // Map to track user sockets
const PORT = process.env.PORT || 5000; // Set the server port

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse incoming JSON requests

dbConnect(); // Connect to the database
cloudinaryConnect(); // Connect to Cloudinary for image storage

// Function to get details of all connected clients in a room
function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}

// Socket.IO event handling for user connections, code changes, and disconnections
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle user joining a room
    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        console.log("Clients list:", clients);

        // Emit joined event to all clients in the room
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            });
        });
    });

    // Handle code changes and broadcast to all clients in the room
    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        console.log(`Received CODE_CHANGE from ${socket.id}: ${code}`);
        io.to(roomId).emit(ACTIONS.CODE_CHANGE, {
            code,
        });
    });

    // Handle sending messages and broadcast to all clients in the room
    socket.on(ACTIONS.SEND_MESSAGE, ({ roomId, message }) => {
        io.to(roomId).emit(ACTIONS.SEND_MESSAGE, { message });
    });

    // Handle disconnection and notify clients in all rooms
    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.to(roomId).emit(ACTIONS.DISCONNECT, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });
});

// Set up routes for user authentication, profile management, and contact form submissions
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/reach", contactUsRoute);

// Default route to indicate that the backend is running
app.get('/', (req, res) => {
    res.send("<h1>Backend is up and running!</h1>");
});

// Start the server and listen on the specified port
server.listen(PORT, () => console.log(`Server is running on ${PORT}`));
