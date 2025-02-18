// src/app.jsx

'use strict';

import WhisperRecorder from "./client/WhisperRecorder.jsx";

import './app.css';

export function App() {

  return (
    <div style={{ textAlign: "center"}}>
      <h1>React Whisper</h1>
      <WhisperRecorder />
    </div>
  );
}
