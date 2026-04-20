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
  let z = event.acceleration.z || 0;
  document.getElementById('output').innerText = z.toFixed(2);
}