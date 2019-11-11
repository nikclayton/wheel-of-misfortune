class Wheel {
  // The different states the wheel can be
  STATE_START = 0;          // Initial state
  STATE_SPINNING = 1;       // Wheel has started spinning
  STATE_START_FADE = 2;     // Wheel has started to fade
  STATE_FADING = 3;         // Wheel is fading
  STATE_PICK_VICTIM = 4;    // Victim is being picked
  STATE_STOPPED = 5;        // Wheel has stopped, victim is displayed

  /**
   * Initialise the wheel.
   *
   * @param {!string} selCanvas CSS selector for the canvas to draw in
   * @param {!string} selImages CSS selector for all images to use
   * @param {!string} selButton CSS selector for the button to start the wheel
   */
  constructor(selCanvas, selImages, selButton) {
    this.canvas = document.querySelector(selCanvas);
    this.ctx = this.canvas.getContext("2d");
    this.state = this.STATE_START;

    this.images = Array.from(document.querySelectorAll(selImages));
    this.button = document.querySelector(selButton);

    this.boundStep = this.step.bind(this);

    this.button.addEventListener("click", () => { this.onClick(); });
    window.addEventListener("resize", () => { this.onResize(); });

    this.onResize();
  }

  /**
   * @returns {number} Return the size to use for the canvas width and height
   */
  get size() {
    return Math.min(window.innerHeight * 0.8, window.innerWidth * 0.8);
  }

  /**
   * @returns {number} Return the wheel's radius
   */
  get radius() {
    return (this.size / 2) * 0.9;
  }

  /**
   * Handle click events on the button. Switch the spinning state, and
   * start a timer to transition to the fade.
   *
   * @param {MouseEvent} event
   */
  onClick(event) {
    this.state = this.STATE_SPINNING;
    window.requestAnimationFrame(this.boundStep);

    window.setTimeout(() => {
      this.state = this.STATE_START_FADE;
    }, 5000);
  }

  /**
   * Handle resize events.
   *
   * @param {UIEvent} event
   */
  onResize(event) {
    this.canvas.width = this.size;
    this.canvas.height = this.size;
    this.ctx.translate(this.size / 2, this.size / 2);
    this.button.style.width = `${this.size}px`;
    window.requestAnimationFrame(this.boundStep);
  }

  /**
   * Set the button's 'disabled' state from the current statemachine
   * state.
   */
  setButtonState() {
    if (this.images.length < 1) {
      this.button.disabled = true;
      return;
    }

    if (this.state === this.STATE_START) {
      this.button.disabled = false;
      return;
    }

    if (this.state === this.STATE_STOPPED) {
      this.button.disabled = false;
      return;
    }

    this.button.disabled = true;
    return;
  }

  /**
   * Clear the canvas.
   */
  clearCanvas() {
    this.ctx.clearRect(
      -(this.size / 2),
      -(this.size / 2),
      this.size,
      this.size
    );
  }

  /**
   * Run the state machine on every animation frame.
   *
   * this.state contains the current state. If a section here changes
   * the state it should call window.requestAnimationFrame to advance
   * to the next state.
   *
   * @param {*} timestamp
   */
  step(timestamp) {
    this.setButtonState();
    const offset = (timestamp / 4) % 360;

    // Display the initial state of the wheel.
    if (this.state === this.STATE_START) {
      this.clearCanvas();
      this.drawTiles(offset);
      return;
    }

    // Wheel is spinning, redraw the wheel at the current offset.
    if (this.state === this.STATE_SPINNING) {
      this.clearCanvas();
      this.drawTiles(offset);
      window.requestAnimationFrame(this.boundStep);
      return;
    }

    // Make sure the wheel has an opacity style so that STATE_FADING
    // can manipulate it later.
    if (this.state === this.STATE_START_FADE) {
      this.canvas.style.opacity = 1;
      this.state = this.STATE_FADING;
      window.requestAnimationFrame(this.boundStep);
      return;
    }

    // Reduce the opacity by 1% on every frame. When the opacity
    // drops to 0 switch to STATE_PICK_VICTIM.
    if (this.state === this.STATE_FADING) {
      this.canvas.style.opacity = this.canvas.style.opacity - 0.01;
      this.clearCanvas();
      this.drawTiles(offset);

      if (this.canvas.style.opacity < 0) {
        this.state = this.STATE_PICK_VICTIM;
      }
      window.requestAnimationFrame(this.boundStep);
      return;
    }

    // Pick a victim. Uncomment line 1 and comment line 2 to pick
    // victims in the same order as the images are listed, otherwise
    // pick a random victim.
    if (this.state === this.STATE_PICK_VICTIM) {
      // const victimIndex = 0;
      const victimIndex = Math.floor(Math.random() * this.images.length);
      this.victimTile = this.images.splice(victimIndex, 1)[0];
      this.state = this.STATE_STOPPED;
      window.requestAnimationFrame(this.boundStep);
      return;
    }

    // Stopped. Draw the victim and reset the opacity.
    if (this.state === this.STATE_STOPPED) {
      this.clearCanvas();
      this.ctx.drawImage(
        this.victimTile,
        -(this.size / 2),
        -(this.size / 2),
        this.size,
        this.size
      );
      this.canvas.style.opacity = 1;
      return;
    }
  }

  /**
   * Draw all the tiles, starting at given offset from 0 degrees.
   *
   * @param {!number} initialOffsetInDegrees
   */
  drawTiles(initialOffsetInDegrees) {
    const radianIncrement = (2 * Math.PI) / this.images.length;
    let radianOffset = initialOffsetInDegrees * ((2 * Math.PI) / 360);

    for (const image of this.images) {
      this.drawTile(radianOffset, this.radius * 0.7, image);
      radianOffset += radianIncrement;
    }
  }

  /**
   * Draw an individual tile.
   *
   * @param {!number} offset Angle offset from 0 (in radians) to draw the image
   * @param {!number} distance Distance to start drawing the image from the center of the wheel
   * @param {!Tile} image Tile to draw
   */
  drawTile(offset, distance, image) {
    this.ctx.save();
    this.ctx.rotate(offset);
    this.ctx.drawImage(
      image,
      -(this.size * 0.075),
      distance,
      this.size * 0.15,
      this.size * 0.15
    );
    this.ctx.restore();
  }
}
