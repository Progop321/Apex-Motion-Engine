let filtereZ = 0;
const alpha = 0.2;
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
  document.getElementById('output').innerText = `
  Raw: ${rawZ.toFixed(2)}
  Filtered: ${filtereZ.toFixed(2)}
  `;
}