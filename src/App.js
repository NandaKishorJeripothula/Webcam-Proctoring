import React from 'react';
import './App.css';
import TensorFLowUtil from './TensorFlowUtil.component'
import Home from './Home.component';
import Capture from './Capture.component'
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Home />
        {/* <TensorFLowUtil/> */}
      </header>
      {/* <Capture/> */}
    </div>
  );
}

export default App;
