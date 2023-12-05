const express = require('express');
const app = express();
const fs = require('fs');
isUsed = 1;
app.get('/', function (req, res) {
  res.sendFile(__dirname + "/index.html");
});


app.get('/video/:id', function (req, res) {
  console.log(isUsed);
  const range = req.headers.range;
  console.log(range);
  if (!range) {
    res.status(400);
    // res.send('')
  }
  if ((isUsed == 1 &&  (range== undefined  || range == "bytes=0-")) || (isUsed==0 && range != "bytes=0-" && range!= undefined  )) {
    isUsed = 0;
    const videoPath = './sample_video.mp4';
    //const videoPath  = "https://www.youtube.com/watch?v=Z4Jg_eEDEQg";
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
      //res.status({ isContinue: 1 });
    }
  } else {
    console.log("Invalid");
    res.status("Invalid");
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
