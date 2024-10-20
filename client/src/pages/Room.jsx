import React, { useEffect, useCallback, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import ReactPlayer from "react-player";

const RoomPage = () => {
  const socket = useSocket();

  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`${email} joined the room with id: ${id}`);
    setRemoteSocketId(id);
  }, []);

  const handleCall = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setMyStream(stream);
  }, [socket, remoteSocketId]);

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

      {remoteSocketId && <button onClick={handleCall}>CALL</button>}

      <h1>My Stream</h1>
      {myStream && <ReactPlayer muted height={300} width={500} url={myStream} playing />}
    </>
  );
};

export default RoomPage;
