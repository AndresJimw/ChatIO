import { useEffect, useState } from "react";
import io from "socket.io-client";
import Picker from 'emoji-picker-react';
import './ChatClient.css';

// const socket = io("http://localhost:3001"); //creamos un socket
const socket = io("/"); // Conéctate al backend y cuando te conectes vas a recibir información de respuesta.

export const ChatClient = () => {
  //Estado para listar los diferentes mensajes.
  const [messages, setMessages] = useState([]);
  //Estado para controlar el estado actual.
  const [message, setMessage] = useState(''); //varibale message y función para actualizar la variable message.
  //Estado para capturar el nombre del usuario.
  const [username, setUsername] = useState('');
  //Estado para capturar el emoji
  const [showPicker, setShowPicker] = useState(false);

  const isOwnMessage = (message) => message.user === username;

  const getColorForUsername = (message) => {
    return isOwnMessage(message) ? 'black' : 'white';
  };

  // Función que asigna el emoji
  const onEmojiClick = (emojiObject) => {
    setMessage( prevInput => prevInput + emojiObject.emoji);
    setShowPicker(false);
  };

  useEffect(() => {
    socket.on("message", receiveMessage)

    return () => {
      socket.off("message", receiveMessage);
    };
  }, []);

  const receiveMessage = (message) => //recibe un mensaje de la función setmessages, recibe un estado 
    setMessages(state => [message, ...state]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleSubmit = (event) => { //función para manejar el envío del formulario
    event.preventDefault(); //evita que el formulario refresque la página
    console.log(message);

    socket.emit('message', {body: message, user: username}); //Dispara el socket (envía el mensaje con el nombre de usuario al servidor)
    const newMessage = {
      body: message,
      user: username,
    };
    setMessages(state => [newMessage, ...state]);
    setMessage("");
  };

  return (
    <div className="chat-container">
    <div className="username-input">
      <input
        onChange={handleUsernameChange}
        className='input-field-username'
        type="text"
        placeholder='Enter your username'
      />
    </div>
    <div className='message-container'>
      {messages.map((message, index) => (
        <div 
          key={index}
          className={`message ${isOwnMessage(message) ? 'own-message' : 'other-message'}`}
        >
            <span className="username" style={{ color: getColorForUsername(message) }}>
              {message.user}: </span>
            <span className="body">{message.body}</span>
        </div>
      ))}
    </div>
    <form onSubmit={handleSubmit} className="message-input-form">
      <div className='emoji-picker'>
        <img
          className="emoji-icon"
          src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
          onClick={() => setShowPicker(!showPicker)}
          alt="Emoji Picker"
        />
        {showPicker && <Picker onEmojiClick={onEmojiClick} />}
      </div>
      <input
        name="message"
        type="text"
        placeholder="Write your message..."
        onChange={(e) => setMessage(e.target.value)}
        className="input-field"
        value={message}
        autoFocus
      />
      <button className="send-button">Send</button>
    </form>
  </div>
);
};