let count = 0;
let isWaiting = false;
let isReady = false; 
let threshold = 30; 
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
    setTimeout(() => {
        isReady = true;
        speakCount("Ready! Start your workout.");
        document.body.style.backgroundColor = "#00ff41"; 
        setTimeout(() => 
          document.body.style.backgroundColor = "#000",
          document.body.style.color = '#fff',
          600);
    }, 5000);

    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission().then(state => {
            if (state == 'granted') window.addEventListener('devicemotion', handleMotion);
        });
    } else {
        window.addEventListener('devicemotion', handleMotion);
    }
};

function handleMotion(event) {
    if (!isReady) return; 
    let now = Date.now();
    if (now - lastProcessTime < processInterval) return; 
    lastProcessTime = now;
    const acc = event.acceleration || event.accelerationIncludingGravity;
    if (!acc) return;
    let magnitude = Math.sqrt(acc.x**2 + acc.y**2 + acc.z**2);
    outputDisplay.innerText = magnitude.toFixed(2);
    if (magnitude >= threshold && !isWaiting) {
        count++;
        isWaiting = true;
        speakCount(count);
        counterDisplay.innerText = count;
        document.body.style.backgroundColor = '#ff0055'; 
    }
    if (magnitude < resetLevel && isWaiting) {
        isWaiting = false; 
        document.body.style.backgroundColor = "#000";
    }
}

function changeExercise(selectObject) {
    const value = selectObject.value;
    
    if (value === "pullups") {
        setMode(30, 12, 'Pull-ups');
    } else if (value === "pushups") {
        setMode(12.5, 7, 'Push-ups');
    } else if (value === "squats") {
        setMode(15, 9, 'Squats');
    }
}

function setMode(newT, newR, name) {
    threshold = newT;
    resetLevel = newR;
    isReady = false; 
    count = 0;
    counterDisplay.innerText = count;
    modeDisplay.innerText = `Mode: ${name}`;
    speakCount(name);
}