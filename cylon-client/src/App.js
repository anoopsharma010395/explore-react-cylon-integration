import React, { useState, useEffect} from 'react';
import { Button } from 'react-bootstrap';
import socketIOClient from 'socket.io-client';
import './App.css';
 const ENDPOINT = "http://127.0.0.1:9000"
 
function App() {

  const [imageUrl, setImageUrl] = useState('');
  const [camButtonDisabled, setcamButtonDisabled] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [recorderChunk, setRecorderChunk] = useState([]);

  useEffect(() => {
    try {
      Notification.requestPermission().then(function(result) {
        console.log(result);
      })
      const socket = socketIOClient(ENDPOINT);
      socket.on("frame", (data) => {
        console.log(data)
        if(data) {
          const url = `data:image/jpeg;base64,${data}`
          setImageUrl(url);
        }
      });
    }
    catch(err) {
      console.log(err);
    }
  }, []);
  
  /* Starts the webcam */
  const startWebCam = () => {
    fetch('http://localhost:9000/cylonRoute/startWebCam')
      .then((res) => {
        setcamButtonDisabled(true);
        res.text();
      })
  };

  /* Stops the webcam */
  const stopWebCam = () => {
    fetch('http://localhost:9000/cylonRoute/stopWebCam')
      .then((res) => {
        setcamButtonDisabled(false);
        res.text()
      }
      );
  };

  /* Screen recorder logic starts */
  //var recordedChunks=[];
  

  /* Starts Screen Recording */
  async function startRecording() {
    const displayOptions= 
    {
      video: {
        cursor: "always"
      },
      audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
    }
    const options= { mimeType: "video/webm; codecs=vp9" }
      try {
          const stream =  await navigator.mediaDevices.getDisplayMedia(displayOptions);
          const mediaRecorder = new MediaRecorder(stream, options);
          mediaRecorder.ondataavailable = handleDataAvailable;
          mediaRecorder.start();
          setButtonDisabled(true);
        } catch(err) {
          setButtonDisabled(true);
          console.log(err);
        }
  }

  /* Manages recorded chunks of data */
  function handleDataAvailable(event) {
    let temp = recorderChunk;
    if (event.data.size > 0) {
      temp.push(event.data);
      setRecorderChunk(temp);
      setButtonDisabled(false);
      download();
    }
  }

  /* Download the recorded data */
  function download(){
      var blob = new Blob(recorderChunk, {
      type: "video/mov"
    });

    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    var d = new Date();
    var n = d.toUTCString();
    a.download = n+".mov";
    a.click();
    window.URL.revokeObjectURL(url);
    setRecorderChunk([]);
  }
  /* Screen recorder logic ends */

  return (
    <div className='App'>
      <div className="m-t"><img id="videoImage" alt="video" className="postion-bottom" src={imageUrl} width="300px" height="300px"/></div>
      <div className="m-t">
        <Button variant='primary' onClick={startWebCam} disabled={camButtonDisabled}>
          Start Camera
        </Button>
        <Button variant='success' onClick={startRecording} disabled={buttonDisabled}>
          Start Screen Recording
        </Button>
        <Button variant='primary' onClick={stopWebCam} disabled={!camButtonDisabled}>
          Stop Camera
        </Button>
      </div>
    </div>
  );
}

export default App;
