import React from 'react';
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
const TensorFlowUtil = () => {
    const [faceCount, setFaceCount] = React.useState(0);
    const [warningCount, setWarningCount] = React.useState(0);
    const [errorMessage, setErrorMessage] = React.useState("");
    let videoRef = null;

    const preLoad = async () => {
        console.log("preLoad")
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const webCamPromise = navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    /**
                     * This is can be either true as video:true
                     * Or if the camera supports face tracking 
                     * We can get that by
                     */
                    facingMode: 'user'
                }
            })
                .then(stream => {
                    // Update the state, triggering the component to re-render with the correct stream
                    if ("srcObject" in videoRef) {
                        videoRef.srcObject = stream;
                        // If browser is outdated
                        videoRef.src = URL.createObjectURL(stream);
                    }
                    return new Promise((resolve, reject) => {
                        videoRef.current.onloadedmetadata = () => resolve();
                    })
                })
                .catch(error => setErrorMessage("Please allow the app to use the webcamera"));

            //load the model for face detection
            const modelLoadPromise = cocoSsd.load();
            Promise.all([modelLoadPromise,webCamPromise ])
                .then(values => {
                    console.log(values);
                    captureFaces(videoRef,values[0]);
                })
                .catch(error => setErrorMessage(error))
        }

    }
    // const captureFaces = () => {
    //     setInterval(async () => {
    //         setErrorMessage('');
    //         await faceapi
    //             .detectAllFaces(videoRef, new faceapi.TinyFaceDetectorOptions())
    //             .then((results => results.length)
    //             .then(result => {
    //                 setFaceCount(result);
    //                 result !== 1? setWarningCount(prevWarningCount => prevWarningCount + 1): setWarningCount(warningCount);
    //                 if (result !== 1) {
    //                     result > 1 ? setErrorMessage("More than one face detected ...") : setErrorMessage("No Face detected, adjust came");
    //                 }
    //             })
    //     }, 2000);
    // }
    const captureFaces=(video,model)=>{
        console.log(video);
        console.log(model);
        model.detect(video).then(predictions => {
            console.log(predictions);
        //   this.renderPredictions(predictions);
        //   requestAnimationFrame(() => {
        //     thcis.detectFrame(video, model);
        //   });
        });
      }

//ComponentDidMount Functionality
React.useEffect(()=>{
    let preLoadCall=async ()=>{
        await preLoad();
    }
    preLoadCall();
}, [])
return (
    <div>
        <h2>Webcam Proctoring</h2>
        <div>
            <div style={{ float: "left" }}>
                Faces:
            <h6>{faceCount}</h6>
            </div>
            <div style={{ float: "right" }}>
                Warnings:
            <h6>{warningCount}</h6>
            </div>
        </div>
        <p style={{ color: "red" }}>{}</p>
        <div>
            <video
                ref={(video) => { videoRef = video; }}
                autoPlay={true}
                style={{ maxWidth: 400, maxHeight: 300 }}
                // onPlay={captureFaces}
            />
            <p>{errorMessage.toString()}</p>
        </div>
    </div>
)
}
export default TensorFlowUtil