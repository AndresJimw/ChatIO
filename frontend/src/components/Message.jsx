import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import CryptoJS from "crypto-js"; // Importa la librería CryptoJS para cifrado y descifrado

const Message = ({ message }) => {
  console.log("Message: ", message);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [decryptedText, setDecryptedText] = useState(""); // Estado para almacenar el texto descifrado

  useEffect(() => {
    // Función para descifrar un mensaje cifrado
    const decryptMessage = (encryptedText, secretKey) => {
      const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    };

    // Descifra el mensaje cuando se carga el componente
    const secretKey = "clave-secreta"; // Reemplaza "clave-secreta" con la clave correcta
    const decryptedMessage = decryptMessage(message.text, secretKey);
    setDecryptedText(decryptedMessage);
  }, [message.text]);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span>just now</span>
      </div>
      <div className="messageContent">
      <p>{decryptedText}</p> {/* Muestra el texto descifrado */}
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;
