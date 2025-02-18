// src/client/WhisperRecorder.jsx

'use strict';

import React, { useState, useRef } from 'react';
import axios from 'axios';

const WhisperRecorder = () => {
  const [isRecording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isLoading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Start recording audio
  const startRecording = async () => {
    const stream =
      await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.start();
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob =
        new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      setLoading(true);

      try {
        const response =
          await axios.post(
            'http://localhost:5000/transcribe',
            formData,{
              headers: { "Content-Type": "multipart/form-data" }
            });
        setTranscription(response.data.transcription);
      } catch (error) {
        console.error('Error transcribing audio:', error);
      } finally {
        setLoading(false);
      }
    
      setRecording(true);
    };
  };

  // Stop recording audio
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    setRecording(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "1px" }}>
      <h2>Whisper AI Transcription</h2>

      <button
        onClick={ isRecording ? stopRecording : startRecording }
        style={{
          backgroundColor: isRecording ? 'red' : 'green',
          borderRadius: '5px',
          color: 'white',
          cursor: 'pointer',
          fontSize: '16px',
          marginRight: '10px',
        }}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>

      {isLoading && <p>Processing your audio...</p>}

      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '5px',
          margin: '20px auto',
          marginTop: '20px',
          maxWidth: '600px',
          padding: '10px',
        }}
      >
        <h3>Transcription:</h3>
        <p>{ transcription || "Audio Transcription ..." }</p>
      </div>
    </div>
  );
  
};

export default WhisperRecorder;