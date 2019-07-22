import React from 'react';
import './App.css';
import TensorFLowUtil from './TensorFlowUtil.component'
import Home from './Home.component';
import Capture from './Capture.component'
function App() {
  var options={
    peerJsKey:" "
  }
  return (
    <div className="App">
      <header className="App-header">
        {/* https://www.sitepoint.com/file-sharing-component-react/
        https://peerjs.com/
        https://github.com/madou/react-peer
        https://blog.bitsrc.io/build-a-webcam-communication-app-using-webrtc-9737384e84be
        https://ourcodeworld.com/articles/read/671/how-to-record-a-video-with-audio-in-the-browser-with-javascript-webrtc */}
        <Home />
        {/* <TensorFLowUtil/> */}
      </header>
      {/* <Capture/> */}
    </div>
  );
}

export default App;
