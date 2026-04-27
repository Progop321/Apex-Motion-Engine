<<<<<<< HEAD
let count = 0;
let isWaiting = false;
let isReady = false; 
let threshold = 20; 
let resetLevel = 12;
let lastProcessTime = 0;
const processInterval = 100; 

const counterDisplay = document.getElementById('counter');
const outputDisplay = document.getElementById('output');
const modeDisplay = document.getElementById('current-mode');

function speakCount(text) {
  window.speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text.toString());
  msg.lang = 'en-US';
  msg.rate = 1;
  window.speechSynthesis.speak(msg);
}

document.getElementById('start').onclick = function() {
  count = 0;
  counterDisplay.innerText = count;
  isReady = false; 
  speakCount("System initializing. Put your phone in your pocket.");
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
    speakCount("Ready");
    document.body.style.backgroundColor = "#252222";
    setTimeout(() => {
      document.body.style.backgroundColor = "#050505";
    }, 600);
  }, 5000);
};

function handleMotion(event) {
  if (!isReady) return; 
  let now = Date.now();
  if (now - lastProcessTime < processInterval) return; 
  lastProcessTime = now;
  const acc = event.accelerationIncludingGravity;
  if (!acc) return;
  let x = acc.x || 0;
  let y = acc.y || 0;
  let z = acc.z || 0;
  let magnitude = Math.sqrt(x*x + y*y + z*z) - 9.8;
  if (magnitude < 0) magnitude = 0;
  outputDisplay.innerText = magnitude.toFixed(2);
  if (magnitude >= threshold && !isWaiting) {
    count++;
    isWaiting = true;
    document.body.style.backgroundColor = '#ff0055';
    speakCount(count);
    counterDisplay.innerText = count;
  }
  if (magnitude < resetLevel && isWaiting) {
    isWaiting = false; 
    document.body.style.backgroundColor = "#050505";
  }
}

function changeExercise(selectObject) {
  const value = selectObject.value;
  if (value === "pullups") setMode(25, 12, 'Pull-ups');
  if (value === "pushups") setMode(12, 5, 'Push-ups');
  if (value === "squats") setMode(15, 8, 'Squats');
}

function setMode(newT, newR, name) {
  threshold = newT;
  resetLevel = newR;
  count = 0;
  counterDisplay.innerText = count;
  modeDisplay.innerText = `Mode: ${name}`;
  speakCount(name);
=======
let count = 0;
let isWaiting = false;
let isReady = false; 
let threshold = 20; 
let resetLevel = 12;
let lastProcessTime = 0;
const processInterval = 100; 

const counterDisplay = document.getElementById('counter');
const outputDisplay = document.getElementById('output');
const modeDisplay = document.getElementById('current-mode');

function speakCount(text) {
  window.speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text.toString());
  msg.lang = 'en-US';
  msg.rate = 1;
  window.speechSynthesis.speak(msg);
}

document.getElementById('start').onclick = function() {
  count = 0;
  counterDisplay.innerText = count;
  isReady = false; 
  speakCount("System initializing. Put your phone in your pocket.");
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
    speakCount("Ready");
    document.body.style.backgroundColor = "#252222";
    setTimeout(() => {
      document.body.style.backgroundColor = "#050505";
    }, 600);
  }, 5000);
};

function handleMotion(event) {
  if (!isReady) return; 
  let now = Date.now();
  if (now - lastProcessTime < processInterval) return; 
  lastProcessTime = now;
  const acc = event.accelerationIncludingGravity;
  if (!acc) return;
  let x = acc.x || 0;
  let y = acc.y || 0;
  let z = acc.z || 0;
  let magnitude = Math.sqrt(x*x + y*y + z*z) - 9.8;
  if (magnitude < 0) magnitude = 0;
  outputDisplay.innerText = magnitude.toFixed(2);
  if (magnitude >= threshold && !isWaiting) {
    count++;
    isWaiting = true;
    document.body.style.backgroundColor = '#ff0055';
    speakCount(count);
    counterDisplay.innerText = count;
  }
  if (magnitude < resetLevel && isWaiting) {
    isWaiting = false; 
    document.body.style.backgroundColor = "#050505";
  }
}

function changeExercise(selectObject) {
  const value = selectObject.value;
  if (value === "pullups") setMode(25, 12, 'Pull-ups');
  if (value === "pushups") setMode(12, 7, 'Push-ups');
  if (value === "squats") setMode(15, 8, 'Squats');
}

function setMode(newT, newR, name) {
  threshold = newT;
  resetLevel = newR;
  count = 0;
  counterDisplay.innerText = count;
  modeDisplay.innerText = `Mode: ${name}`;
  speakCount(name);
>>>>>>> 15215b32ab96b793e5cc3e4edd59feaa053643a0
}