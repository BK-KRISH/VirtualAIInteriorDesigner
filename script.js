const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const snapshot = document.getElementById("snapshot");
const captureBtn = document.getElementById("captureBtn");
const suggestionList = document.getElementById("suggestionList");

// Start the camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    console.error("Camera error:", err);
    alert("Failed to access the camera");
  });

// Capture the photo
captureBtn.addEventListener("click", async () => {
  const context = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  const imageDataUrl = canvas.toDataURL("image/png");
  snapshot.src = imageDataUrl;

  // Call object detection and generate suggestions
  await detectObjects(canvas);
  generateSuggestions();
});

// Load COCO-SSD Model for Object Detection
async function loadModel() {
  const model = await cocoSsd.load();
  console.log("Model loaded!");
  return model;
}

// Detect objects in the captured image
async function detectObjects(imageElement) {
  const model = await loadModel();
  const predictions = await model.detect(imageElement);
  console.log(predictions); // Log the detected objects

  // Display detected furniture or objects as suggestions (for demo purposes)
  const mockSuggestions = predictions.map(prediction => {
    return `Consider adding a ${prediction.class} in the room.`;
  });

  suggestionList.innerHTML = "";
  mockSuggestions.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    suggestionList.appendChild(li);
  });
}

// Mock AI Suggestion Engine
function generateSuggestions() {
  const mockSuggestions = [
    "Place a cozy reading chair near the window.",
    "Add a modern floor lamp in the left corner.",
    "Hang a minimalist wall painting above the sofa.",
    "Use a round coffee table in the center.",
    "Try a beige rug to warm up the floor."
  ];

  suggestionList.innerHTML = "";
  mockSuggestions.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    suggestionList.appendChild(li);
  });
}
