const express = require("express");
const app = express();
const fs = require("fs");
app.use((req, res, next) => {
    console.log('Requested URL:', req.url);
    console.log('Request IP:', req.ip);
    if(req.ip == '::ffff:127.0.0.1') 
    {
        res.status(400);
    }
    console.log('Request from:', req.headers['user-agent']); // Accessing user-agent header
    console.log('Request IP:', req.ip); // Accessing IP address of the requester
    next();
  });
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/video", function (req, res) {
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range header");
    }
    const videoPath = "./sample_video.mp4";
    const videoSize = fs.statSync(videoPath).size;
    // console.log("size of video is:", videoSize);    
    const CHUNK_SIZE = 10 ** 6; //1 MB    
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": 'bytes',
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    }
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
});

app.listen(3000, function () {
    console.log("Server is running on port:", 3000);
});
