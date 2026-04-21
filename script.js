let filtereZ = 0;
let count = 0;
let isWaiting = false;
const alpha = 0.2;
const pullUp = document.querySelector('#pull-ups');
const outputDisplay = document.getElementById('output');
document.getElementById('start').onclick = function() {
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
  let rawZ = event.acceleration.z || 0;
  filtereZ = (alpha * rawZ) + (1 - alpha) * filtereZ;
  if (filtereZ >= 15 && isWaiting === false) {
    count = Number(count + 1);
    isWaiting = true;
    pullUp.innerText = count;
  }
  if (filtereZ <= 5) {
    isWaiting = false;
  }
  outputDisplay.innerText = `
  Raw: ${rawZ.toFixed(2)}
  Filtered: ${filtereZ.toFixed(2)}
  State: ${count}
  `;
};

