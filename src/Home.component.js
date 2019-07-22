import React, { Component } from "react";
import * as faceapi from "face-api.js";
import Peer from 'peerjs';
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import './App.css';
export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      videoSrc: null,
      Facescount: 0,
      warningCount: 0,
      errMessage: '',
    };
  }

  videoRef = React.createRef();
  canvasRef = React.createRef();
 
  getInitialState = () => {
    /**
     * this if for testing the local system 
     */
    return {
      peer: new Peer('8500682248'),
      my_id: '8500682248',
      peer_id: '',
      initialized: false,
    }

    // This works for the online proctoring
    // return {
    //   peer = new Peer({
    //     host: 'yourwebsite.com', port: 3000, path: '/peerjs',
    //     debug: 3,
    //     config: {'iceServers': [
    //       { url: 'stun:stun1.l.google.com:19302' },
    //       { url: 'turn:numb.viagenie.ca', credential: 'muazkh', username: 'webrtc@live.com' }
    //     ]}
    //   })
    // }
  }

  componentWillMount=async ()=>{
    console.log("Hey ")
  await this.setState({...this.getInitialState()});

  }
  componentDidMount() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const webCamPromise = navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: "user"
          }
        })
        .then(stream => {
          window.stream = stream;
          this.videoRef.current.srcObject = stream;
          return new Promise((resolve, reject) => {
            this.videoRef.current.onloadedmetadata = () => {
              resolve();
            };
          });
        });
      const modelPromise = cocoSsd.load('lite_mobilenet_v2');
      Promise.all([modelPromise, webCamPromise])
        .then(values => {
          // this.canvasRef.current.width = this.videoRef.current.offsetWidth;
          // this.canvasRef.current.height = this.videoRef.current.offsetHeight;
          // this.detectFrame(this.videoRef.current, values[0]);
          this.getPicture(this.videoRef.current, values[0]);
          this.state.peer.on('open', id => {
            console.log("My peer id is " + id);
            this.setState({
              my_id: id,
              initialized: true,
            })
          });
          this.state.peer.connect('8500682248',()=>{
            console.log('connected');
          });
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
  getPicture(videoStream, model) {
    const imageGrabber = document.createElement('canvas');
    imageGrabber.width = videoStream.width;
    imageGrabber.height = videoStream.height;
    setInterval(async () => {
      await imageGrabber.getContext('2d').drawImage(videoStream, 0, 0, imageGrabber.width, imageGrabber.height);
      this.detectFrame(imageGrabber, model);
    }, 1000)

  }
  detectFrame = async (video, model) => {
    model.detect(video).then(predictions => {
      // console.log(predictions);
      if (!predictions.length) {
        console.log("No image");
        this.setState((prevState) => (
          {
            errMessage: "No one detected",
            Facescount: 0,
            warningCount: prevState.warningCount + 1
          }
        ));
      }
      else if (!(predictions.length === 1 && predictions[0].class === "person")) {
        this.setState((prevState) => ({ errMessage: "Suspicious Activity Detected", Facescount: predictions.length, warningCount: prevState.warningCount + 1 }));
        console.log("Suspicious");
        // this.renderPredictions(predictions);
      } else {
        this.setState({ Facescount: 1, errMessage: '' });
        // this.renderPredictions(predictions);
        requestAnimationFrame(() => {
          this.detectFrame(video, model);
        });
      }

    });
  };
  renderPredictions = predictions => {
    const ctx = this.canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Font options.
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";
    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      // Draw the bounding box.
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);
      // Draw the label background.
      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      // Draw the text last to ensure it's on top.
      ctx.fillStyle = "#000000";
      ctx.fillText(prediction.class, x, y);
    });
  };

  render() {
    return (
      <div>
        <h2>Webcam Proctoring</h2>
        <div>
          <div style={{ float: "left" }}>
            Faces:
            <h6>{this.state.Facescount}</h6>
          </div>
          <div style={{ float: "right" }}>
            Warnings:
            <h6>{this.state.warningCount}</h6>
          </div>
        </div>
        <div>

          <video
            autoPlay
            playsInline
            muted
            ref={this.videoRef}
            width="600"
            height="500"
          />
          <p style={{ color: "red" }}>{this.state.errMessage}</p>
        </div>
        {/* <div>

<video
          autoPlay
          playsInline
          muted
          width="300"
          height="200"
          className="size"
        />
        <canvas
          ref={this.canvasRef}
          width="300"
          height="200"
          className="size"
          id="canvas"
        />

</div> */}

      </div>
    );
  }
}
