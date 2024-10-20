import React, { useEffect, useCallback, useState } from "react";
import { useSocket } from "../context/SocketProvider";

const RoomPage = () => {
  const socket = useSocket();

  const [remoteSocketId, setRemoteSocketId] = useState(null);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`${email} joined the room with id: ${id}`);
    setRemoteSocketId(id);
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);

    return () => {
      socket.off("user:joined", handleUserJoined);
    };
  }, [socket, handleUserJoined]);

  return (
    <>
      <h1>Room</h1>
      <h4>{remoteSocketId ? "Connected" : "Noone in room"}</h4>
    </>
  );
};

export default RoomPage;
