(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var SERVICE_UUID = '19b10000-e8f2-537e-4f6c-d104768a1214';
var CHARACTERISTIC_UUID = '19b10001-e8f2-537e-4f6c-d104768a1214';

var ledCharacteristic = null;
var ledButton = document.querySelectorAll('button[data-type="led"]')[0];
var loadButton = document.querySelectorAll('button[data-type="load"]')[0];

var onLED = function onLED() {
    ledCharacteristic.writeValue(new Uint8Array([1]));
};

var offLED = function offLED() {
    ledCharacteristic.writeValue(new Uint8Array([0]));
};

var showLed = function showLed() {
    ledButton.classList.toggle('is-flash');
    if (ledButton.classList.contains('is-flash')) {
        onLED();
    } else {
        offLED();
    }
};

var connectBluetooth = function connectBluetooth() {
    navigator.bluetooth.requestDevice({
        acceptAllDevices: true
    }).then(function (device) {
        console.log('デバイスを検出しました');
        return device.gatt.connect();
    }).then(function (server) {
        console.log('サービスに接続中');
        return server.getPrimaryService(SERVICE_UUID);
    }).then(function (service) {
        console.log('キャラクターを取得');
        return service.getCharacteristic(CHARACTERISTIC_UUID);
    }).then(function (characteristic) {
        console.log("接続完了");
        ledCharacteristic = characteristic;
        ledButton.addEventListener('click', function () {
            showLed();
        });
        ledButton.addEventListener('touchend', function () {
            showLed();
        });
    });
};

loadButton.addEventListener('click', function () {
    connectBluetooth();
});

},{}]},{},[1]);
