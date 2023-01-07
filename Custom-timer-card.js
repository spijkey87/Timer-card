class TimerCard extends HTMLElement {
  set hass(hass) {
    this._hass = hass;
  }

  setConfig(config) {
    this._config = config;
  }

  startTimer() {
    this._timeRemaining = this._durationInput.value;
    this._interval = setInterval(() => {
      this._timeRemaining--;
      this._timeRemainingElement.innerHTML = this._timeRemaining;
      if (this._timeRemaining <= 0) {
        this._hass.callService('light', 'turn_off', {
          entity_id: this._config.entity,
        });
        clearInterval(this._interval);
      }
    }, 60000);
  }

  stopTimer() {
    clearInterval(this._interval);
  }

  // Returns an object describing the properites of this element.
  static get properties() {
    return { hass: Object, config: Object };
  }

  // Use the updated() callback to handle changes to element properties.
  updated(changedProperties) {
    if (changedProperties.has('config')) {
      this.stopTimer();
      this.startTimer();
    }
  }

  // Use the render() callback to create and return the component's template.
  render() {
    this._durationInput = document.createElement('input');
    this._durationInput.type = 'number';
    this._durationInput.min = 1;
    this._durationInput.value = this._config.duration;
    this._durationInput.addEventListener('change', () => this.startTimer());

    this._timeRemainingElement = document.createElement('div');
    this._timeRemainingElement.innerHTML = this._durationInput.value;

    return html`
      <style>
        /* voeg hier de stijl voor je kaart toe */
      </style>
      <div>
        <!-- voeg hier de HTML-markup voor je kaart toe -->
        ${this._durationInput}
        ${this._timeRemainingElement}
      </div>
    `;
  }
}

customElements.define('custom-timer-card', TimerCard);
