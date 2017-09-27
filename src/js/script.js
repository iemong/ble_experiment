import Led from './lib/led';

let XAxisCharacteristic = null;
let YAxisCharacteristic = null;
let ZAxisCharacteristic = null;
let ax, ay, az;
const SERVICE_UUID = "a8dd0000-0574-48dd-b570-21b2db19807e";
const XAXIS_UUID = "a8dd0001-0574-48dd-b570-21b2db19807e";
const YAXIS_UUID = "a8dd0002-0574-48dd-b570-21b2db19807e";
const ZAXIS_UUID = "a8dd0003-0574-48dd-b570-21b2db19807e";

const loadButton = document.querySelector('button[data-type="load"]');
const afterContent = document.getElementsByClassName('js-after-content')[0];
const menuButton = document.getElementsByClassName('js-menu')[0];
const menuContent = document.getElementsByClassName('js-menu-content')[0];
const upButton = document.getElementsByClassName('js-increment')[0];
const downButton = document.getElementsByClassName('js-decrement')[0];
const currentValBox = document.getElementsByClassName('js-currentVal')[0];

const soundButton1 = document.getElementsByClassName('js-sound-button1')[0];
const soundButton2 = document.getElementsByClassName('js-sound-button2')[0];
const soundButton3 = document.getElementsByClassName('js-sound-button3')[0];

const sound1 = new Howl({
    src : ['./data/magic-stick1.mp3']
});
const sound2 = new Howl({
    src : ['./data/punch-middle2.mp3']
});
const sound3 = new Howl({
    src : ['./data/sword-slash1.mp3']
});

let type = 0;

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
        service.getCharacteristic(XAXIS_UUID),
        service.getCharacteristic(YAXIS_UUID),
        service.getCharacteristic(ZAXIS_UUID)
    ])).then(characteristic => {
        loadButton.classList.add('is-clicked');
        afterContent.classList.add('is-show');
        console.log('接続完了', characteristic);
        XAxisCharacteristic = characteristic[0];
        YAxisCharacteristic = characteristic[1];
        ZAxisCharacteristic = characteristic[2];
        
        let prevX = 0;
        let prevY = 0;
        let prevZ = 0;
        let currX = 0;
        let currY = 0;
        let currZ = 0;
        let diffX = 0;
        let diffY = 0;
        let diffZ = 0;

        setInterval(() => {
            XAxisCharacteristic.readValue().then((value) => {
                currX = value.getFloat32(0, true);
                diffX = Math.abs(currX - prevX);
                prevX = currX;
            });
            YAxisCharacteristic.readValue().then((value) => {
                currY = value.getFloat32(0, true);
                diffY = Math.abs(currY - prevY);
                prevY = currY;
            });
            ZAxisCharacteristic.readValue().then((value) => {
                currZ = value.getFloat32(0, true);
                diffZ = Math.abs(currZ - prevZ);
                prevZ = currZ;
            });
            const averageDiff = (diffX + diffY + diffZ) / 3;
            console.log(averageDiff);
            if(averageDiff > 0.4) {
                if(type === 1) {
                    sound1.play();  
                } else if(type === 2) {
                    sound2.play(); 
                } else if(type === 3) {
                    sound3.play(); 
                } else {
                    
                }
            }
        }, 250);
    });
};
loadButton.addEventListener('click', () => {
    connectBluetooth();
});
loadButton.addEventListener('touchend', () => {
    connectBluetooth();
});
soundButton1.addEventListener('click', () => {
    type = 1;
});
soundButton2.addEventListener('click', () => {
    type = 2;
});
soundButton3.addEventListener('click', () => {
    type = 3;
});
