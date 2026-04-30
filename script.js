let count = 0;
let lastRepTime = 0;
let isWaiting = false;
let isReady = false; 
let lastProcessTime = 0;
let moveStartTime = 0;
let isMoving = false;
let baseValue = 0;
let lastY = 0;
let lastZ = 0;
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
  const acc = event.acceleration; 
  if (!acc) return;
  let minTime = 600;
  let maxTime = 2500;
  let currentMag = Math.sqrt(acc.x**2 + acc.y**2 + acc.z**2);
  baseValue = baseValue * 0.7 + currentMag * 0.3; 
  updateStatus(`V: ${baseValue.toFixed(2)}`);
  let now = Date.now(); 
  let triggerThreshold = (exerciseSelect.value === 'squats') ? 0.6 : 2.5; 
  if (baseValue > (triggerThreshold * 0.5) && !isMoving) {
    moveStartTime = now;
    isMoving = true;
  }
  if (baseValue > triggerThreshold && !isWaiting) {
    let moveDuration = now - moveStartTime;
    if (moveDuration > minTime && moveDuration < maxTime) {
      count++;
      isWaiting = true;
      lastRepTime = now;
      counterDisplay.innerText = count;
      if (navigator.vibrate) navigator.vibrate(100);
      counterDisplay.classList.add('bump');
      setTimeout(() => counterDisplay.classList.remove('bump'), 150);
      speakCount(count);
      updateStatus(`SUCCESS: ${moveDuration}ms`);
    } else if (moveDuration < minTime) {
      updateStatus(`FAST NOISE: ${moveDuration}ms`);
    }
  }
  if (baseValue < (triggerThreshold * 0.3)) {
    isWaiting = false;
    isMoving = false;
  }
}

function changeExercise(select) {
  count = 0;
  counterDisplay.innerText = count;
  updateStatus(`MODE: ${select.value.toUpperCase()}`);
}

