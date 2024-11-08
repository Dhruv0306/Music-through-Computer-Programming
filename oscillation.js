let audioFile;
let soundFile;
let osc;
let playing = false;

/**
 * Setup function to initialize the application.
 * This function is called once when the application starts.
 */
function setup() {
  noCanvas();

  // Select HTML elements for audio input, frequency slider, trig function select, frequency value display, play button, and stop button
  const audioInput = select('#audioFile');
  const frequencySlider = select('#frequency');
  const trigFunctionSelect = select('#functionSelect');
  const freqValue = select('#freqValue');
  const playBtn = select('#playOscillation');
  const stopBtn = select('#stopOscillation');

  // Initialize oscillator with a default waveform (sine wave)
  osc = new p5.Oscillator('sine');
  osc.amp(0); // Start with no volume
  osc.start();

  // Update frequency display when the frequency slider value changes
  frequencySlider.input(() => {
    freqValue.html(`${frequencySlider.value()} Hz`);
  });

  // Load audio file when selected
  audioInput.changed(() => {
    const file = audioInput.elt.files[0];
    if (file) {
      // Load the selected audio file and log a message when it's loaded
      soundFile = loadSound(URL.createObjectURL(file), () => {
        console.log('Audio file loaded');
      });
    }
  });

  // Play modified audio when the play button is pressed
  playBtn.mousePressed(() => {
    if (soundFile && !playing) {
      soundFile.loop();
      playing = true;
      modulateAudio(); // Apply the oscillation effect
    }
  });

  // Stop audio when the stop button is pressed
  stopBtn.mousePressed(() => {
    if (soundFile && playing) {
      soundFile.stop();
      playing = false;
      osc.amp(0); // Mute oscillator
    }
  });
}

/**
 * Function to modulate the audio file based on the selected trigonometric function.
 * This function is called when the play button is pressed.
 */
function modulateAudio() {
  // Get the selected frequency and trigonometric function
  const freq = parseInt(select('#frequency').value());
  const trigFunc = select('#functionSelect').value();

  // Set the base amplitude of the audio file
  soundFile.amp(0.5);

  // Use a low-pass filter to smooth out sharp oscillations
  const filter = new p5.LowPass();
  soundFile.disconnect(); // Disconnect any previous filters/effects
  soundFile.connect(filter); // Reconnect to the low-pass filter

  // Set the filter frequency based on the user-selected frequency
  filter.freq(freq);
  filter.res(15); // Resonance, controls the sharpness of the filter

  // Use an oscillator to create amplitude modulation based on the trigonometric function
  setInterval(() => {
    if (!playing) return; // Exit if audio is not playing

    // Get the current time in seconds
    const time = millis() / 1000;

    // Initialize the amplitude modulation value
    let ampMod = 0;

    // Apply the selected trigonometric function with limited output range
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