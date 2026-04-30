let count = 0;
let isWaiting = false;
let isReady = false; 
let lastProcessTime = 0;
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
  smoothY = smoothY * 0.8 + (acc.y || 0) * 0.2;
  smoothZ = smoothZ * 0.8 + (acc.z || 0) * 0.2;
  let currentVal;
  if (exerciseSelect.value === 'squats') {
    currentVal = Math.sqrt(smoothY * smoothY + smoothZ * smoothZ);
  } else {
    currentVal = (exerciseSelect.value === 'pushups') ? smoothZ : smoothY;
  }
  let delta = currentVal - (exerciseSelect.value === 'squats' ? lastY : lastY); 
  let dynamicThreshold = (exerciseSelect.value === 'squats') ? 0.8 : 2.5;
  if (delta > dynamicThreshold && !isWaiting) {
    count++;
    isWaiting = true;
    counterDisplay.innerText = count; 
    if (navigator.vibrate) navigator.vibrate(100);
    counterDisplay.classList.add('bump');
    setTimeout(() => counterDisplay.classList.remove('bump'), 150);
    updateStatus(`REPS: ${count} (V: ${currentVal.toFixed(1)})`);
    speakCount(count);
  }
  if (delta < -0.2 && isWaiting) {
    isWaiting = false;
  }
  lastY = currentVal; 
}

function changeExercise(select) {
  count = 0;
  counterDisplay.innerText = count;
  updateStatus(`РЕЖИМ: ${select.value.toUpperCase()}`);
}

