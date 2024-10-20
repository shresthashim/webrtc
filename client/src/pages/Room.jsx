import React, { useEffect, useCallback } from "react";
import { useSocket } from "../context/SocketProvider";

const RoomPage = () => {
  const socket = useSocket();

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`${email} joined the room with id: ${id}`);
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);

    return () => {
      socket.off("user:joined", handleUserJoined);
    };
  }, [socket, handleUserJoined]);

  return <div>Room Page HO</div>;
};

export default RoomPage;
