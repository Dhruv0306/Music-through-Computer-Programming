/**
 * Initializes the canvas and sets up the animation environment.
 * This function is called once when the program starts.
 * It is used to define the initial environment properties such as canvas size, stroke color, and stroke weight.
 */
function setup() {
  /**
   * Creates a canvas element with the specified width and height.
   * The canvas is the drawing surface for the animation.
   * @type {Canvas}
   */
  const canvas = createCanvas(windowWidth, windowHeight);
  /**
   * Sets the parent container for the canvas element.
   * This is the HTML element that will contain the canvas.
   */
  canvas.parent("animation-container");
  /**
   * Sets the stroke color and opacity for the animation.
   * The stroke color is the color of the lines that make up the animation.
   * The opacity is the transparency of the lines, with 0 being fully transparent and 255 being fully opaque.
   */
  stroke(255, 204, 0, 180);
  /**
   * Sets the stroke weight for the animation.
   * The stroke weight is the thickness of the lines that make up the animation.
   */
  strokeWeight(1.5);
  /**
   * Disables filling for the animation.
   * This means that the shapes drawn in the animation will not be filled with color.
   */
  noFill();
}

/**
 * Draws the animation frame by frame.
 * This function is called continuously until the program stops.
 * It is used to update the animation and draw each frame.
 */
function draw() {
  /**
   * Sets the background color for the animation.
   * The background color is the color of the canvas behind the animation.
   */
  background(0, 25);
  /**
   * Defines the wave height for the animation.
   * The wave height is the maximum height of the wave above or below the middle of the canvas.
   * @type {number}
   */
  const waveHeight = 150;
  /**
   * Defines the frequency for the wave animation.
   * The frequency is the number of waves that fit in the canvas.
   * @type {number}
   */
  const frequency = 0.02;
  /**
   * Calculates the speed for the wave animation based on the frame count.
   * The speed is the rate at which the wave moves across the canvas.
   * @type {number}
   */
  const speed = frameCount * 0.02;
  
  /**
   * Begins a new shape for the wave animation.
   * This shape will be used to draw the wave.
   */
  beginShape();
  /**
   * Iterates over the x-axis to draw the wave.
   * The x-axis is the horizontal axis of the canvas.
   */
  for (let x = 0; x < width; x += 10) {
    /**
     * Calculates the y-coordinate for the wave based on the x-coordinate, frequency, and speed.
     * The y-coordinate is the vertical position of the wave at the current x-coordinate.
     * @type {number}
     */
    let y = height / 2 + waveHeight * sin(frequency * (x + speed));
    /**
     * Adds a vertex to the shape at the calculated x and y coordinates.
     * A vertex is a point in the shape.
     */
    vertex(x, y);
  }
  /**
   * Ends the shape for the wave animation.
   * This is necessary to complete the shape and allow it to be drawn.
   */
  endShape();
}

/**
 * Handles window resize events to update the canvas size.
 * This function is called whenever the window is resized.
 * It is used to update the canvas size to match the new window dimensions.
 */
function windowResized() {
  /**
   * Resizes the canvas to match the new window dimensions.
   * This ensures that the canvas always fills the window.
   */
  resizeCanvas(windowWidth, windowHeight);
}
