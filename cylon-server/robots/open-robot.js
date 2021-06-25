const cv2 = require('opencv4nodejs-prebuilt')

class OpenRobot {
  constructor() {
    this.frame = null;
    this.Vcap=null;
    this.myInterval=null;
  }

  startWebCam() {
    var self = this;
    const FPS = 100;
    this.Vcap = new cv2.VideoCapture(0);
    this.Vcap.set(cv2.CAP_PROP_BUFFERSIZE, 2)
    this.Vcap.set(cv2.CAP_PROP_FRAME_WIDTH, 300);
    this.Vcap.set(cv2.CAP_PROP_FRAME_HEIGHT, 300);

    try{
      this.myInterval =setInterval(() => {
        const frame = self.Vcap.read();
          if(!frame.empty){
            const image = cv2.imencode('.jpg', frame).toString('base64');
            this.frame = image;
          }   
      }, 10);
    }
    catch(err) {
      console.log(err);
    }
    
  }

  stopWebCam(){
    clearInterval(this.myInterval);
    this.Vcap.release();
    
  }
}

module.exports = new OpenRobot();
