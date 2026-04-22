let filtereZ = 0;
let count = 0;
let isWaiting = false;
const alpha = 0.2;
const threshold = 15;
const resetLevel = 5;
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
  const acc = event.acceleration;
  if(!acc) return;
  let x = acc.x || 0;
  let y = acc.y || 0;
  let z = acc.z || 0;
  let magnitube = Math.sqrt(x*x + y*y + z*z);
  outputDisplay.innerText = magnitube.toFixed(2);
  if(magnitube >= threshold && !isWaiting) {
    count++;
    isWaiting = true;
    document.body.style.backgroundColor = '#ff0055';
    document.getElementById('counter').innerText = count;
    console.log('Движение зафиксировано. Повторов:', count)
  }
};

