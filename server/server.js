const http = require("http").createServer();
const io = require("socket.io")(http, {
  cors: { origin: "*" },
});

let users = new Set()

io.on("connection", (socket) => {
  console.log('user connected -> ', socket.id)

  socket.emit('other users', JSON.stringify([...users]))
  
  socket.broadcast.emit('user connected', socket.id)
  
  users.add(socket.id)

  socket.on('disconnect', () => {
    users.delete(socket.id)
    socket.broadcast.emit("user disconnected",socket.id)
    console.log('user disconnected -> ', socket.id)
  })

  socket.broadcast.emit('user connected', socket.id)

  socket.on("mouse", (client) => {
    io.emit("mouseMove", client);
  });

  socket.on('piv', () => io.emit('piv',socket.id))
})

http.listen(8081, () => console.log("listening on http://localhost:8081"));
