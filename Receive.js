import React, { useEffect, useState, useRef } from "react";
import Peer from "peerjs";
const Receive = () => {
  const [selfPeerId, setSelfPeerId] = useState(null);
  const [peer, setPeerObject] = useState(null);
  const videoRef = useRef(null);

  let imagePallet = useRef(null);

  useEffect(() => {
    getPeerInitialState();

  }, []);
  const getPeerInitialState = (id) => {
    /**
     * this if for testing the local system
     */
    console.log("Initilizing Peer");
    let peer = new Peer({
      host: "0.peerjs.com",
      config: {
        'iceServers': [
          { url: 'stun:stun1.l.google.com:19302' },
          {
            url: 'turn:numb.viagenie.ca',
            credential: 'muazkh',
            username: 'webrtc@live.com'
          }
        ]
      }
    });
    try {
      console.log(peer);
      peer.on('open', id => { console.log("Opened-my id is " + id); setPeerObject(peer); setSelfPeerId(id) });
      peer.on('connection', (conn) => {
        conn.on('data', (data) => {

          console.log('Got Data');
          let img = document.createElement("img");
          img.classList.add("capturedImage");
          img.src = data.toDataURL();
          imagePallet.current.appendChild(img);
        });
      });
      peer.on("call", call => {
        console.log("Someone connected and call is " + call);
        call.on('stream', remoteStream => {
          console.log("Call Recieved");
          videoRef.current.srcObject = remoteStream;
          console.log("Stream....")
        });
        call.on('close', function () {
          alert("The videocall has finished");
        });
      });
      // peer.on("call", call => {
      //   console.log("Call Recieved");
      //   call.on("stream", remoteStream => {
      //     videoRef.current.srcObject = remoteStream;
      //   });
      // });
    } catch {
      console.log("Error");
    }
  };
  return (
    <div>
      <video
        autoPlay
        playsInline
        muted
        ref={videoRef}
        width="300"
        height="200"
        style={{ borderRadius: 10, border: "solid" }}
      />
      <div ref={imagePallet} className={"recordingPlace"} />
    </div>
  );
};

export default Receive;
