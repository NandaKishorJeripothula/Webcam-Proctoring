import React, { Component } from "react";
import * as faceapi from "face-api.js";
export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      videoSrc: null,
      Facescount: 0,
      warningCount: 0,
      errMessage: null
    };
  }
  componentDidMount = async () => {
    //load the model for face detection
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    /**
     * Get Acces to camera with user permission
     * handleVideo -> If the User accepts the permission request
     * videoError -> If the above case fails
     */
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia ||
      navigator.oGetUserMedia;
    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        { video: true },
        this.handleVideo,
        this.videoError
      );
    }
  };

  handleVideo = stream => {
    // Update the state, triggering the component to re-render with the correct stream
    if ("srcObject" in this.refs.Video) {
      this.refs.Video.srcObject = stream;
      this.setState({ videoSrc: true });
    } else {
      // If browser is outdated
      this.refs.Video.src = URL.createObjectURL(stream);
      this.setState({ videoSrc: true });
    }
  };

  videoError = () =>
    this.setState({ errMessage: "Please Check WebCam Permissions" });
  CaptureFaces = () => {
    setInterval(async () => {
      this.setState({ errMessage: null });
      await faceapi
        .detectAllFaces(this.refs.Video, new faceapi.TinyFaceDetectorOptions())
        .then(results => results.length)
        .then(result => {
          console.log(result);
          this.setState({
            Facescount: result,
            warningCount:
              result !== 1
                ? this.state.warningCount + 1
                : this.state.warningCount
          });
          if (result !== 1) {
            this.setState({
              errMessage:
                result > 1
                  ? "More than one face detected ..."
                  : "No Face detected, adjust came"
            });
          }
        });
    }, 100);
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
        <p style={{ color: "red" }}>{this.state.errMessage}</p>
        <div>
          <video
            ref="Video"
            autoPlay={true}
            style={{ maxWidth: 400, maxHeight: 300 }}
            onPlay={this.CaptureFaces}
          />
        </div>
      </div>
    );
  }
}
