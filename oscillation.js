let audioFile;
let soundFile;
let osc;
let playing = false;

function setup() {
  noCanvas();

  const audioInput = select('#audioFile');
  const frequencySlider = select('#frequency');
  const trigFunctionSelect = select('#functionSelect');
  const freqValue = select('#freqValue');
  const playBtn = select('#playOscillation');
  const stopBtn = select('#stopOscillation');

  // Initialize oscillator with a default waveform
  osc = new p5.Oscillator('sine');
  osc.amp(0); // Start with no volume
  osc.start();

  // Update frequency display
  frequencySlider.input(() => {
    freqValue.html(`${frequencySlider.value()} Hz`);
  });

  // Load audio file when selected
  audioInput.changed(() => {
    const file = audioInput.elt.files[0];
    if (file) {
      soundFile = loadSound(URL.createObjectURL(file), () => {
        console.log('Audio file loaded');
      });
    }
  });

  // Play modified audio
  playBtn.mousePressed(() => {
    if (soundFile && !playing) {
      soundFile.loop();
      playing = true;
      modulateAudio(); // Apply the oscillation effect
    }
  });

  // Stop audio
  stopBtn.mousePressed(() => {
    if (soundFile && playing) {
      soundFile.stop();
      playing = false;
      osc.amp(0); // Mute oscillator
    }
  });
}

// Function to modulate the audio file based on the selected function
function modulateAudio() {
  const freq = parseInt(select('#frequency').value());
  const trigFunc = select('#functionSelect').value();

  soundFile.amp(0.5); // Set base amplitude

  // Use a low-pass filter to smooth out sharp oscillations
  const filter = new p5.LowPass();
  soundFile.disconnect(); // Disconnect any previous filters/effects
  soundFile.connect(filter); // Reconnect to the low-pass filter

  // Set filter frequency based on user-selected frequency (as an example)
  filter.freq(freq);
  filter.res(15); // Resonance, controls the sharpness of the filter

  // Use an oscillator to create amplitude modulation based on the trigonometric function
  setInterval(() => {
    if (!playing) return; // Exit if audio is not playing

    const time = millis() / 1000; // Get time in seconds
    let ampMod = 0;

    // Apply selected trigonometric function with limited output range
    if (trigFunc === 'sin') {
      ampMod = sin(TWO_PI * freq * time);
    } else if (trigFunc === 'cos') {
      ampMod = cos(TWO_PI * freq * time);
    } else if (trigFunc === 'tan') {
      ampMod = tan(TWO_PI * freq * time) * 0.1; // Limit tangent for stability
    } else if (trigFunc === 'combo') {
      ampMod = (sin(TWO_PI * freq * time) + cos(TWO_PI * freq * time)) / 2;
    }

    // Map the amplitude modulation to a smaller, more stable range
    const smoothedAmp = map(ampMod, -1, 1, 0.4, 0.6); // Smooth amplitude modulation range
    soundFile.amp(smoothedAmp, 0.1); // Apply smooth modulation with a short ramp time
  }, 30); // Update every 30ms for smooth modulation
}
