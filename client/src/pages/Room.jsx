import React, { useEffect, useCallback, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import ReactPlayer from "react-player";
import peer from "../services/peer";

const RoomPage = () => {
  const socket = useSocket();

  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`${email} joined the room with id: ${id}`);
    setRemoteSocketId(id);
  }, []);

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setMyStream(stream);
      const answer = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, answer });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    async ({ from, answer }) => {
      peer.setLocalDescription(answer);
      console.log(`Call accepted from ${from}`);
      sendStreams();
    },
    [sendStreams]
  );

  const handleCall = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const offer = await peer.getOffer();
    socket.emit("call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [socket, remoteSocketId]);

  const handleNegotiations = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:negotiations", { offer, to: remoteSocketId });
  });

  const handleIncomingNegotiations = useCallback(async ({ offer, from }) => {
    const ans = await peer.getAnswer(offer);
    socket.emit("peer:negotiations:done", { answer: ans, to: from });
  });

  const handleNegoFinal = useCallback(
    async ({ answer }) => {
      await peer.setLocalDescription(answer);
    },
    [myStream]
  );

  useEffect(() => {
    peer.peer.addEventListener("negotiations", handleNegotiations);

    return () => {
      peer.peer.removeEventListener("negotiations", handleNegotiations);
    };
  }, [handleNegotiations]);

  useEffect(() => {
    peer.peer.addEventListener("track", async(event) => {
      const remoteStream = event.streams;

      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:negotiations", handleIncomingNegotiations);
    socket.on("peer:negotiations:final", handleNegoFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:negotiations", handleIncomingNegotiations);
      socket.off("peer:negotiations:final", handleNegoFinal);
    };
  }, [socket, handleUserJoined, , handleCallAccepted, handleIncomingCall, handleIncomingNegotiations, handleNegoFinal]);

  return (
    <>
      <h1>Room</h1>
      <h4>{remoteSocketId ? "Connected" : "Noone in room"}</h4>

      {myStream && <button onClick={sendStreams}>Send Stream</button>}

      {remoteSocketId && <button onClick={handleCall}>CALL</button>}

      <h1>My Stream</h1>
      {myStream && <ReactPlayer muted height={300} width={500} url={myStream} playing />}

      <h1>Remote Stream</h1>
      {remoteStream && <ReactPlayer muted height={300} width={500} url={remoteStream} playing />}
    </>
  );
};

export default RoomPage;
