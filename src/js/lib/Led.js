const FLASH = 'is-flash';

export default class Led{
    constructor(opts = {}) {
        this._ledCharacteristic = opts.ledCharacteristic;
        this._ledButton = document.querySelectorAll('button[data-type="led"]')[0];
        this._initListener();
    }
    _initListener() {
        this._ledButton.addEventListener('click', () => {
            this.showLed();
        });
    }
    onLED() {
        this._ledCharacteristic.writeValue(new Uint8Array([1]));
    }
    offLED() {
        this._ledCharacteristic.writeValue(new Uint8Array([0]));
    }
    showLed() {
        this._ledButton.classList.toggle(FLASH);
        if(this._ledButton.classList.contains(FLASH)) {
            this.onLED();
        } else {
            this.offLED();
        }
    }
}