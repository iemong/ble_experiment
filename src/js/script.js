const SERVICE_UUID = '19B10000-E8F2-537E-4F6C-D104768A1214';
const CHARACTERISTIC_UUID = '19B10001-E8F2-537E-4F6C-D104768A1214';

const connectBluetooth = () => {
    navigator.bluetooth.requestDevice({
        filters: [{
            services: [
                SERVICE_UUID
            ]
        }]
    }).then(device => {
        console.log('デバイスを検出しました');
        return device.gatt.connect();
    }).then(server => {
        return server.getPrimaryService(SERVICE_UUID);
    }).then(service => {
        return service.getCharacteristic(CHARACTERISTIC_UUID);
    }).then(caracteristic => {
        console.log("接続完了");
    });
};

window.addEventListener('click', () => {
    connectBluetooth();
});
