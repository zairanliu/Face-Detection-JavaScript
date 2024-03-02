const video = document.getElementById("video");
const heading = document.getElementById("heading");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  );
}

video.addEventListener("play", () => {
  const displaySize = { width: video.width, height: video.height };
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(
      video,
      new faceapi.TinyFaceDetectorOptions()
    );
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    if (resizedDetections.length < 1) return;
    console.log(resizedDetections[0]._box._x);
    if (resizedDetections[0]._box._x < 280) {
      heading.classList.add("active");
    } else {
      heading.classList.remove("active");
    }
  }, 100);
});
