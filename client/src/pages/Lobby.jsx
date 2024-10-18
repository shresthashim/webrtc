import React, { useState, useCallback, useEffect } from "react";
import { useSocket } from "../context/SocketProvider";
import { useNavigate } from "react-router-dom";
import "./Lobby.css";

const Lobby = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const socket = useSocket();

  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  useEffect(() => {
    if (socket) {
      // Set up the listener for when a user joins
      socket.on("user:joined", (email) => {
        navigate(`/room/${room}`, { state: { email } });
      });
    }

    // Cleanup to avoid adding duplicate listeners
    return () => {
      if (socket) {
        socket.off("user:joined");
      }
    };
  }, [socket, navigate, room]);

  return (
    <div className='lobby-container'>
      <div className='lobby-card'>
        <h1 className='lobby-title'>Welcome to the Lobby</h1>
        <form onSubmit={handleSubmit} className='lobby-form'>
          <div className='input-group'>
            <label htmlFor='email' className='form-label'>
              Email
            </label>
            <input
              type='email'
              id='email'
              className='form-input'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='input-group'>
            <label htmlFor='room' className='form-label'>
              Room ID
            </label>
            <input
              type='text'
              id='room'
              className='form-input'
              placeholder='Enter the Room ID'
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>
          <button type='submit' className='join-button'>
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default Lobby;
