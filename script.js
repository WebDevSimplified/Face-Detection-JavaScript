// DOM elements
    const video = document.getElementById('video');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const loadingText = document.getElementById('loading');
    const statsDiv = document.getElementById('stats');
    
    let stream = null;
    let detectionInterval = null;
    let canvas = null;

    // Load models
    async function loadModels() {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models')
        ]);
        
        loadingText.textContent = "Models loaded. Click 'Start Camera' to begin.";
        startBtn.disabled = false;
      } catch (error) {
        loadingText.textContent = "Error loading models. Please check console.";
        console.error(error);
      }
    }

    // Start video stream
    async function startVideo() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        video.srcObject = stream;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        loadingText.style.display = "none";
      } catch (err) {
        loadingText.textContent = "Could not access camera. Please ensure you've granted permissions.";
        console.error(err);
      }
    }

    // Stop video stream
    function stopVideo() {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        stream = null;
        
        if (canvas) {
          canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
          document.body.removeChild(canvas);
          canvas = null;
        }
        
        if (detectionInterval) {
          clearInterval(detectionInterval);
          detectionInterval = null;
        }
        
        startBtn.disabled = false;
        stopBtn.disabled = true;
        statsDiv.textContent = "Camera stopped";
        loadingText.style.display = "block";
        loadingText.textContent = "Click 'Start Camera' to begin again.";
      }
    }

    // Setup face detection when video plays
    video.addEventListener('play', () => {
      if (!canvas) {
        canvas = faceapi.createCanvasFromMedia(video);
        document.querySelector('.container').append(canvas);
      }
      
      const displaySize = { width: video.width, height: video.height };
      faceapi.matchDimensions(canvas, displaySize);
      
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
      
      detectionInterval = setInterval(async () => {
        const detections = await faceapi.detectAllFaces(
          video, 
          new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks().withFaceExpressions();
        
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        
        // Clear canvas before drawing new detections
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw detections
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        
        // Update stats
        updateStats(detections);
      }, 100);
    });

    // Update statistics display
    function updateStats(detections) {
      if (detections.length === 0) {
        statsDiv.textContent = "No faces detected";
        return;
      }
      
      let statsText = `Detected ${detections.length} face${detections.length > 1 ? 's' : ''}:<br>`;
      
      detections.forEach((detection, index) => {
        const expressions = detection.expressions;
        const dominantExpression = Object.entries(expressions).reduce(
          (max, [key, value]) => value > max.value ? {key, value} : max, 
          {key: '', value: 0}
        );
        
        statsText += `<br>Face ${index + 1}:<br>`;
        statsText += `- Dominant expression: ${dominantExpression.key} (${Math.round(dominantExpression.value * 100)}%)<br>`;
        statsText += `- Detection score: ${Math.round(detection.detection.score * 100)}%`;
      });
      
      statsDiv.innerHTML = statsText;
    }

    // Event listeners
    startBtn.addEventListener('click', startVideo);
    stopBtn.addEventListener('click', stopVideo);

    // Initialize
    loadModels();