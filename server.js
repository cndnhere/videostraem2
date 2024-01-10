const express = require('express');
const axios = require('axios');
const ytdl = require('ytdl-core');
const jwt = require('jsonwebtoken');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + "/index.html");
// });
let videoList = [
    {
        videoId: 1,
        path: 'NfA69kfr_Rw'
    },
    {
        videoId: 2,
        path: 'Dc8cJN923U0'

    },
    {
        videoId: 3,
        path: 'jRyf8fhKPJ8'

    }
]
function getVideo(id) {
    return videoList.find(x => x.videoId == id).path;
}

app.get('/stream/:token/:videoId', async (req, res) => {
    let isPlay = 0;
    let objVideoInfo;
    let objInfoUpdate;
    try {

        // First API call
        const response1 = await axios.get('https://video-stream-server-z3gs.onrender.com/api/VideoPlayerInfo/GetByToken/' + req.params.token);
        objVideoInfo = response1.data;

        isPlay = objVideoInfo? objVideoInfo.isPlay:0;
        if (isPlay == 0) {
            let obj = {
                isPlay: 1
            }
            const response2 = await axios.put('https://video-stream-server-z3gs.onrender.com/api/VideoPlayerInfo/Update/' + req.params.token, obj);
            objInfoUpdate = response2.data;
        }

        const range = req.headers.range;
        console.log(range);
        ytdl('https://www.youtube.com/watch?v=79dq08VydIo').pipe(res);



    } catch (error) {
        console.error('Error in nested API calls:', error.message);
    }
});


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
                     let obj = {
                isPlay: 0
            }
        
        }
    });
}

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
