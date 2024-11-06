// Oscillator for sound generation
let osc;
// Flag to track the playing state of the oscillator
let playing = false;

/**
 * Setup function to initialize the oscillator and UI elements.
 */
function setup() {
  // Disable the canvas as it's not needed for this example
  noCanvas();
  // Initialize the oscillator with a default sine waveform
  osc = new p5.Oscillator('sine');

  // Select UI elements
  const frequencySlider = select('#frequency');
  const ampSineSlider = select('#ampSine');
  const ampCosineSlider = select('#ampCosine');
  const ampTangentSlider = select('#ampTangent');
  const freqValue = select('#freqValue');
  const playBtn = select('#playBtn');
  const stopBtn = select('#stopBtn');

  // Update frequency display when the frequency slider changes
  frequencySlider.input(() => {
    // Update the frequency value display with the current slider value
    freqValue.html(`${frequencySlider.value()} Hz`);
  });

  // Play sound button event handler
  playBtn.mousePressed(() => {
    // Check if the oscillator is not already playing
    if (!playing) {
      // Start the oscillator
      osc.start();
      // Update the playing state flag
      playing = true;
    }
  });

  // Stop sound button event handler
  stopBtn.mousePressed(() => {
    // Check if the oscillator is currently playing
    if (playing) {
      // Stop the oscillator
      osc.stop();
      // Update the playing state flag
      playing = false;
    }
  });

  /**
   * Update the oscillator frequency and waveform based on the current slider values.
   */
  function updateOscillator() {
    // Get the current slider values
    const freq = frequencySlider.value();
    const ampSine = ampSineSlider.value();
    const ampCosine = ampCosineSlider.value();
    const ampTangent = ampTangentSlider.value();

    // Choose the waveform based on the highest amplitude
    if (ampSine >= ampCosine && ampSine >= ampTangent) {
      // Set the oscillator to a sine waveform
      osc.setType('sine');
    } else if (ampCosine >= ampSine && ampCosine >= ampTangent) {
      // Set the oscillator to a cosine waveform
      osc.setType('cosine');
    } else {
      // Approximate a tangent wave using a triangle waveform
      osc.setType('triangle');
    }
    // Update the oscillator frequency
    osc.freq(freq);
  }

  // Update the oscillator settings when any of the sliders change
  frequencySlider.input(updateOscillator);
  ampSineSlider.input(updateOscillator);
  ampCosineSlider.input(updateOscillator);
  ampTangentSlider.input(updateOscillator);
}