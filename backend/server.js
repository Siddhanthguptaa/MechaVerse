// backend/server.js
const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")

const app = express()

// ✅ CORS FIX (correct place)
app.use(cors({
  origin: "https://mecha-verse.vercel.app",
  credentials: true
}))

const server = http.createServer(app)

// ✅ PORT FIX (important for Render)
const PORT = process.env.PORT || 3001

const io = new Server(server, {
  cors: {
    origin: ["https://mecha-verse.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true
  },
})

// Store all active rooms and their players
const rooms = {}

io.on("connection", (socket) => {
  console.log(`[SERVER] User Connected: ${socket.id}`)

  socket.on("joinRoom", (data) => {
    const { code, username, config } = data

    if (!code || !username || !config) {
      socket.emit("error", "Room code, username, and vehicle config are required.")
      return
    }

    const isNewRoom = !rooms[code]

    socket.join(code)

    if (isNewRoom) {
      rooms[code] = { players: {} }
    }

    const newPlayer = {
      id: socket.id,
      username: username,
      position: [0, 0, 0],
      rotation: [0, 0, 0, 1],
      config: config,
    }

    rooms[code].players[socket.id] = newPlayer

    socket.emit("roomAck", {
      success: true,
      message: isNewRoom
        ? `Room "${code}" created! Share this code to race.`
        : `Successfully joined room "${code}"!`,
      roomCode: code,
      username: username,
    })

    socket.emit("roomState", rooms[code].players)

    socket.to(code).emit("playerJoined", newPlayer)

    console.log(`[SERVER] Player "${username}" (${socket.id}) joined room "${code}"`)
  })

  socket.on("playerMove", (data) => {
    const { code, position, rotation } = data

    if (rooms[code] && rooms[code].players[socket.id]) {
      rooms[code].players[socket.id].position = position
      rooms[code].players[socket.id].rotation = rotation

      socket.to(code).emit("playerMoved", {
        id: socket.id,
        username: rooms[code].players[socket.id].username,
        position,
        rotation,
        config: rooms[code].players[socket.id].config,
      })
    }
  })

  socket.on("disconnect", () => {
    console.log(`[SERVER] User Disconnected: ${socket.id}`)

    for (const code in rooms) {
      if (rooms[code].players[socket.id]) {
        const username = rooms[code].players[socket.id].username
        delete rooms[code].players[socket.id]

        io.to(code).emit("playerLeft", socket.id)

        console.log(`[SERVER] Player "${username}" left room "${code}"`)

        if (Object.keys(rooms[code].players).length === 0) {
          delete rooms[code]
        }
        break
      }
    }
  })
})

server.listen(PORT, () => {
  console.log(`[SERVER] Running on port ${PORT}`)
})