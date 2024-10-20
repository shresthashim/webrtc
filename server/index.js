const { Server } = require("socket.io");

const io = new Server(4000, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const emailToSocketIdMap = new Map();

const SocketIdToEmailMap = new Map();

io.on("connection", (socket) => {
  socket.on("room:join", ({ email, room }) => {
    emailToSocketIdMap.set(email, socket.id);
    SocketIdToEmailMap.set(socket.id, email);

    io.to(room).emit("user:joined", { email, id: socket.id });

    socket.join(room);

    io.to(socket.id).emit("user:joined", email);
  });
});
