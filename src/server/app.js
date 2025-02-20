import express from 'express';
import multer from 'multer';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

import 'dotenv/config';

const app = express();
const PORT = process.env.PORT ?? 5000;

// Configure Multer for audio uploads
const storage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Endpoint to process audio and return transcription
app.post('/transcribe', upload.single('audio'), async (req, res) => {
  const audioPath = req.file.path;

  // Run Whisper on the audio file
  const whisperCommand = `whisper ${audioPath} --model base`;
  exec(whisperCommand, (error, stdout, stderr) => {
    // Cleanup: Delete the uploaded file
    fs.unlinkSync(audioPath);
    
    if (error) {
        console.error(`Error running Whisper: ${error}`, stderr);
        res.status(500).send('Error processing audio');
        return;
    }

    // Send transcription as response
    res.json({ transcription: stdout });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
