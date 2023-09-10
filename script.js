const video = document.getElementById('video')
const unlock = document.getElementById('unlock');

// Start een video stream
const startVideo = () => {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

// Laad de neural networks in voor het herkennen van een gezicht, de gezichtsuitdrukking en de contouren
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)


// Voegt een canvas toe en roept de Face recognition API aan om een gezicht te detecteren.
// Zodra het event play wordt getriggered wordt de code in deze event listener uitgevoerd. 
video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    detectSmile(detections);

  }, 100)
})

// Gebruik deze functie om een lach te detecteren
const detectSmile = (detections) => {
  // Deze functie krijgt een object binnen met de naam detection
  // Hier wordt gecheckt of de gebruiker blij kijkt
  if(detections[0].expressions.happy === 1){
    // Als de gebruiker blij kijkt wordt de code die hier wordt geschreven uitgevoerd.

    // Toon hier de 'verborgen' content!
    // TIP: Zoek op google document.body en probeer de html structuur te vervangen met jouw geheime content!

    
  } 
}