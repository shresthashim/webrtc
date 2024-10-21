import React, { useEffect, useCallback, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import ReactPlayer from "react-player";
import peer from "../services/peer";

const RoomPage = () => {
  const socket = useSocket();

  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`${email} joined the room with id: ${id}`);
    setRemoteSocketId(id);
  }, []);

  const handleIncomingCall = useCallback( ({ from, offer }) => {
    console.log(`Incoming call from ${from}`);
  }, []);

  const handleCall = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const offer = await peer.getOffer();
    socket.emit("call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [socket, remoteSocketId]);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("call", handleIncomingCall);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("call", handleIncomingCall);
    };
  }, [socket, handleUserJoined, handleIncomingCall]);

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
