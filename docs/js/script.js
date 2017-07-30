(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var SERVICE_UUID = '19B10000-E8F2-537E-4F6C-D104768A1214';
var CHARACTERISTIC_UUID = '19B10001-E8F2-537E-4F6C-D104768A1214';

var connectBluetooth = function connectBluetooth() {
    navigator.bluetooth.requestDevice({
        filters: [{
            services: [SERVICE_UUID]
        }]
    }).then(function (device) {
        console.log('デバイスを検出しました');
        return device.gatt.connect();
    }).then(function (server) {
        return server.getPrimaryService(SERVICE_UUID);
    }).then(function (service) {
        return service.getCharacteristic(CHARACTERISTIC_UUID);
    }).then(function (caracteristic) {
        console.log("接続完了");
    });
};

window.addEventListener('click', function () {
    connectBluetooth();
});

},{}]},{},[1]);
