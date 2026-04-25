let filtereZ = 0;
let count = 0;
let isWaiting = false;
const alpha = 0.2;
const threshold = 45;
const resetLevel = 12;
const counterDisplay = document.getElementById('counter');
const outputDisplay = document.getElementById('output');
const modeDisplay = document.getElementById('current-mode');
function speakCount(number) {
    if(window.speechSynthesis.speaking) return;
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(number.toString());
    msg.lang = 'en-US';
    msg.rate = 1;
    window.speechSynthesis.speak(msg);
  };
document.getElementById('start').onclick = function() {
  speakCount(count);
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
  DeviceMotionEvent.requestPermission()
    .then(state => {
      if (state == 'granted') {
        window.addEventListener('devicemotion', handleMotion);
      }
    });
} else {
  window.addEventListener('devicemotion', handleMotion);
}
};
function handleMotion(event) {
  const acc = event.acceleration;
  if(!acc) return;
  let x = acc.x || 0;
  let y = acc.y || 0;
  let z = acc.z || 0;
  let magnitude = Math.sqrt(x*x + y*y + z*z);
  outputDisplay.innerText = magnitude.toFixed(2);
  if(magnitude >= threshold && !isWaiting) {
    count++;
    isWaiting = true;
    document.body.style.backgroundColor = '#ff0055';
    document.body.style.color = '#000'
    speakCount(count);
    counterDisplay.innerText = count;
    console.log('Движение зафиксировано. Повторов:', count);
  };
  if(magnitude < resetLevel && isWaiting) {
    isWaiting = false; 
    document.body.style.backgroundColor = "#000";
    document.body.style.color = '#fff'
  };
};
function setMode(newT, newR, name) {
  threshold = newT;
  resetLevel = newR;
  count = 0;
  counterDisplay.innerText = count;
  modeDisplay.innerText = `Mode: ${name}`;
}