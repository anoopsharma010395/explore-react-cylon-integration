const express = require('express');
const router = express.Router();
const OpenRobot = require('../robots/open-robot');

router.get('/startWebCam', (req, res) => {
  // Initialize and start webcam
  OpenRobot.startWebCam();
  res.send('Camera Started!');
});

router.get('/stopWebCam', (req, res) => {
  // Stop webcam
  OpenRobot.stopWebCam();
  res.send('Camera Stopped!');
});



module.exports = router;
