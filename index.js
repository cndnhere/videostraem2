const express = require('express');
const axios = require('axios');
const ytdl = require('ytdl-core');
const jwt = require('jsonwebtoken');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get('/stream/:token/:isPlay', (req, res) => {
    try {
        let isPlay = 0;
        axios.get('https://video-stream-server-z3gs.onrender.com/api/VideoPlayerInfo/GetByToken/' + req.params.token).then((resData) => {
            isPlay = resData.data.isPlay;
            const range = req.headers.range;
            console.log(isPlay);
            console.log(range);
            if ((isPlay == 0 && (range == undefined || range == "bytes=0-")) || (isPlay == 1 && range != undefined)) {
                const videoURL = 'https://youtube.com/shorts/NfA69kfr_Rw';
                const stream = ytdl(videoURL, { filter: 'audioandvideo', quality: 'highest' });

                // Create FFmpeg process
                const ffmpegProcess = ffmpeg(stream)
                    .format('mp4')
                    .audioCodec('copy')
                    .videoCodec('copy')
                    .outputOptions('-movflags frag_keyframe+empty_moov')
                    .on('error', (err) => {
                        console.error('Error occurred: ' + err.message);
                    })
                    .on('end', () => {
                        console.log('Streaming ended');
                    });
                ffmpegProcess.pipe(res);
            } else {
                console.log("Invalid");
                res.status("Invalid");
            }
        });

        if (isPlay == 0) {
            let obj = {
                isPlay: 1
            }
            return axios.put('https://video-stream-server-z3gs.onrender.com/api/VideoPlayerInfo/Update/' + req.params.token, obj);
        }
    } catch (err) {
        console.error('Error streaming video:', err);
        res.status(500).send('Error streaming video');
    }
});


// if (isPlay == 0) {
//     let obj = {
//         isPlay: 1
//     }
//     axios.put('https://video-stream-server-2l0a.onrender.com/api/VideoPlayerInfo/Update/' + req.params.token, obj);
// }


function verifyToken(token) {
    // Verify the token
    jwt.verify(token, '12345', async (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                console.log('Token has expired');
                // return decoded;
            } else {
                // console.log('Token verification failed:', err.message);
            }
        } else {
            console.log('Token is valid');
            console.log(decoded);
            // If needed, you can access the decoded information here: decoded.user, decoded.payload, etc.
            let obj = {
                isPlay: 0
            }
            // const apiResponse = await axios.post('https://localhost:3000//VideoPlayerInfo/Update/'+decoded.userId, obj);
            // console.log(apiResponse);

        }
    });
}

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
