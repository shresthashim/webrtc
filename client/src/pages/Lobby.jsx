import React from "react";
import "./Lobby.css";

const Lobby = () => {
  return (
    <div className="lobby-container">
      <div className="lobby-card">
        <h1 className="lobby-title">Welcome to the Lobby</h1>
        <form className="lobby-form">
          <div className="input-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" id="email" className="form-input" placeholder="Enter your email" />
          </div>
          <div className="input-group">
            <label htmlFor="room" className="form-label">Room ID</label>
            <input type="text" id="room" className="form-input" placeholder="Enter the Room ID" />
          </div>
        </form>
        <button className="join-button">Join Room</button>
      </div>
    </div>
  );
};

export default Lobby;
