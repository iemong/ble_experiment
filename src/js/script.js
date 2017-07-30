const SERVICE_UUID = '19b10000-e8f2-537e-4f6c-d104768a1214';
const CHARACTERISTIC_UUID = '19b10001-e8f2-537e-4f6c-d104768a1214';

let ledCharacteristic = null;
const ledButton = document.querySelectorAll('button[data-type="led"]')[0];
const loadButton = document.querySelectorAll('button[data-type="load"]')[0];

const onLED = () => {
    ledCharacteristic.writeValue(new Uint8Array([1]));
};

const offLED = () => {
    ledCharacteristic.writeValue(new Uint8Array([0]));
};

const showLed = () => {
    ledButton.classList.toggle('is-flash');
    if(ledButton.classList.contains('is-flash')) {
        onLED();
    } else {
        offLED();
    }
};

const connectBluetooth = () => {
    navigator.bluetooth.requestDevice({
        acceptAllDevices: true
    }).then(device => {
        console.log('デバイスを検出しました');
        return device.gatt.connect();
    }).then(server => {
        console.log('サービスに接続中');
        return server.getPrimaryService(SERVICE_UUID);
    }).then(service => {
        console.log('キャラクターを取得');
        return service.getCharacteristic(CHARACTERISTIC_UUID);
    }).then(characteristic => {
        console.log("接続完了");
        ledCharacteristic = characteristic;
        ledButton.addEventListener('click', () => {
            showLed();
        });
        ledButton.addEventListener('touchend', () => {
            showLed();
        });
    });
};

loadButton.addEventListener('click', () => {
    connectBluetooth();
});