//index.js
const express = require('express');
const range = require('range-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;
isUsed = 1;
const videoPath = './sample_video.mp4';
const chunkSizeKB = 1024; // 1 KB (adjust as needed)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/video', (req, res) => {
    const range = req.headers.range;
    if (!range) {
      res.status(400).send('Range header is required');
      return;
    }
  if ((isUsed == 1 &&  (range== undefined  || range == "bytes=0-")) || (isUsed==0 && range != "bytes=0-" && range!= undefined  )) {
     isUsed = 0;
      const videoSize = fs.statSync(videoPath).size;
    if (range) {
         const chunkSize = 10 * 1024; // Chunk size in KB (adjust as needed)
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + chunkSize, videoSize - 1);
  
    const contentLength = end - start + 1;
    const headers = {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': 'video/mp4',
    };
  
    res.writeHead(206, headers);
  
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
    }
  }else{
    console.log("Invalid");
    res.status("Invalid");
  }
  });

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
