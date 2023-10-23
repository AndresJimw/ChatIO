import express from "express";
import http from "http";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import { resolve, dirname } from "path";

import { PORT } from "./config.js";
import cors from "cors"; //para poder dar acceso a las peticiones que voy a realizar

// Initializations
const app = express(); //crea una instancia de express
const server = http.createServer(app); //crea un servidor de http en app
const io = new SocketServer(server, { //crea una nueva instancia de SocketServer. Va a recibir server
  // cors: {
  //   origin: "http://localhost:3000",
  // },
});

// Middlewares
app.use(cors()); //usa los cors que configuramos
app.use(morgan("dev")); //configura morgan en opción de desarrollo
app.use(express.urlencoded({ extended: false }));

app.use(express.static(resolve("frontend/dist")));
//Nuestro socket puede recibir algunos eventos.
//Evento .on() está pendiente para escuchar algo que se puede ejecutar eventualmente.
//body es el contenido del mensaje, 
io.on("connection", (socket) => { // (Evento) Cuando pase una conección recibe un socket
  console.log('Client connected: ', socket.id); // Cuando un cliente se conecte voy a ver por consola del servidor un client connected ya que cada socket tiene un objeto id
  //el socket va a escuchar lo que suceda en message, en este caso message va a recibir un mensaje body
  socket.on("message", (message) => { // Cuando me envíe un evento message (cuando escuches message) vamos a recibir datos desde el frontend
    console.log('Data: ', message)
    //lo que recibió en el socket lo va a emitir cuando se ejecute el evento message
    socket.broadcast.emit("message", { //Evento en el que el backend envía datos hacia el frontend (hacia todos los clientes).
      body: message.body,
      user: message.user,
    });
  });
});

server.listen(PORT);
console.log(`Server started on port ${PORT}`);
