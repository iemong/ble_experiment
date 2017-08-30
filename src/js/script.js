import KowaiMovie from './lib/kowaiMovie';
import Led from './lib/led';

const SERVICE_UUID        = '19b10000-e8f2-537e-4f6c-d104768a1214';
const CHARACTERISTIC_UUID = '19b10001-e8f2-537e-4f6c-d104768a1214';
const THERMOMETER_UUID    = '4fa661d3-66ed-4cd3-99e9-c4f7e3df1d9f';

let ledCharacteristic = null;
let thermoCharacteristic = null;
const loadButton = document.querySelector('button[data-type="load"]');
const graph = document.getElementsByClassName('canvas-graph')[0];
const afterContent = document.getElementsByClassName('js-after-content')[0];
const temperatureText = document.getElementsByClassName('js-temperature-value')[0];
const menuButton = document.getElementsByClassName('js-menu')[0];
const menuContent = document.getElementsByClassName('js-menu-content')[0];
const upButton = document.getElementsByClassName('js-increment')[0];
const downButton = document.getElementsByClassName('js-decrement')[0];
const currentValBox = document.getElementsByClassName('js-currentVal')[0];
let temperatureLimit = 28;

let isHot = false;
const kowaiMovie = new KowaiMovie();
const connectBluetooth = () => {
    navigator.bluetooth.requestDevice({
        filters: [
            {
                services: [
                    SERVICE_UUID
                ]
            }
        ]
    }).then(device => {
        console.log('デバイスを選択しました。接続します。');
        console.log('デバイス名 : ' + device.name);
        console.log('ID : ' + device.id);
        return device.gatt.connect();
    }).then(server => {
        console.log('サービスに接続中');
        return server.getPrimaryService(SERVICE_UUID);
    }).then(service => Promise.all([
        service.getCharacteristic(CHARACTERISTIC_UUID),
        service.getCharacteristic(THERMOMETER_UUID)
    ])).then(characteristic => {
        console.log('接続完了', characteristic);
        ledCharacteristic = characteristic[0];
        thermoCharacteristic = characteristic[1];
        const led = new Led({
            ledCharacteristic: ledCharacteristic
        });
        
        led.showLed();
        let counter = 0;
        setInterval(() => {
            thermoCharacteristic.readValue().then((value) => {
                const fixValue = value.getUint8(0);
                temperatureText.innerHTML = `${fixValue}`;
                if(fixValue >= temperatureLimit) {
                    isHot = true;
                    kowaiMovie.play();
                } else {
                    isHot = false;
                }
            });
            if(counter !== 0) return;
            loadButton.classList.add('is-clicked');
            afterContent.classList.add('is-show');
            counter +=1;
        }, 1000);
    });
};
loadButton.addEventListener('click', () => {
    connectBluetooth();
});
loadButton.addEventListener('touchend', () => {
    connectBluetooth();
});
menuButton.addEventListener('click', () => {
    menuButton.classList.toggle('is-clicked');
    menuContent.classList.toggle('is-clicked');
});

let currentVal = 0;

upButton.addEventListener('click', () => {
    currentVal += 1;
    currentValBox.innerHTML = currentVal;
    temperatureLimit = currentVal;
});
downButton.addEventListener('click', () => {
    currentVal -= 1;
    currentValBox.innerHTML = currentVal;
    temperatureLimit = currentVal;
});
window.addEventListener('load', () => {
    currentVal = Number.parseInt(currentValBox.innerHTML);
});