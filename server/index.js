
// const cookieParser = require("cookie-parser");
// const fileUpload = require("express-fileupload");
// const cors = require("cors");
// 
// const PORT = process.env.PORT || 5000 ;
// const dbConnect = require("./config/database");
// const http = require('http');
// const path = require('path');
// const { Server } = require('socket.io');
// const ACTIONS = require('./Actions');
// const server = http.createServer(app);
// const io = new Server(server);
// const userSocketMap = {};


// //connecting to database
// dbConnect();

// 
// app.use(cookieParser());
// app.use(
// 	cors({
// 		origin: "*",
// 		credentials: true,
// 	})
// );

// app.use(
// 	fileUpload({
// 		useTempFiles: true,
// 		tempFileDir: "/tmp/",
// 	})
// );




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
const ACTIONS = require('./Actions');
const userSocketMap = {};
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

dbConnect();
cloudinaryConnect();

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

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
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

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        console.log(`Received CODE_CHANGE from ${socket.id}: ${code}`);
        // Emit the CODE_CHANGE event to all clients in the room
        io.to(roomId).emit(ACTIONS.CODE_CHANGE, {
            code,
        });
    });

    socket.on(ACTIONS.SEND_MESSAGE, ({ roomId, message }) => {
        io.to(roomId).emit(ACTIONS.SEND_MESSAGE, { message });
      });

    // Other socket event handlers...

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

//Setting up routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/reach", contactUsRoute);

app.get('/', (req, res) => {
    res.send("<h1>Backend is up and running!</h1>");
});


server.listen(PORT, () => console.log(`Server is running on ${PORT}`));
