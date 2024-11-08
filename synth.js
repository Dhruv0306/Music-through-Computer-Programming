// Oscillator for sound generation
let osc;
// Flag to track the playing state of the oscillator
let playing = false;

/**
 * Setup function to initialize the oscillator and UI elements.
 * This function is called once when the program starts.
 */
function setup() {
  // Disable the canvas as it's not needed for this example
  noCanvas();
  
  // Initialize the oscillator with a default sine waveform
  // The p5.Oscillator object is used to generate sound waves
  osc = new p5.Oscillator('sine');

  // Select UI elements
  // These elements are used to control the oscillator's frequency and waveform
  const frequencySlider = select('#frequency');
  const ampSineSlider = select('#ampSine');
  const ampCosineSlider = select('#ampCosine');
  const ampTangentSlider = select('#ampTangent');
  const freqValue = select('#freqValue');
  const playBtn = select('#playBtn');
  const stopBtn = select('#stopBtn');

  // Update frequency display when the frequency slider changes
  // This function is called whenever the frequency slider is moved
  frequencySlider.input(() => {
    // Update the frequency value display with the current slider value
    // The frequency value is displayed in Hz
    freqValue.html(`${frequencySlider.value()} Hz`);
  });

  // Play sound button event handler
  // This function is called when the play button is clicked
  playBtn.mousePressed(() => {
    // Check if the oscillator is not already playing
    if (!playing) {
      // Start the oscillator
      // The osc.start() function starts the oscillator and begins generating sound
      osc.start();
      // Update the playing state flag
      playing = true;
    }
  });

  // Stop sound button event handler
  // This function is called when the stop button is clicked
  stopBtn.mousePressed(() => {
    // Check if the oscillator is currently playing
    if (playing) {
      // Stop the oscillator
      // The osc.stop() function stops the oscillator and ceases sound generation
      osc.stop();
      // Update the playing state flag
      playing = false;
    }
  });

  /**
   * Update the oscillator frequency and waveform based on the current slider values.
   * This function is called whenever any of the sliders are moved.
   */
  function updateOscillator() {
    // Get the current slider values
    // These values are used to determine the oscillator's frequency and waveform
    const freq = frequencySlider.value();
    const ampSine = ampSineSlider.value();
    const ampCosine = ampCosineSlider.value();
    const ampTangent = ampTangentSlider.value();

    // Choose the waveform based on the highest amplitude
    // The oscillator's waveform is determined by the highest amplitude slider value
    if (ampSine >= ampCosine && ampSine >= ampTangent) {
      // Set the oscillator to a sine waveform
      // The osc.setType() function sets the oscillator's waveform
      osc.setType('sine');
    } else if (ampCosine >= ampSine && ampCosine >= ampTangent) {
      // Set the oscillator to a cosine waveform
      osc.setType('cosine');
    } else {
      // Approximate a tangent wave using a triangle waveform
      // The tangent waveform is approximated using a triangle waveform
      osc.setType('triangle');
    }
    // Update the oscillator frequency
    // The osc.freq() function sets the oscillator's frequency
    osc.freq(freq);
  }

  // Update the oscillator settings when any of the sliders change
  // This function is called whenever any of the sliders are moved
  frequencySlider.input(updateOscillator);
  ampSineSlider.input(updateOscillator);
  ampCosineSlider.input(updateOscillator);
  ampTangentSlider.input(updateOscillator);
}
