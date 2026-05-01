let count = 0;
let lastRepTime = 0;
let lastVal = 0;
let isMovingDown = false;
let isWaiting = false;
let isReady = false; 
let lastProcessTime = 0;
let moveStartTime = 0;
let isMoving = false;
let baseValue = 0;
let lastY = 0;
let smoothX = 0;
let lastZ = 0;
let lastX = 0;
let smoothY = 0;
let smoothZ = 0;
const processInterval = 100; 

const counterDisplay = document.getElementById('counter');
const outputDisplay = document.getElementById('output');
const modeDisplay = document.getElementById('current-mode');
const statusBar = document.getElementById('status-bar');
const exerciseSelect = document.getElementById('exercise-select');

function speakCount(text) {
  window.speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text.toString());
  msg.lang = 'en-US';
  msg.rate = 1;
  window.speechSynthesis.speak(msg);
}

function updateStatus(msg) {
  if (statusBar) {
    statusBar.innerText = msg;
    statusBar.style.opacity = '0.3';
    setTimeout(() => statusBar.style.opacity = '1', 200);
  }
}

document.getElementById('start').onclick = function() {
  count = 0;
  counterDisplay.innerText = count;
  isReady = false; 
  updateStatus("INITIALIZING SYSTEM...");
  speakCount("System initializing. Put your phone in your pocket.");
  let progress = 0;
  const interval = setInterval(() => {
    progress += 25;
    if (progress <= 100) {
    updateStatus(`INITIALIZING ${progress}%`)
  } else {
    clearInterval(interval)
  }
  }, 1000);
  try {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission()
        .then(state => {
          if (state == 'granted') window.addEventListener('devicemotion', handleMotion);
        });
    } else {
      window.addEventListener('devicemotion', handleMotion);
    }
  } catch (e) { console.log(e); }
  setTimeout(() => {
    isReady = true;
    updateStatus("READY. START YOUR WORKOUT.")
    speakCount("Ready");
    setTimeout(() => {
      document.body.style.backgroundColor = "#dfdede";
    }, 600);
  }, 5000);
};

function handleMotion(event) {
  if (!isReady) return;
  const acc = event.accelerationIncludingGravity; 
  if (!acc) return;

  smoothX = smoothX * 0.8 + (acc.x || 0) * 0.2;
  smoothY = smoothY * 0.8 + (acc.y || 0) * 0.2;
  smoothZ = smoothZ * 0.8 + (acc.z || 0) * 0.2;
  
  let now = Date.now();

  if (exerciseSelect.value === 'squats') {
    if (smoothY < 4.0 && !isWaiting) {
      isMovingDown = true;
      updateStatus("DOWN...");
    }
    if (smoothY > 8.0 && isMovingDown) {
      registerRep();
    }
  } 
  
  else if (exerciseSelect.value === 'pushups') {
    let deltaX = Math.abs(smoothX - lastX);
    updateStatus(`D-X: ${deltaX.toFixed(2)} | X: ${smoothX.toFixed(1)}`);
    if (Math.abs(smoothX) > 3.0 && !isWaiting) {
      isMovingDown = true;
    } 
    if (Math.abs(smoothX) < 3.5 && isMovingDown) {
      registerRep();
    }
    lastX = smoothX;
  }

  else if (exerciseSelect.value === 'pullups') {
    if (smoothZ > 13.0 && !isWaiting) { 
      registerRep();
    }
  }
}

function registerRep() {
  count++;
  isMovingDown = false;
  isWaiting = true; 
  counterDisplay.innerText = count;
  
  if (navigator.vibrate) navigator.vibrate(100);
  counterDisplay.classList.add('bump');
  
  updateStatus(`SUCCESS: ${count}`);
  speakCount(count);

  setTimeout(() => {
    counterDisplay.classList.remove('bump');
    isWaiting = false;
  }, 1000); 
}

// function handleMotion(event) {
//   if (!isReady) return;
//   const acc = event.accelerationIncludingGravity; 
//   if (!acc) return;
//   smoothY = smoothY * 0.8 + (acc.y || 0) * 0.2;
//   updateStatus(`Y: ${smoothY.toFixed(1)}`);
//   let now = Date.now();
//   if (exerciseSelect.value === 'squats') {
//     if (smoothY < 4.0 && !isWaiting) {
//       isMovingDown = true;
//       updateStatus("DOWN...");
//     }
//     if (smoothY > 8.0 && isMovingDown) {
//       count++;
//       isMovingDown = false;
//       isWaiting = true; 
//       counterDisplay.innerText = count;
//       if (navigator.vibrate) navigator.vibrate(100);
//       counterDisplay.classList.add('bump');
//       setTimeout(() => {
//         counterDisplay.classList.remove('bump');
//         isWaiting = false;
//       }, 1000); 
//       speakCount(count);
//       updateStatus(`SUCCESS: ${count}`);
//     }
//   }
// };

function changeExercise(select) {
  count = 0;
  counterDisplay.innerText = count;
  updateStatus(`MODE: ${select.value.toUpperCase()}`);
}

