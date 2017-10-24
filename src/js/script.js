import {Howl, Howler} from 'howler';

let XAxisCharacteristic = null;
let YAxisCharacteristic = null;
let ZAxisCharacteristic = null;
let ax, ay, az;
const SERVICE_UUID = "a8dd0000-0574-48dd-b570-21b2db19807e";
const XAXIS_UUID = "a8dd0001-0574-48dd-b570-21b2db19807e";
const YAXIS_UUID = "a8dd0002-0574-48dd-b570-21b2db19807e";
const ZAXIS_UUID = "a8dd0003-0574-48dd-b570-21b2db19807e";

let recogCharacteristic = null;
const loadButton = document.querySelector('button[data-type="load"]');
const afterContent = document.getElementsByClassName('js-after-content')[0];
const innerContent = document.getElementsByClassName('js-inner-content')[0];

const speech = new webkitSpeechRecognition();
speech.lang = 'ja';

const sound = new Howl({
    src: ['sound/stop.wav']
});
const yarimasita = new Howl({
    src: ['sound/yarimasita.wav']
});

let voiceFlag = false;

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
        console.log(`デバイス名 : ${  device.name}`);
        console.log(`ID : ${  device.id}`);
        return device.gatt.connect();
    }).then(server => {
        console.log('サービスに接続中');
        return server.getPrimaryService(SERVICE_UUID);
    }).then(service => Promise.all([
        service.getCharacteristic(XAXIS_UUID),
        service.getCharacteristic(YAXIS_UUID),
        service.getCharacteristic(ZAXIS_UUID),
        service.getCharacteristic(RECOGNIZE_UUID)
    ])).then(characteristic => {
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
            if(averageDiff > 0.4) {
                if(!voiceFlag) {
                    speech.start();
                    voiceFlag = true;
                    console.log('start');
                }
            }
        }, 250);
    });
};
loadButton.addEventListener('click', () => {
    connectBluetooth();
});

speech.addEventListener('result', function( e ) {
    console.log("kekka");
    
    const quote = e.results[0][0].transcript;
    if(quote === 'ウィンガーディアムレビオーサ' ){
        innerContent.innerHTML='スカート上がる';
        yarimasita.play();
        return;
    }else if(quote === 'ウィンガーディアムレビオサー' ){
        innerContent.innerHTML='ちがう。あなたのはウィンガーディアムレビオサー';
        sound.play();
        return;
    }else{
        innerContent.innerHTML=quote;
    }
}, false);
