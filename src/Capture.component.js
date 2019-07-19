import React from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import './App.css';

export default class Capture extends React.Component {
  constructor() {
    super();
    this.state = { status: "" };
  }
  videoRef = React.createRef();
  canvasRef = React.createRef();

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
          // this.detectFrame(this.videoRef.current, values[0]);
          this.getPicture(this.videoRef.current,values[0]);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
  getPicture(videoStream, model) {
    const imageGrabber= document.createElement('canvas');
    imageGrabber.width= videoStream.width;
    imageGrabber.height= videoStream.height;
    setInterval(async () => {
      await imageGrabber.getContext('2d').drawImage(videoStream, 0, 0, imageGrabber.width, imageGrabber.height);
      this.detectFrame(imageGrabber, model);
    }, 1000)

  }
  detectFrame = async (video, model) => {
    model.detect(video).then(predictions => {
      console.log(predictions);
      if (!predictions.length) {
        this.setState({ status: "No one detected" });
        console.log("No image");
      }
      if (!(predictions.length === 1 && predictions[0].class === "person")) {
        this.setState({ status: "" });
        console.log("Suspicious");
      }
      this.renderPredictions(predictions);
      requestAnimationFrame(() => {
        this.detectFrame(video, model);
      });
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
    let { status } = this.state;
    return (
      <div>
        {status}
        <video
          className="size"
          autoPlay
          playsInline
          muted
          ref={this.videoRef}
          width="600"
          height="500"
        />
        <canvas
          className="size"
          ref={this.canvasRef}
          width="600"
          height="500"
        />
      </div>
    );
  }
}
