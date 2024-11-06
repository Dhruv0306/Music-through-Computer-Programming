/**
 * Initializes the canvas and sets up the animation environment.
 */
function setup() {
  /**
   * Creates a canvas element with the specified width and height.
   * @type {Canvas}
   */
  const canvas = createCanvas(windowWidth, windowHeight);
  /**
   * Sets the parent container for the canvas element.
   */
  canvas.parent("animation-container");
  /**
   * Sets the stroke color and opacity for the animation.
   */
  stroke(255, 204, 0, 180);
  /**
   * Sets the stroke weight for the animation.
   */
  strokeWeight(1.5);
  /**
   * Disables filling for the animation.
   */
  noFill();
}

/**
 * Draws the animation frame by frame.
 */
function draw() {
  /**
   * Sets the background color for the animation.
   */
  background(0, 25);
  /**
   * Defines the wave height for the animation.
   * @type {number}
   */
  const waveHeight = 150;
  /**
   * Defines the frequency for the wave animation.
   * @type {number}
   */
  const frequency = 0.02;
  /**
   * Calculates the speed for the wave animation based on the frame count.
   * @type {number}
   */
  const speed = frameCount * 0.02;
  
  /**
   * Begins a new shape for the wave animation.
   */
  beginShape();
  /**
   * Iterates over the x-axis to draw the wave.
   */
  for (let x = 0; x < width; x += 10) {
    /**
     * Calculates the y-coordinate for the wave based on the x-coordinate, frequency, and speed.
     * @type {number}
     */
    let y = height / 2 + waveHeight * sin(frequency * (x + speed));
    /**
     * Adds a vertex to the shape at the calculated x and y coordinates.
     */
    vertex(x, y);
  }
  /**
   * Ends the shape for the wave animation.
   */
  endShape();
}

/**
 * Handles window resize events to update the canvas size.
 */
function windowResized() {
  /**
   * Resizes the canvas to match the new window dimensions.
   */
  resizeCanvas(windowWidth, windowHeight);
}