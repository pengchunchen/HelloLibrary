// { "framework": "Vue" }

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(38)
)

/* script */
__vue_exports__ = __webpack_require__(24)

/* template */
var __vue_template__ = __webpack_require__(52)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/xiezijian/Documents/FrontEnd/wisdom-medical-hardware/src/components/HeaderRet.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-27b65b3a"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startConnect = startConnect;
exports.setMonitoringCallback = setMonitoringCallback;
exports.setSuccessCallback = setSuccessCallback;
exports.setFailCallback = setFailCallback;
exports.startMonitor = startMonitor;
exports.stopConnection = stopConnection;
exports.deviceIsConnected = deviceIsConnected;
exports.stopScanning = stopScanning;
exports.whenDeviceDisconnected = whenDeviceDisconnected;

var _weexBluetooth = __webpack_require__(8);

var deviceID = "";
var deviceName = "";
var serviceID = "FFF0";
var notifyCharacteristic = "FFF1";
var writeCharacteristic = "FFF2";
var monitoringCallback;
var successCallback;
var failCallback;

//开始连接
function startConnect(callback) {
  //open bluetooth
  (0, _weexBluetooth.openBluetoothAdapter)().then(function (data) {
    //scan for BLE devices
    var services = [];
    return (0, _weexBluetooth.discoverDevice)(services, function (device) {
      //scan filter
      var deviceName = device['name'];
      var index = deviceName.indexOf("Bluetooth BP");
      if (index != -1) {
        //the device is what we want.
        return true;
      } else {
        return false;
      }
    });
  }).then(function (device) {
    //connect to BLE device
    (0, _weexBluetooth.stopScan)();
    return (0, _weexBluetooth.connectToDevice)(device);
  }).then(function (device) {
    //discover service of BLE device
    deviceID = device['deviceID'];
    deviceName = device['name'];
    return (0, _weexBluetooth.discoverServices)(device, function (service) {
      return service['UUID'] == serviceID;
    });
  }).then(function (data) {
    //discover characteristic of a service
    var deviceID = data['deviceID'];
    var services = data['services'];
    var serviceID = services[0]['UUID'];
    for (var index in services) {
      var serviceID = services[index]['UUID'];
      return (0, _weexBluetooth.discoverCharacteristics)(deviceID, serviceID);
    }
  }).then(function (data) {
    var deviceID = data[0];
    var serviceID = data[1];
    var characteristics = data[2];
    for (var i = 0; i < characteristics.length; i++) {
      var characteristicID = characteristics[i]['UUID'];

      if (characteristicID == "FFF1") {
        //listen to value change of characteristic
        var notCalled = true;
        (0, _weexBluetooth.listenToValueChangeOfCharacteristic)(deviceID, serviceID, characteristicID, function (data) {
          if (data == "10100101") {
            //已经准备好了
            if (notCalled) {
              callback("success");
              notCalled = false;
            }
          }

          //如果是正在测量状态，则返回正在测量的情况
          var detectString = data.substring(0, 24);
          //"B"，表示正在测量过程中
          if (detectString == "111111011111110111111011") {
            //排除长度不为56的错误
            if (data.length < 56) {
              return;
            }
            //计算出正在测量过程中的Pressure值
            var bitString = data.substring(24, 40);
            var pressure = bitStringToInt(bitString);
            //去除不正常值
            if (pressure > 0 && pressure < 400) {
              monitoringCallback(pressure);
            }
          } else if (detectString == "111111011111110111111100") {
            //"C"表示测量结果
            //收缩压
            var sysPressureString = data.substring(24, 32);
            var sysPressure = bitStringToInt(sysPressureString);
            //舒张压
            var diaPressureString = data.substring(32, 40);
            var diaPressure = bitStringToInt(diaPressureString);
            //脉搏
            var heartRateString = data.substring(40, 48);
            var heartRate = bitStringToInt(heartRateString);
            if (!(typeof successCallback == 'undefined')) {
              successCallback([sysPressure, diaPressure, heartRate]);
            }
          } else if (detectString == "111111011111110111111101") {
            //"D"表示测量失败
            failCallback("fail");
          }
        });
      }
    }
  }).catch(function onRejected(error) {
    callback("fail");
  });
}

/**
 * 正在测量时，会持续调用此callback，并返回当前压力值，即血压计上面的数值
 * @param {Function} 如果接收到蓝牙返回的正在测量的压力值，则会调用此callback
 */
function setMonitoringCallback(_monitoringCallback) {
  monitoringCallback = _monitoringCallback;
}

/**
 * 设置得到结果值的callback
 * @param {Function} _successCallback 测量成功后，会多次调用此callback，并返回测量结果，格式为
 * [
 *   收缩压,
 *   舒张压,
 *   心率
 * ]
 */
function setSuccessCallback(_successCallback) {
  successCallback = _successCallback;
}

/**
 * 测量失败时，会调用此callback，并返回字符串("fail")；如果有需要，可以返回失败原因
 * @param {Function} _failCallback [description]
 */
function setFailCallback(_failCallback) {
  failCallback = _failCallback;
}

/**
 * 开始测量
 */
function startMonitor() {
  //开始测试命令
  var value = "FDFDFA050D0A";
  (0, _weexBluetooth.writeToCharacteristic)(deviceID, serviceID, writeCharacteristic, value);
}

/**
 * 断开连接
 * @param  {Function} callback 当断开连接成功时，会调用此callback
 */
function stopConnection(callback) {
  (0, _weexBluetooth.closeConnection)(deviceID).then(function (data) {
    deviceID = "";
    deviceName = "";
    callback();
  });
}

//当前是否有连接上的设备
function deviceIsConnected() {
  return deviceID != "";
}

//停止蓝牙扫描
function stopScanning() {
  (0, _weexBluetooth.stopScan)();
}

function whenDeviceDisconnected(callback) {
  (0, _weexBluetooth.onDeviceDisconnected)(function () {
    deviceID = "";
    callback();
  });
}

function bitStringToInt(bitString) {
  var result = 0;
  var length = bitString.length;
  for (var i = 0; i < bitString.length; i++) {
    var char = bitString[i];
    if (char == '1') {
      result = result + Math.pow(2, length - i - 1);
    }
  }
  return result;
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(40)
)

/* template */
var __vue_template__ = __webpack_require__(54)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/xiezijian/Documents/FrontEnd/wisdom-medical-hardware/src/components/HeaderClo.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-435a5f30"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.host = host;
exports.https = https;
exports.timeAgo = timeAgo;
exports.unescape = unescape;
function host(url) {
  if (!url) return '';
  var host = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  var parts = host.split('.').slice(-3);
  if (parts[0] === 'www') parts.shift();
  return parts.join('.');
}

function https(url) {
  var env = weex.config.env || WXEnvironment;
  if (env.platform === 'iOS' && typeof url === 'string') {
    return url.replace(/^http\:/, 'https:');
  }
  return url;
}

function timeAgo(time) {
  var between = Date.now() / 1000 - Number(time);
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute');
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour');
  } else {
    return pluralize(~~(between / 86400), ' day');
  }
}

function pluralize(time, label) {
  if (time === 1) {
    return time + label;
  }
  return time + label + 's';
}

function unescape(text) {
  var res = text || '';[['<p>', '\n'], ['&amp;', '&'], ['&amp;', '&'], ['&apos;', '\''], ['&#x27;', '\''], ['&#x2F;', '/'], ['&#39;', '\''], ['&#47;', '/'], ['&lt;', '<'], ['&gt;', '>'], ['&nbsp;', ' '], ['&quot;', '"']].forEach(function (pair) {
    res = res.replace(new RegExp(pair[0], 'ig'), pair[1]);
  });

  return res;
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  methods: {
    jump: function jump(to) {
      if (this.$router) {
        this.$router.push(to);
      }
    }
  }
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vueRouter = __webpack_require__(10);

var _vueRouter2 = _interopRequireDefault(_vueRouter);

var _MineDeviceView = __webpack_require__(21);

var _MineDeviceView2 = _interopRequireDefault(_MineDeviceView);

var _AddDeviceView = __webpack_require__(13);

var _AddDeviceView2 = _interopRequireDefault(_AddDeviceView);

var _BloodSugarResultView = __webpack_require__(16);

var _BloodSugarResultView2 = _interopRequireDefault(_BloodSugarResultView);

var _BloodSugarRunView = __webpack_require__(17);

var _BloodSugarRunView2 = _interopRequireDefault(_BloodSugarRunView);

var _BlueToothPreView = __webpack_require__(19);

var _BlueToothPreView2 = _interopRequireDefault(_BlueToothPreView);

var _BlueToothRunView = __webpack_require__(20);

var _BlueToothRunView2 = _interopRequireDefault(_BlueToothRunView);

var _BlueToothErrorView = __webpack_require__(18);

var _BlueToothErrorView2 = _interopRequireDefault(_BlueToothErrorView);

var _BloodPressureResultView = __webpack_require__(14);

var _BloodPressureResultView2 = _interopRequireDefault(_BloodPressureResultView);

var _BloodPressureRunView = __webpack_require__(15);

var _BloodPressureRunView2 = _interopRequireDefault(_BloodPressureRunView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Vue from 'vue'
Vue.use(_vueRouter2.default);

exports.default = new _vueRouter2.default({
  // mode: 'abstract',
  routes: [{ path: '/device-mine', component: _MineDeviceView2.default }, { path: '/device-add', component: _AddDeviceView2.default }, { path: '/blood-sugar-result', component: _BloodSugarResultView2.default }, { path: '/blood-sugar-run', component: _BloodSugarRunView2.default }, { path: '/bluetooth-pre', component: _BlueToothPreView2.default }, { path: '/bluetooth-run', component: _BlueToothRunView2.default }, { path: '/bluetooth-error', component: _BlueToothErrorView2.default }, { path: '/blood-press-result', component: _BloodPressureResultView2.default }, { path: '/blood-press-run', component: _BloodPressureRunView2.default }, { path: '/', redirect: '/device-mine' }]
});

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(43)
)

/* script */
__vue_exports__ = __webpack_require__(22)

/* template */
var __vue_template__ = __webpack_require__(57)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/xiezijian/Documents/FrontEnd/wisdom-medical-hardware/src/App.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-7836c7c9"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _App = __webpack_require__(6);

var _App2 = _interopRequireDefault(_App);

var _router = __webpack_require__(5);

var _router2 = _interopRequireDefault(_router);

var _filters = __webpack_require__(3);

var filters = _interopRequireWildcard(_filters);

var _mixins = __webpack_require__(4);

var _mixins2 = _interopRequireDefault(_mixins);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// register global utility filters.
Object.keys(filters).forEach(function (key) {
  Vue.filter(key, filters[key]);
}

// register global mixins.
);Vue.mixin(_mixins2.default);

new Vue(Vue.util.extend({ el: '#root', router: _router2.default }, _App2.default));

_router2.default.push('/');

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openBluetoothAdapter = openBluetoothAdapter;
exports.discoverDevice = discoverDevice;
exports.connectToDevice = connectToDevice;
exports.stopScan = stopScan;
exports.closeConnection = closeConnection;
exports.discoverServices = discoverServices;
exports.discoverCharacteristics = discoverCharacteristics;
exports.writeToCharacteristic = writeToCharacteristic;
exports.listenToValueChangeOfCharacteristic = listenToValueChangeOfCharacteristic;
exports.onDeviceDisconnected = onDeviceDisconnected;
var wx = weex.requireModule('wx-ble');

/**
 * open the bluetooth adapter. you should first call this function.
 * (For iOS)this will automatically trigger open bluetooth request on iOS.
 * @return {Promise}   promise a new promise that will resolve if bluetooth adapter opens successfully.
 * if open bluetooth succeeds, promise will resolve with a string of "success"
 */
function openBluetoothAdapter() {
  var promise = new Promise(function (resolve, reject) {
    wx.openBluetoothAdapter(function (res) {
      var resultString = res['result'];
      if (resultString == "success") {
        resolve("success");
      } else {
        reject("fail");
      }
    });
  });
  return promise;
}

/**
 * start to discover BLE device.
 * @param  {Array}    services only scan for devices that broadcast(don't means contains) any of the listed services. Null means no limit.
 * @param  {function} filter   add filter to the device based on properties of device, including deviceID and name.
 * The parameter "device" is a dictionary:
 * device = {
 *  'deviceID': (String) UUID(iOS) or Mac(Android) of the bluetooth device
 *  'name': (String) name of the device.
 * }
 * @return {Promise}  promise  a promise that will resolve with a device dictionary if a device satisfying requirements is found.
 * @discuss with limitations of Javascript Promise, only the first device will be returned, following device will be ignored.
 */
function discoverDevice() {
  var services = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (device) {
    return true;
  };

  var promise = new Promise(function (resolve, reject) {
    wx.startBluetoothDevicesDiscoveryWithServices(services, function (device) {
      if (filter(device)) {
        resolve(device);
      }
    });
  });
  return promise;
}

/**
 * connect to a specific device.
 * @param  {Dictionary}  device   The description of the device.
 * @param  {Boolean} stopScan stop scanning new devices.
 * @return {Promise}   a promise that return information of connected device if connection succeeds.
 * device = {
 *  'deviceID': (String) UUID(iOS) or Mac(Android) of the bluetooth device
 *  'name': (String) name of the device.
 * }
 */
function connectToDevice(device) {
  var stopScan = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  //connect to device.
  var deviceID = device['deviceID'];
  var deviceName = device['name'];
  var promise = new Promise(function (resolve, reject) {
    wx.createBLEConnectionWithDeviceID(deviceID, function (res) {
      if (stopScan) {
        wx.stopBluetoothDeviceDiscovery();
      }
      resolve(res['device']);
    });
  });
  return promise;
}

/**
 * stop scan for BLE devices.
 */
function stopScan() {
  wx.stopBluetoothDeviceDiscovery();
}

/**
 * try disconnect from device.
 * @param  {Dictionary} device The description of the device.
 * @return {Promise}        a promise that returns when connection closes successfully.
 * 'deviceID': (String) UUID(iOS) or Mac(Android) of the bluetooth device
 * }
 */
function closeConnection(deviceID) {
  var promise = new Promise(function (resolve, reject) {
    wx.closeBLEConnectionWithDeviceID(deviceID, function (res) {
      resolve(deviceID);
    });
  });
  return promise;
}

/**
 * disconver services of a connected device.
 * @param  {Dictionary} device information of the device.
 * device = {
 *  'deviceID': (String) UUID(iOS) or Mac(Android) of the bluetooth device
 *  'name': (String) name of the device.
 * }
 * @param  {function} filter Only return services that satisfies requirements.
 * service = {
 *  'UUID': (String) UUID of the service.
 *  'isPrimary': (BOOL) whether this service is primary.
 * }
 * @return {Promise}   promise A promise that returns a list of discovered services satisfying requirements.
 * resultDict = {
 *   service,
 *   service,
 *   ...
 * }
 */
function discoverServices(device) {
  var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (service) {
    return true;
  };

  //discover service
  var deviceID = device.deviceID;
  var promise = new Promise(function (resolve, reject) {
    wx.getBLEDeviceServicesWithDeviceID(deviceID, function (services) {
      var resultServices = [];
      for (var i = 0; i < services.length; i++) {
        var service = services[i];
        if (filter(service)) {
          resultServices.push(service);
        }
      }
      var result = { "deviceID": deviceID,
        "services": resultServices };
      resolve(result);
    });
  });
  return promise;
}

/**
 * discover characteristics of a specific service.
 * @param  {String} deviceID  deviceID of the device.
 * @param  {String} serviceID a serviceID of the device.
 * @return {Promise}  A promise that will resolve with a dictionary containing characteristics of the service.
 * resultDict = {
 *   deviceID,
 *   serviceID
 *   characteristics = {
 *     [
 *       'UUID': (String) UUID of the characteristic
 *       'properties': (Dictionary) properties of the characteristic
 *       propertyDict = {
 *           'read': (BOOL) whether the characteristic is readable
 *           'write': (BOOL) whether the characteristic is writable
 *           'notify': (BOOL) whether the characteristic is notifiable
 *           'indicate': (BOOL) whether the characteristic is indicatable
 *      }
 *     ]
 *   }
 * }
 */
function discoverCharacteristics(deviceID, serviceID) {
  var promise = new Promise(function (resolve, reject) {
    wx.getBLEDeviceCharacteristicsWithDeviceID(deviceID, serviceID, function (res) {
      var characteristics = [];
      for (var i = 0; i < res.length; i++) {
        var characteristic = res[i];
        characteristics.push(characteristic);
      }
      resolve([deviceID, serviceID, characteristics]);
    });
  });
  return promise;
}

/**
 * write to a characteristic. the characteristic must be writable
 * @param  {String} deviceID         deviceID of the device.
 * @param  {String} serviceID        serviceID that the characteristic belongs to.
 * @param  {String} characteristicID characteristicID that we want to write to.
 * @param  {String} value            the value that we want to write to characteristic.
 * Since only strings can be transferred, the format of String will be converted to Data based on ASCII code.
 * For example, if you want to write the value {00000101 01000001}, the value should be "5A"
 * note: value must only contains characters from "0" to "9" and from "A" to "F"(must be upper case); length of value must be even
 */
function writeToCharacteristic(deviceID, serviceID, characteristicID, value) {
  var writePromise = new Promise(function (resolve, reject) {
    wx.writeBLECharacteristicValueWithDeviceID(deviceID, serviceID, characteristicID, value, function (res) {
      resolve(res);
    });
  });
}

/**
 * listen to value changes of a characteristic. the characteristic must be notifiable/indicatable
 * @param  {String}   deviceID         deviceID of the device.
 * @param  {String}   serviceID        serviceID that the characteristic belongs to.
 * @param  {String}   characteristicID characteristicID that we want to listen to.
 * @param  {Function} callback         when new value of the characteristic received, callback will be triggered.
 * @return {Promise}  promise          a promise that will not ever resolve.
 */
function listenToValueChangeOfCharacteristic(deviceID, serviceID, characteristicID) {
  var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function (data) {};

  var readPromise = new Promise(function (resolve, reject) {
    wx.notifyBLECharacteristicValueChangeWithDeviceID(deviceID, serviceID, characteristicID, true, function (res) {
      var value = res['value'];
      callback(value);
    });
  });
  return readPromise;
}

function onDeviceDisconnected(callback) {
  wx.onBLEConnectionStateChange(function (res) {
    callback();
  });
}

/***/ }),
/* 9 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(process) {/**
  * vue-router v2.5.3
  * (c) 2017 Evan You
  * @license MIT
  */
/*  */

function assert (condition, message) {
  if (!condition) {
    throw new Error(("[vue-router] " + message))
  }
}

function warn (condition, message) {
  if (process.env.NODE_ENV !== 'production' && !condition) {
    typeof console !== 'undefined' && console.warn(("[vue-router] " + message));
  }
}

var View = {
  name: 'router-view',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render: function render (_, ref) {
    var props = ref.props;
    var children = ref.children;
    var parent = ref.parent;
    var data = ref.data;

    data.routerView = true;

    // directly use parent context's createElement() function
    // so that components rendered by router-view can resolve named slots
    var h = parent.$createElement;
    var name = props.name;
    var route = parent.$route;
    var cache = parent._routerViewCache || (parent._routerViewCache = {});

    // determine current view depth, also check to see if the tree
    // has been toggled inactive but kept-alive.
    var depth = 0;
    var inactive = false;
    while (parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++;
      }
      if (parent._inactive) {
        inactive = true;
      }
      parent = parent.$parent;
    }
    data.routerViewDepth = depth;

    // render previous view if the tree is inactive and kept-alive
    if (inactive) {
      return h(cache[name], data, children)
    }

    var matched = route.matched[depth];
    // render empty node if no matched route
    if (!matched) {
      cache[name] = null;
      return h()
    }

    var component = cache[name] = matched.components[name];

    // attach instance registration hook
    // this will be called in the instance's injected lifecycle hooks
    data.registerRouteInstance = function (vm, val) {
      // val could be undefined for unregistration
      var current = matched.instances[name];
      if (
        (val && current !== vm) ||
        (!val && current === vm)
      ) {
        matched.instances[name] = val;
      }
    }

    // also regiseter instance in prepatch hook
    // in case the same component instance is reused across different routes
    ;(data.hook || (data.hook = {})).prepatch = function (_, vnode) {
      matched.instances[name] = vnode.componentInstance;
    };

    // resolve props
    data.props = resolveProps(route, matched.props && matched.props[name]);

    return h(component, data, children)
  }
};

function resolveProps (route, config) {
  switch (typeof config) {
    case 'undefined':
      return
    case 'object':
      return config
    case 'function':
      return config(route)
    case 'boolean':
      return config ? route.params : undefined
    default:
      if (process.env.NODE_ENV !== 'production') {
        warn(
          false,
          "props in \"" + (route.path) + "\" is a " + (typeof config) + ", " +
          "expecting an object, function or boolean."
        );
      }
  }
}

/*  */

var encodeReserveRE = /[!'()*]/g;
var encodeReserveReplacer = function (c) { return '%' + c.charCodeAt(0).toString(16); };
var commaRE = /%2C/g;

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
var encode = function (str) { return encodeURIComponent(str)
  .replace(encodeReserveRE, encodeReserveReplacer)
  .replace(commaRE, ','); };

var decode = decodeURIComponent;

function resolveQuery (
  query,
  extraQuery,
  _parseQuery
) {
  if ( extraQuery === void 0 ) extraQuery = {};

  var parse = _parseQuery || parseQuery;
  var parsedQuery;
  try {
    parsedQuery = parse(query || '');
  } catch (e) {
    process.env.NODE_ENV !== 'production' && warn(false, e.message);
    parsedQuery = {};
  }
  for (var key in extraQuery) {
    var val = extraQuery[key];
    parsedQuery[key] = Array.isArray(val) ? val.slice() : val;
  }
  return parsedQuery
}

function parseQuery (query) {
  var res = {};

  query = query.trim().replace(/^(\?|#|&)/, '');

  if (!query) {
    return res
  }

  query.split('&').forEach(function (param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = decode(parts.shift());
    var val = parts.length > 0
      ? decode(parts.join('='))
      : null;

    if (res[key] === undefined) {
      res[key] = val;
    } else if (Array.isArray(res[key])) {
      res[key].push(val);
    } else {
      res[key] = [res[key], val];
    }
  });

  return res
}

function stringifyQuery (obj) {
  var res = obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];

    if (val === undefined) {
      return ''
    }

    if (val === null) {
      return encode(key)
    }

    if (Array.isArray(val)) {
      var result = [];
      val.slice().forEach(function (val2) {
        if (val2 === undefined) {
          return
        }
        if (val2 === null) {
          result.push(encode(key));
        } else {
          result.push(encode(key) + '=' + encode(val2));
        }
      });
      return result.join('&')
    }

    return encode(key) + '=' + encode(val)
  }).filter(function (x) { return x.length > 0; }).join('&') : null;
  return res ? ("?" + res) : ''
}

/*  */


var trailingSlashRE = /\/?$/;

function createRoute (
  record,
  location,
  redirectedFrom,
  router
) {
  var stringifyQuery$$1 = router && router.options.stringifyQuery;
  var route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query: location.query || {},
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery$$1),
    matched: record ? formatMatch(record) : []
  };
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery$$1);
  }
  return Object.freeze(route)
}

// the starting route that represents the initial state
var START = createRoute(null, {
  path: '/'
});

function formatMatch (record) {
  var res = [];
  while (record) {
    res.unshift(record);
    record = record.parent;
  }
  return res
}

function getFullPath (
  ref,
  _stringifyQuery
) {
  var path = ref.path;
  var query = ref.query; if ( query === void 0 ) query = {};
  var hash = ref.hash; if ( hash === void 0 ) hash = '';

  var stringify = _stringifyQuery || stringifyQuery;
  return (path || '/') + stringify(query) + hash
}

function isSameRoute (a, b) {
  if (b === START) {
    return a === b
  } else if (!b) {
    return false
  } else if (a.path && b.path) {
    return (
      a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query)
    )
  } else if (a.name && b.name) {
    return (
      a.name === b.name &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query) &&
      isObjectEqual(a.params, b.params)
    )
  } else {
    return false
  }
}

function isObjectEqual (a, b) {
  if ( a === void 0 ) a = {};
  if ( b === void 0 ) b = {};

  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false
  }
  return aKeys.every(function (key) { return String(a[key]) === String(b[key]); })
}

function isIncludedRoute (current, target) {
  return (
    current.path.replace(trailingSlashRE, '/').indexOf(
      target.path.replace(trailingSlashRE, '/')
    ) === 0 &&
    (!target.hash || current.hash === target.hash) &&
    queryIncludes(current.query, target.query)
  )
}

function queryIncludes (current, target) {
  for (var key in target) {
    if (!(key in current)) {
      return false
    }
  }
  return true
}

/*  */

// work around weird flow bug
var toTypes = [String, Object];
var eventTypes = [String, Array];

var Link = {
  name: 'router-link',
  props: {
    to: {
      type: toTypes,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    event: {
      type: eventTypes,
      default: 'click'
    }
  },
  render: function render (h) {
    var this$1 = this;

    var router = this.$router;
    var current = this.$route;
    var ref = router.resolve(this.to, current, this.append);
    var location = ref.location;
    var route = ref.route;
    var href = ref.href;

    var classes = {};
    var globalActiveClass = router.options.linkActiveClass;
    var globalExactActiveClass = router.options.linkExactActiveClass;
    // Support global empty active class
    var activeClassFallback = globalActiveClass == null
            ? 'router-link-active'
            : globalActiveClass;
    var exactActiveClassFallback = globalExactActiveClass == null
            ? 'router-link-exact-active'
            : globalExactActiveClass;
    var activeClass = this.activeClass == null
            ? activeClassFallback
            : this.activeClass;
    var exactActiveClass = this.exactActiveClass == null
            ? exactActiveClassFallback
            : this.exactActiveClass;
    var compareTarget = location.path
      ? createRoute(null, location, null, router)
      : route;

    classes[exactActiveClass] = isSameRoute(current, compareTarget);
    classes[activeClass] = this.exact
      ? classes[exactActiveClass]
      : isIncludedRoute(current, compareTarget);

    var handler = function (e) {
      if (guardEvent(e)) {
        if (this$1.replace) {
          router.replace(location);
        } else {
          router.push(location);
        }
      }
    };

    var on = { click: guardEvent };
    if (Array.isArray(this.event)) {
      this.event.forEach(function (e) { on[e] = handler; });
    } else {
      on[this.event] = handler;
    }

    var data = {
      class: classes
    };

    if (this.tag === 'a') {
      data.on = on;
      data.attrs = { href: href };
    } else {
      // find the first <a> child and apply listener and href
      var a = findAnchor(this.$slots.default);
      if (a) {
        // in case the <a> is a static node
        a.isStatic = false;
        var extend = _Vue.util.extend;
        var aData = a.data = extend({}, a.data);
        aData.on = on;
        var aAttrs = a.data.attrs = extend({}, a.data.attrs);
        aAttrs.href = href;
      } else {
        // doesn't have <a> child, apply listener to self
        data.on = on;
      }
    }

    return h(this.tag, data, this.$slots.default)
  }
};

function guardEvent (e) {
  // don't redirect with control keys
  if (e.metaKey || e.ctrlKey || e.shiftKey) { return }
  // don't redirect when preventDefault called
  if (e.defaultPrevented) { return }
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) { return }
  // don't redirect if `target="_blank"`
  if (e.currentTarget && e.currentTarget.getAttribute) {
    var target = e.currentTarget.getAttribute('target');
    if (/\b_blank\b/i.test(target)) { return }
  }
  // this may be a Weex event which doesn't have this method
  if (e.preventDefault) {
    e.preventDefault();
  }
  return true
}

function findAnchor (children) {
  if (children) {
    var child;
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      if (child.tag === 'a') {
        return child
      }
      if (child.children && (child = findAnchor(child.children))) {
        return child
      }
    }
  }
}

var _Vue;

function install (Vue) {
  if (install.installed) { return }
  install.installed = true;

  _Vue = Vue;

  Object.defineProperty(Vue.prototype, '$router', {
    get: function get () { return this.$root._router }
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get: function get () { return this.$root._route }
  });

  var isDef = function (v) { return v !== undefined; };

  var registerInstance = function (vm, callVal) {
    var i = vm.$options._parentVnode;
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal);
    }
  };

  Vue.mixin({
    beforeCreate: function beforeCreate () {
      if (isDef(this.$options.router)) {
        this._router = this.$options.router;
        this._router.init(this);
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      }
      registerInstance(this, this);
    },
    destroyed: function destroyed () {
      registerInstance(this);
    }
  });

  Vue.component('router-view', View);
  Vue.component('router-link', Link);

  var strats = Vue.config.optionMergeStrategies;
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.created;
}

/*  */

var inBrowser = typeof window !== 'undefined';

/*  */

function resolvePath (
  relative,
  base,
  append
) {
  var firstChar = relative.charAt(0);
  if (firstChar === '/') {
    return relative
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative
  }

  var stack = base.split('/');

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop();
  }

  // resolve relative path
  var segments = relative.replace(/^\//, '').split('/');
  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];
    if (segment === '..') {
      stack.pop();
    } else if (segment !== '.') {
      stack.push(segment);
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('');
  }

  return stack.join('/')
}

function parsePath (path) {
  var hash = '';
  var query = '';

  var hashIndex = path.indexOf('#');
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex);
    path = path.slice(0, hashIndex);
  }

  var queryIndex = path.indexOf('?');
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1);
    path = path.slice(0, queryIndex);
  }

  return {
    path: path,
    query: query,
    hash: hash
  }
}

function cleanPath (path) {
  return path.replace(/\/\//g, '/')
}

var index$1 = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

/**
 * Expose `pathToRegexp`.
 */
var index = pathToRegexp;
var parse_1 = parse;
var compile_1 = compile;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || '/';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue
    }

    var next = str[index];
    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var modifier = res[6];
    var asterisk = res[7];

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var partial = prefix != null && next != null && next !== prefix;
    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var delimiter = res[2] || defaultDelimiter;
    var pattern = capture || group;

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options))
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
    }
  }

  return function (obj, opts) {
    var path = '';
    var data = obj || {};
    var options = opts || {};
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix;
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (index$1(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment;
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys;
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  if (!index$1(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = '(?:' + token.pattern + ')';

      keys.push(token);

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  var delimiter = escapeString(options.delimiter || '/');
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys)
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (!index$1(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (index$1(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}

index.parse = parse_1;
index.compile = compile_1;
index.tokensToFunction = tokensToFunction_1;
index.tokensToRegExp = tokensToRegExp_1;

/*  */

var regexpCompileCache = Object.create(null);

function fillParams (
  path,
  params,
  routeMsg
) {
  try {
    var filler =
      regexpCompileCache[path] ||
      (regexpCompileCache[path] = index.compile(path));
    return filler(params || {}, { pretty: true })
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      warn(false, ("missing param for " + routeMsg + ": " + (e.message)));
    }
    return ''
  }
}

/*  */

function createRouteMap (
  routes,
  oldPathList,
  oldPathMap,
  oldNameMap
) {
  // the path list is used to control path matching priority
  var pathList = oldPathList || [];
  var pathMap = oldPathMap || Object.create(null);
  var nameMap = oldNameMap || Object.create(null);

  routes.forEach(function (route) {
    addRouteRecord(pathList, pathMap, nameMap, route);
  });

  // ensure wildcard routes are always at the end
  for (var i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0]);
      l--;
      i--;
    }
  }

  return {
    pathList: pathList,
    pathMap: pathMap,
    nameMap: nameMap
  }
}

function addRouteRecord (
  pathList,
  pathMap,
  nameMap,
  route,
  parent,
  matchAs
) {
  var path = route.path;
  var name = route.name;
  if (process.env.NODE_ENV !== 'production') {
    assert(path != null, "\"path\" is required in a route configuration.");
    assert(
      typeof route.component !== 'string',
      "route config \"component\" for path: " + (String(path || name)) + " cannot be a " +
      "string id. Use an actual component instead."
    );
  }

  var normalizedPath = normalizePath(path, parent);
  var record = {
    path: normalizedPath,
    regex: compileRouteRegex(normalizedPath),
    components: route.components || { default: route.component },
    instances: {},
    name: name,
    parent: parent,
    matchAs: matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    props: route.props == null
      ? {}
      : route.components
        ? route.props
        : { default: route.props }
  };

  if (route.children) {
    // Warn if route is named and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    if (process.env.NODE_ENV !== 'production') {
      if (route.name && route.children.some(function (child) { return /^\/?$/.test(child.path); })) {
        warn(
          false,
          "Named Route '" + (route.name) + "' has a default child route. " +
          "When navigating to this named route (:to=\"{name: '" + (route.name) + "'\"), " +
          "the default child route will not be rendered. Remove the name from " +
          "this route and use the name of the default child route for named " +
          "links instead."
        );
      }
    }
    route.children.forEach(function (child) {
      var childMatchAs = matchAs
        ? cleanPath((matchAs + "/" + (child.path)))
        : undefined;
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
    });
  }

  if (route.alias !== undefined) {
    if (Array.isArray(route.alias)) {
      route.alias.forEach(function (alias) {
        var aliasRoute = {
          path: alias,
          children: route.children
        };
        addRouteRecord(pathList, pathMap, nameMap, aliasRoute, parent, record.path);
      });
    } else {
      var aliasRoute = {
        path: route.alias,
        children: route.children
      };
      addRouteRecord(pathList, pathMap, nameMap, aliasRoute, parent, record.path);
    }
  }

  if (!pathMap[record.path]) {
    pathList.push(record.path);
    pathMap[record.path] = record;
  }

  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record;
    } else if (process.env.NODE_ENV !== 'production' && !matchAs) {
      warn(
        false,
        "Duplicate named routes definition: " +
        "{ name: \"" + name + "\", path: \"" + (record.path) + "\" }"
      );
    }
  }
}

function compileRouteRegex (path) {
  var regex = index(path);
  if (process.env.NODE_ENV !== 'production') {
    var keys = {};
    regex.keys.forEach(function (key) {
      warn(!keys[key.name], ("Duplicate param keys in route with path: \"" + path + "\""));
      keys[key.name] = true;
    });
  }
  return regex
}

function normalizePath (path, parent) {
  path = path.replace(/\/$/, '');
  if (path[0] === '/') { return path }
  if (parent == null) { return path }
  return cleanPath(((parent.path) + "/" + path))
}

/*  */


function normalizeLocation (
  raw,
  current,
  append,
  router
) {
  var next = typeof raw === 'string' ? { path: raw } : raw;
  // named target
  if (next.name || next._normalized) {
    return next
  }

  // relative params
  if (!next.path && next.params && current) {
    next = assign({}, next);
    next._normalized = true;
    var params = assign(assign({}, current.params), next.params);
    if (current.name) {
      next.name = current.name;
      next.params = params;
    } else if (current.matched) {
      var rawPath = current.matched[current.matched.length - 1].path;
      next.path = fillParams(rawPath, params, ("path " + (current.path)));
    } else if (process.env.NODE_ENV !== 'production') {
      warn(false, "relative params navigation requires a current route.");
    }
    return next
  }

  var parsedPath = parsePath(next.path || '');
  var basePath = (current && current.path) || '/';
  var path = parsedPath.path
    ? resolvePath(parsedPath.path, basePath, append || next.append)
    : basePath;

  var query = resolveQuery(
    parsedPath.query,
    next.query,
    router && router.options.parseQuery
  );

  var hash = next.hash || parsedPath.hash;
  if (hash && hash.charAt(0) !== '#') {
    hash = "#" + hash;
  }

  return {
    _normalized: true,
    path: path,
    query: query,
    hash: hash
  }
}

function assign (a, b) {
  for (var key in b) {
    a[key] = b[key];
  }
  return a
}

/*  */


function createMatcher (
  routes,
  router
) {
  var ref = createRouteMap(routes);
  var pathList = ref.pathList;
  var pathMap = ref.pathMap;
  var nameMap = ref.nameMap;

  function addRoutes (routes) {
    createRouteMap(routes, pathList, pathMap, nameMap);
  }

  function match (
    raw,
    currentRoute,
    redirectedFrom
  ) {
    var location = normalizeLocation(raw, currentRoute, false, router);
    var name = location.name;

    if (name) {
      var record = nameMap[name];
      if (process.env.NODE_ENV !== 'production') {
        warn(record, ("Route with name '" + name + "' does not exist"));
      }
      var paramNames = record.regex.keys
        .filter(function (key) { return !key.optional; })
        .map(function (key) { return key.name; });

      if (typeof location.params !== 'object') {
        location.params = {};
      }

      if (currentRoute && typeof currentRoute.params === 'object') {
        for (var key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key];
          }
        }
      }

      if (record) {
        location.path = fillParams(record.path, location.params, ("named route \"" + name + "\""));
        return _createRoute(record, location, redirectedFrom)
      }
    } else if (location.path) {
      location.params = {};
      for (var i = 0; i < pathList.length; i++) {
        var path = pathList[i];
        var record$1 = pathMap[path];
        if (matchRoute(record$1.regex, location.path, location.params)) {
          return _createRoute(record$1, location, redirectedFrom)
        }
      }
    }
    // no match
    return _createRoute(null, location)
  }

  function redirect (
    record,
    location
  ) {
    var originalRedirect = record.redirect;
    var redirect = typeof originalRedirect === 'function'
        ? originalRedirect(createRoute(record, location, null, router))
        : originalRedirect;

    if (typeof redirect === 'string') {
      redirect = { path: redirect };
    }

    if (!redirect || typeof redirect !== 'object') {
      if (process.env.NODE_ENV !== 'production') {
        warn(
          false, ("invalid redirect option: " + (JSON.stringify(redirect)))
        );
      }
      return _createRoute(null, location)
    }

    var re = redirect;
    var name = re.name;
    var path = re.path;
    var query = location.query;
    var hash = location.hash;
    var params = location.params;
    query = re.hasOwnProperty('query') ? re.query : query;
    hash = re.hasOwnProperty('hash') ? re.hash : hash;
    params = re.hasOwnProperty('params') ? re.params : params;

    if (name) {
      // resolved named direct
      var targetRecord = nameMap[name];
      if (process.env.NODE_ENV !== 'production') {
        assert(targetRecord, ("redirect failed: named route \"" + name + "\" not found."));
      }
      return match({
        _normalized: true,
        name: name,
        query: query,
        hash: hash,
        params: params
      }, undefined, location)
    } else if (path) {
      // 1. resolve relative redirect
      var rawPath = resolveRecordPath(path, record);
      // 2. resolve params
      var resolvedPath = fillParams(rawPath, params, ("redirect route with path \"" + rawPath + "\""));
      // 3. rematch with existing query and hash
      return match({
        _normalized: true,
        path: resolvedPath,
        query: query,
        hash: hash
      }, undefined, location)
    } else {
      if (process.env.NODE_ENV !== 'production') {
        warn(false, ("invalid redirect option: " + (JSON.stringify(redirect))));
      }
      return _createRoute(null, location)
    }
  }

  function alias (
    record,
    location,
    matchAs
  ) {
    var aliasedPath = fillParams(matchAs, location.params, ("aliased route with path \"" + matchAs + "\""));
    var aliasedMatch = match({
      _normalized: true,
      path: aliasedPath
    });
    if (aliasedMatch) {
      var matched = aliasedMatch.matched;
      var aliasedRecord = matched[matched.length - 1];
      location.params = aliasedMatch.params;
      return _createRoute(aliasedRecord, location)
    }
    return _createRoute(null, location)
  }

  function _createRoute (
    record,
    location,
    redirectedFrom
  ) {
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location)
    }
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs)
    }
    return createRoute(record, location, redirectedFrom, router)
  }

  return {
    match: match,
    addRoutes: addRoutes
  }
}

function matchRoute (
  regex,
  path,
  params
) {
  var m = path.match(regex);

  if (!m) {
    return false
  } else if (!params) {
    return true
  }

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = regex.keys[i - 1];
    var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];
    if (key) {
      params[key.name] = val;
    }
  }

  return true
}

function resolveRecordPath (path, record) {
  return resolvePath(path, record.parent ? record.parent.path : '/', true)
}

/*  */


var positionStore = Object.create(null);

function setupScroll () {
  window.addEventListener('popstate', function (e) {
    saveScrollPosition();
    if (e.state && e.state.key) {
      setStateKey(e.state.key);
    }
  });
}

function handleScroll (
  router,
  to,
  from,
  isPop
) {
  if (!router.app) {
    return
  }

  var behavior = router.options.scrollBehavior;
  if (!behavior) {
    return
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof behavior === 'function', "scrollBehavior must be a function");
  }

  // wait until re-render finishes before scrolling
  router.app.$nextTick(function () {
    var position = getScrollPosition();
    var shouldScroll = behavior(to, from, isPop ? position : null);
    if (!shouldScroll) {
      return
    }
    var isObject = typeof shouldScroll === 'object';
    if (isObject && typeof shouldScroll.selector === 'string') {
      var el = document.querySelector(shouldScroll.selector);
      if (el) {
        position = getElementPosition(el);
      } else if (isValidPosition(shouldScroll)) {
        position = normalizePosition(shouldScroll);
      }
    } else if (isObject && isValidPosition(shouldScroll)) {
      position = normalizePosition(shouldScroll);
    }

    if (position) {
      window.scrollTo(position.x, position.y);
    }
  });
}

function saveScrollPosition () {
  var key = getStateKey();
  if (key) {
    positionStore[key] = {
      x: window.pageXOffset,
      y: window.pageYOffset
    };
  }
}

function getScrollPosition () {
  var key = getStateKey();
  if (key) {
    return positionStore[key]
  }
}

function getElementPosition (el) {
  var docEl = document.documentElement;
  var docRect = docEl.getBoundingClientRect();
  var elRect = el.getBoundingClientRect();
  return {
    x: elRect.left - docRect.left,
    y: elRect.top - docRect.top
  }
}

function isValidPosition (obj) {
  return isNumber(obj.x) || isNumber(obj.y)
}

function normalizePosition (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
    y: isNumber(obj.y) ? obj.y : window.pageYOffset
  }
}

function isNumber (v) {
  return typeof v === 'number'
}

/*  */

var supportsPushState = inBrowser && (function () {
  var ua = window.navigator.userAgent;

  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  ) {
    return false
  }

  return window.history && 'pushState' in window.history
})();

// use User Timing api (if present) for more accurate key precision
var Time = inBrowser && window.performance && window.performance.now
  ? window.performance
  : Date;

var _key = genKey();

function genKey () {
  return Time.now().toFixed(3)
}

function getStateKey () {
  return _key
}

function setStateKey (key) {
  _key = key;
}

function pushState (url, replace) {
  saveScrollPosition();
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  var history = window.history;
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url);
    } else {
      _key = genKey();
      history.pushState({ key: _key }, '', url);
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url);
  }
}

function replaceState (url) {
  pushState(url, true);
}

/*  */

function runQueue (queue, fn, cb) {
  var step = function (index) {
    if (index >= queue.length) {
      cb();
    } else {
      if (queue[index]) {
        fn(queue[index], function () {
          step(index + 1);
        });
      } else {
        step(index + 1);
      }
    }
  };
  step(0);
}

/*  */

var History = function History (router, base) {
  this.router = router;
  this.base = normalizeBase(base);
  // start with a route object that stands for "nowhere"
  this.current = START;
  this.pending = null;
  this.ready = false;
  this.readyCbs = [];
  this.readyErrorCbs = [];
  this.errorCbs = [];
};

History.prototype.listen = function listen (cb) {
  this.cb = cb;
};

History.prototype.onReady = function onReady (cb, errorCb) {
  if (this.ready) {
    cb();
  } else {
    this.readyCbs.push(cb);
    if (errorCb) {
      this.readyErrorCbs.push(errorCb);
    }
  }
};

History.prototype.onError = function onError (errorCb) {
  this.errorCbs.push(errorCb);
};

History.prototype.transitionTo = function transitionTo (location, onComplete, onAbort) {
    var this$1 = this;

  var route = this.router.match(location, this.current);
  this.confirmTransition(route, function () {
    this$1.updateRoute(route);
    onComplete && onComplete(route);
    this$1.ensureURL();

    // fire ready cbs once
    if (!this$1.ready) {
      this$1.ready = true;
      this$1.readyCbs.forEach(function (cb) { cb(route); });
    }
  }, function (err) {
    if (onAbort) {
      onAbort(err);
    }
    if (err && !this$1.ready) {
      this$1.ready = true;
      this$1.readyErrorCbs.forEach(function (cb) { cb(err); });
    }
  });
};

History.prototype.confirmTransition = function confirmTransition (route, onComplete, onAbort) {
    var this$1 = this;

  var current = this.current;
  var abort = function (err) {
    if (isError(err)) {
      if (this$1.errorCbs.length) {
        this$1.errorCbs.forEach(function (cb) { cb(err); });
      } else {
        warn(false, 'uncaught error during route navigation:');
        console.error(err);
      }
    }
    onAbort && onAbort(err);
  };
  if (
    isSameRoute(route, current) &&
    // in the case the route map has been dynamically appended to
    route.matched.length === current.matched.length
  ) {
    this.ensureURL();
    return abort()
  }

  var ref = resolveQueue(this.current.matched, route.matched);
    var updated = ref.updated;
    var deactivated = ref.deactivated;
    var activated = ref.activated;

  var queue = [].concat(
    // in-component leave guards
    extractLeaveGuards(deactivated),
    // global before hooks
    this.router.beforeHooks,
    // in-component update hooks
    extractUpdateHooks(updated),
    // in-config enter guards
    activated.map(function (m) { return m.beforeEnter; }),
    // async components
    resolveAsyncComponents(activated)
  );

  this.pending = route;
  var iterator = function (hook, next) {
    if (this$1.pending !== route) {
      return abort()
    }
    try {
      hook(route, current, function (to) {
        if (to === false || isError(to)) {
          // next(false) -> abort navigation, ensure current URL
          this$1.ensureURL(true);
          abort(to);
        } else if (
          typeof to === 'string' ||
          (typeof to === 'object' && (
            typeof to.path === 'string' ||
            typeof to.name === 'string'
          ))
        ) {
          // next('/') or next({ path: '/' }) -> redirect
          abort();
          if (typeof to === 'object' && to.replace) {
            this$1.replace(to);
          } else {
            this$1.push(to);
          }
        } else {
          // confirm transition and pass on the value
          next(to);
        }
      });
    } catch (e) {
      abort(e);
    }
  };

  runQueue(queue, iterator, function () {
    var postEnterCbs = [];
    var isValid = function () { return this$1.current === route; };
    // wait until async components are resolved before
    // extracting in-component enter guards
    var enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
    var queue = enterGuards.concat(this$1.router.resolveHooks);
    runQueue(queue, iterator, function () {
      if (this$1.pending !== route) {
        return abort()
      }
      this$1.pending = null;
      onComplete(route);
      if (this$1.router.app) {
        this$1.router.app.$nextTick(function () {
          postEnterCbs.forEach(function (cb) { cb(); });
        });
      }
    });
  });
};

History.prototype.updateRoute = function updateRoute (route) {
  var prev = this.current;
  this.current = route;
  this.cb && this.cb(route);
  this.router.afterHooks.forEach(function (hook) {
    hook && hook(route, prev);
  });
};

function normalizeBase (base) {
  if (!base) {
    if (inBrowser) {
      // respect <base> tag
      var baseEl = document.querySelector('base');
      base = (baseEl && baseEl.getAttribute('href')) || '/';
    } else {
      base = '/';
    }
  }
  // make sure there's the starting slash
  if (base.charAt(0) !== '/') {
    base = '/' + base;
  }
  // remove trailing slash
  return base.replace(/\/$/, '')
}

function resolveQueue (
  current,
  next
) {
  var i;
  var max = Math.max(current.length, next.length);
  for (i = 0; i < max; i++) {
    if (current[i] !== next[i]) {
      break
    }
  }
  return {
    updated: next.slice(0, i),
    activated: next.slice(i),
    deactivated: current.slice(i)
  }
}

function extractGuards (
  records,
  name,
  bind,
  reverse
) {
  var guards = flatMapComponents(records, function (def, instance, match, key) {
    var guard = extractGuard(def, name);
    if (guard) {
      return Array.isArray(guard)
        ? guard.map(function (guard) { return bind(guard, instance, match, key); })
        : bind(guard, instance, match, key)
    }
  });
  return flatten(reverse ? guards.reverse() : guards)
}

function extractGuard (
  def,
  key
) {
  if (typeof def !== 'function') {
    // extend now so that global mixins are applied.
    def = _Vue.extend(def);
  }
  return def.options[key]
}

function extractLeaveGuards (deactivated) {
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
}

function extractUpdateHooks (updated) {
  return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
}

function bindGuard (guard, instance) {
  if (instance) {
    return function boundRouteGuard () {
      return guard.apply(instance, arguments)
    }
  }
}

function extractEnterGuards (
  activated,
  cbs,
  isValid
) {
  return extractGuards(activated, 'beforeRouteEnter', function (guard, _, match, key) {
    return bindEnterGuard(guard, match, key, cbs, isValid)
  })
}

function bindEnterGuard (
  guard,
  match,
  key,
  cbs,
  isValid
) {
  return function routeEnterGuard (to, from, next) {
    return guard(to, from, function (cb) {
      next(cb);
      if (typeof cb === 'function') {
        cbs.push(function () {
          // #750
          // if a router-view is wrapped with an out-in transition,
          // the instance may not have been registered at this time.
          // we will need to poll for registration until current route
          // is no longer valid.
          poll(cb, match.instances, key, isValid);
        });
      }
    })
  }
}

function poll (
  cb, // somehow flow cannot infer this is a function
  instances,
  key,
  isValid
) {
  if (instances[key]) {
    cb(instances[key]);
  } else if (isValid()) {
    setTimeout(function () {
      poll(cb, instances, key, isValid);
    }, 16);
  }
}

function resolveAsyncComponents (matched) {
  return function (to, from, next) {
    var hasAsync = false;
    var pending = 0;
    var error = null;

    flatMapComponents(matched, function (def, _, match, key) {
      // if it's a function and doesn't have cid attached,
      // assume it's an async component resolve function.
      // we are not using Vue's default async resolving mechanism because
      // we want to halt the navigation until the incoming component has been
      // resolved.
      if (typeof def === 'function' && def.cid === undefined) {
        hasAsync = true;
        pending++;

        var resolve = once(function (resolvedDef) {
          // save resolved on async factory in case it's used elsewhere
          def.resolved = typeof resolvedDef === 'function'
            ? resolvedDef
            : _Vue.extend(resolvedDef);
          match.components[key] = resolvedDef;
          pending--;
          if (pending <= 0) {
            next();
          }
        });

        var reject = once(function (reason) {
          var msg = "Failed to resolve async component " + key + ": " + reason;
          process.env.NODE_ENV !== 'production' && warn(false, msg);
          if (!error) {
            error = isError(reason)
              ? reason
              : new Error(msg);
            next(error);
          }
        });

        var res;
        try {
          res = def(resolve, reject);
        } catch (e) {
          reject(e);
        }
        if (res) {
          if (typeof res.then === 'function') {
            res.then(resolve, reject);
          } else {
            // new syntax in Vue 2.3
            var comp = res.component;
            if (comp && typeof comp.then === 'function') {
              comp.then(resolve, reject);
            }
          }
        }
      }
    });

    if (!hasAsync) { next(); }
  }
}

function flatMapComponents (
  matched,
  fn
) {
  return flatten(matched.map(function (m) {
    return Object.keys(m.components).map(function (key) { return fn(
      m.components[key],
      m.instances[key],
      m, key
    ); })
  }))
}

function flatten (arr) {
  return Array.prototype.concat.apply([], arr)
}

// in Webpack 2, require.ensure now also returns a Promise
// so the resolve/reject functions may get called an extra time
// if the user uses an arrow function shorthand that happens to
// return that Promise.
function once (fn) {
  var called = false;
  return function () {
    if (called) { return }
    called = true;
    return fn.apply(this, arguments)
  }
}

function isError (err) {
  return Object.prototype.toString.call(err).indexOf('Error') > -1
}

/*  */


var HTML5History = (function (History$$1) {
  function HTML5History (router, base) {
    var this$1 = this;

    History$$1.call(this, router, base);

    var expectScroll = router.options.scrollBehavior;

    if (expectScroll) {
      setupScroll();
    }

    window.addEventListener('popstate', function (e) {
      this$1.transitionTo(getLocation(this$1.base), function (route) {
        if (expectScroll) {
          handleScroll(router, route, this$1.current, true);
        }
      });
    });
  }

  if ( History$$1 ) HTML5History.__proto__ = History$$1;
  HTML5History.prototype = Object.create( History$$1 && History$$1.prototype );
  HTML5History.prototype.constructor = HTML5History;

  HTML5History.prototype.go = function go (n) {
    window.history.go(n);
  };

  HTML5History.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.ensureURL = function ensureURL (push) {
    if (getLocation(this.base) !== this.current.fullPath) {
      var current = cleanPath(this.base + this.current.fullPath);
      push ? pushState(current) : replaceState(current);
    }
  };

  HTML5History.prototype.getCurrentLocation = function getCurrentLocation () {
    return getLocation(this.base)
  };

  return HTML5History;
}(History));

function getLocation (base) {
  var path = window.location.pathname;
  if (base && path.indexOf(base) === 0) {
    path = path.slice(base.length);
  }
  return (path || '/') + window.location.search + window.location.hash
}

/*  */


var HashHistory = (function (History$$1) {
  function HashHistory (router, base, fallback) {
    History$$1.call(this, router, base);
    // check history fallback deeplinking
    if (fallback && checkFallback(this.base)) {
      return
    }
    ensureSlash();
  }

  if ( History$$1 ) HashHistory.__proto__ = History$$1;
  HashHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  HashHistory.prototype.constructor = HashHistory;

  // this is delayed until the app mounts
  // to avoid the hashchange listener being fired too early
  HashHistory.prototype.setupListeners = function setupListeners () {
    var this$1 = this;

    window.addEventListener('hashchange', function () {
      if (!ensureSlash()) {
        return
      }
      this$1.transitionTo(getHash(), function (route) {
        replaceHash(route.fullPath);
      });
    });
  };

  HashHistory.prototype.push = function push (location, onComplete, onAbort) {
    this.transitionTo(location, function (route) {
      pushHash(route.fullPath);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    this.transitionTo(location, function (route) {
      replaceHash(route.fullPath);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.go = function go (n) {
    window.history.go(n);
  };

  HashHistory.prototype.ensureURL = function ensureURL (push) {
    var current = this.current.fullPath;
    if (getHash() !== current) {
      push ? pushHash(current) : replaceHash(current);
    }
  };

  HashHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    return getHash()
  };

  return HashHistory;
}(History));

function checkFallback (base) {
  var location = getLocation(base);
  if (!/^\/#/.test(location)) {
    window.location.replace(
      cleanPath(base + '/#' + location)
    );
    return true
  }
}

function ensureSlash () {
  var path = getHash();
  if (path.charAt(0) === '/') {
    return true
  }
  replaceHash('/' + path);
  return false
}

function getHash () {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var index = href.indexOf('#');
  return index === -1 ? '' : href.slice(index + 1)
}

function pushHash (path) {
  window.location.hash = path;
}

function replaceHash (path) {
  var i = window.location.href.indexOf('#');
  window.location.replace(
    window.location.href.slice(0, i >= 0 ? i : 0) + '#' + path
  );
}

/*  */


var AbstractHistory = (function (History$$1) {
  function AbstractHistory (router, base) {
    History$$1.call(this, router, base);
    this.stack = [];
    this.index = -1;
  }

  if ( History$$1 ) AbstractHistory.__proto__ = History$$1;
  AbstractHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  AbstractHistory.prototype.constructor = AbstractHistory;

  AbstractHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index + 1).concat(route);
      this$1.index++;
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index).concat(route);
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.go = function go (n) {
    var this$1 = this;

    var targetIndex = this.index + n;
    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return
    }
    var route = this.stack[targetIndex];
    this.confirmTransition(route, function () {
      this$1.index = targetIndex;
      this$1.updateRoute(route);
    });
  };

  AbstractHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    var current = this.stack[this.stack.length - 1];
    return current ? current.fullPath : '/'
  };

  AbstractHistory.prototype.ensureURL = function ensureURL () {
    // noop
  };

  return AbstractHistory;
}(History));

/*  */

var VueRouter = function VueRouter (options) {
  if ( options === void 0 ) options = {};

  this.app = null;
  this.apps = [];
  this.options = options;
  this.beforeHooks = [];
  this.resolveHooks = [];
  this.afterHooks = [];
  this.matcher = createMatcher(options.routes || [], this);

  var mode = options.mode || 'hash';
  this.fallback = mode === 'history' && !supportsPushState;
  if (this.fallback) {
    mode = 'hash';
  }
  if (!inBrowser) {
    mode = 'abstract';
  }
  this.mode = mode;

  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base);
      break
    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback);
      break
    case 'abstract':
      this.history = new AbstractHistory(this, options.base);
      break
    default:
      if (process.env.NODE_ENV !== 'production') {
        assert(false, ("invalid mode: " + mode));
      }
  }
};

var prototypeAccessors = { currentRoute: {} };

VueRouter.prototype.match = function match (
  raw,
  current,
  redirectedFrom
) {
  return this.matcher.match(raw, current, redirectedFrom)
};

prototypeAccessors.currentRoute.get = function () {
  return this.history && this.history.current
};

VueRouter.prototype.init = function init (app /* Vue component instance */) {
    var this$1 = this;

  process.env.NODE_ENV !== 'production' && assert(
    install.installed,
    "not installed. Make sure to call `Vue.use(VueRouter)` " +
    "before creating root instance."
  );

  this.apps.push(app);

  // main app already initialized.
  if (this.app) {
    return
  }

  this.app = app;

  var history = this.history;

  if (history instanceof HTML5History) {
    history.transitionTo(history.getCurrentLocation());
  } else if (history instanceof HashHistory) {
    var setupHashListener = function () {
      history.setupListeners();
    };
    history.transitionTo(
      history.getCurrentLocation(),
      setupHashListener,
      setupHashListener
    );
  }

  history.listen(function (route) {
    this$1.apps.forEach(function (app) {
      app._route = route;
    });
  });
};

VueRouter.prototype.beforeEach = function beforeEach (fn) {
  return registerHook(this.beforeHooks, fn)
};

VueRouter.prototype.beforeResolve = function beforeResolve (fn) {
  return registerHook(this.resolveHooks, fn)
};

VueRouter.prototype.afterEach = function afterEach (fn) {
  return registerHook(this.afterHooks, fn)
};

VueRouter.prototype.onReady = function onReady (cb, errorCb) {
  this.history.onReady(cb, errorCb);
};

VueRouter.prototype.onError = function onError (errorCb) {
  this.history.onError(errorCb);
};

VueRouter.prototype.push = function push (location, onComplete, onAbort) {
  this.history.push(location, onComplete, onAbort);
};

VueRouter.prototype.replace = function replace (location, onComplete, onAbort) {
  this.history.replace(location, onComplete, onAbort);
};

VueRouter.prototype.go = function go (n) {
  this.history.go(n);
};

VueRouter.prototype.back = function back () {
  this.go(-1);
};

VueRouter.prototype.forward = function forward () {
  this.go(1);
};

VueRouter.prototype.getMatchedComponents = function getMatchedComponents (to) {
  var route = to
    ? to.matched
      ? to
      : this.resolve(to).route
    : this.currentRoute;
  if (!route) {
    return []
  }
  return [].concat.apply([], route.matched.map(function (m) {
    return Object.keys(m.components).map(function (key) {
      return m.components[key]
    })
  }))
};

VueRouter.prototype.resolve = function resolve (
  to,
  current,
  append
) {
  var location = normalizeLocation(
    to,
    current || this.history.current,
    append,
    this
  );
  var route = this.match(location, current);
  var fullPath = route.redirectedFrom || route.fullPath;
  var base = this.history.base;
  var href = createHref(base, fullPath, this.mode);
  return {
    location: location,
    route: route,
    href: href,
    // for backwards compat
    normalizedTo: location,
    resolved: route
  }
};

VueRouter.prototype.addRoutes = function addRoutes (routes) {
  this.matcher.addRoutes(routes);
  if (this.history.current !== START) {
    this.history.transitionTo(this.history.getCurrentLocation());
  }
};

Object.defineProperties( VueRouter.prototype, prototypeAccessors );

function registerHook (list, fn) {
  list.push(fn);
  return function () {
    var i = list.indexOf(fn);
    if (i > -1) { list.splice(i, 1); }
  }
}

function createHref (base, fullPath, mode) {
  var path = mode === 'hash' ? '#' + fullPath : fullPath;
  return base ? cleanPath(base + '/' + path) : path
}

VueRouter.install = install;
VueRouter.version = '2.5.3';

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter);
}

/* harmony default export */ __webpack_exports__["default"] = (VueRouter);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(9)))

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(39)
)

/* script */
__vue_exports__ = __webpack_require__(23)

/* template */
var __vue_template__ = __webpack_require__(53)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/xiezijian/Documents/FrontEnd/wisdom-medical-hardware/src/components/HeaderNor.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-29802c93"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(36)
)

/* script */
__vue_exports__ = __webpack_require__(25)

/* template */
var __vue_template__ = __webpack_require__(50)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/xiezijian/Documents/FrontEnd/wisdom-medical-hardware/src/components/HeaderWhi.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-0db0fc0c"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(47)
)

/* script */
__vue_exports__ = __webpack_require__(26)

/* template */
var __vue_template__ = __webpack_require__(61)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/xiezijian/Documents/FrontEnd/wisdom-medical-hardware/src/views/AddDeviceView.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-e5f81f3a"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(42)
)

/* script */
__vue_exports__ = __webpack_require__(27)

/* template */
var __vue_template__ = __webpack_require__(56)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/xiezijian/Documents/FrontEnd/wisdom-medical-hardware/src/views/BloodPressureResultView.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-64df04b0"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(41)
)

/* script */
__vue_exports__ = __webpack_require__(28)

/* template */
var __vue_template__ = __webpack_require__(55)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/xiezijian/Documents/FrontEnd/wisdom-medical-hardware/src/views/BloodPressureRunView.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-502fcd0c"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(46)
)

/* script */
__vue_exports__ = __webpack_require__(29)

/* template */
var __vue_template__ = __webpack_require__(60)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/xiezijian/Documents/FrontEnd/wisdom-medical-hardware/src/views/BloodSugarResultView.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-b44a5932"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(48)
)

/* script */
__vue_exports__ = __webpack_require__(30)

/* template */
var __vue_template__ = __webpack_require__(62)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/xiezijian/Documents/FrontEnd/wisdom-medical-hardware/src/views/BloodSugarRunView.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-f42e97ca"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(37)
)

/* script */
__vue_exports__ = __webpack_require__(31)

/* template */
var __vue_template__ = __webpack_require__(51)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/xiezijian/Documents/FrontEnd/wisdom-medical-hardware/src/views/BlueToothErrorView.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-12e44028"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(44)
)

/* script */
__vue_exports__ = __webpack_require__(32)

/* template */
var __vue_template__ = __webpack_require__(58)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/xiezijian/Documents/FrontEnd/wisdom-medical-hardware/src/views/BlueToothPreView.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-787d4a83"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(45)
)

/* script */
__vue_exports__ = __webpack_require__(33)

/* template */
var __vue_template__ = __webpack_require__(59)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/xiezijian/Documents/FrontEnd/wisdom-medical-hardware/src/views/BlueToothRunView.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-94ea2b2a"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(35)
)

/* script */
__vue_exports__ = __webpack_require__(34)

/* template */
var __vue_template__ = __webpack_require__(49)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "/Users/xiezijian/Documents/FrontEnd/wisdom-medical-hardware/src/views/MineDeviceView.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-0b98e3d2"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
//
//
//
//
//
//

exports.default = {
  methods: {
    back: function back() {
      this.$router.back();
    }
  }
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var native = weex.requireModule('event');
exports.default = {
    methods: {
        goBack: function goBack() {
            native.backToMain();
        }
    },
    props: ['title']
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

exports.default = {
  methods: {
    goBack: function goBack(path) {
      //this.$router.go(-1)
      this.jump(path);
    }
  },
  props: ['title', 'path']
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
//
//
//
//
//
//
//
//
//
//
//
//

exports.default = {
    methods: {
        goBack: function goBack() {
            this.$router.go(-1);
        }
    },
    props: ['title']
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _HeaderRet = __webpack_require__(0);

var _HeaderRet2 = _interopRequireDefault(_HeaderRet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var modal = weex.requireModule('modal'); //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var native = weex.requireModule('event');

exports.default = {
    data: function data() {
        return {
            text: 'dad'
        };
    },
    methods: {
        showToast: function showToast() {
            //0失败1成功
            native.showToastWithMsg('该服务暂时还未开通！', 0);
        }
    },
    components: {
        HeaderRet: _HeaderRet2.default
    }
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _HeaderClo = __webpack_require__(2);

var _HeaderClo2 = _interopRequireDefault(_HeaderClo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var storage = weex.requireModule('storage'); //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var native = weex.requireModule('event');

exports.default = {
    mounted: function mounted() {
        var result = this.$route.query.result + "";
        var array = result.split(",");
        console.log("1111" + array[0]);
        console.log("2222" + array[1]);
        console.log("3333" + array[2]);
        this.data.systolic_value = array[0];
        this.data.diastolic_value = array[1];
        this.data.heart_rate = array[2];
        this.data.timeNow = this.getNowFormatDate();
        this.catchColor(array[0], array[1]
        //自动保存结果
        );this.saveResults();
        console.log(this.data);
    },
    data: function data() {
        return {
            data: {
                stare_left: '',
                timeNow: '',
                systolic_value: '',
                systolic_value_color: '',
                systolic_value_level: '',
                diastolic_value: '',
                diastolic_value_color: '',
                diastolic_value_level: '',
                heart_rate: '',
                resultString: '血压正常',
                jsonString: ''
            }
        };
    },

    methods: {
        getNowFormatDate: function getNowFormatDate() {
            var d = new Date();
            return this.formatTime(d);
        },
        formatTime: function formatTime(date) {
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            return [year, month, day].map(this.formatNumber).join('/') + ' ' + [hour, minute, second].map(this.formatNumber).join(':');
        },
        formatNumber: function formatNumber(n) {
            n = n.toString();
            return n[1] ? n : '0' + n;
        },
        catchColor: function catchColor(systolic_value, diastolic_value) {
            console.log(systolic_value + "-------" + diastolic_value);
            var vm = this;
            //收缩压
            if (systolic_value <= 120) {
                vm.data.systolic_value_color = '#3B7621';
                vm.data.systolic_value_level = 1;
            } else if (systolic_value <= 130 && systolic_value > 120) {
                vm.data.systolic_value_color = '#71D641';
                vm.data.systolic_value_level = 2;
            } else if (systolic_value <= 140 && systolic_value > 130) {
                vm.data.systolic_value_color = '#B0EB8C';
                vm.data.systolic_value_level = 3;
            } else if (systolic_value <= 160 && systolic_value > 140) {
                vm.data.systolic_value_color = '#F3EB45';
                vm.data.systolic_value_level = 4;
            } else if (systolic_value <= 180 && systolic_value > 160) {
                vm.data.systolic_value_color = '#F3A83B';
                vm.data.systolic_value_level = 5;
            } else if (systolic_value > 180) {
                vm.data.systolic_value_color = '#D00D23';
                vm.data.systolic_value_level = 6;
            } else {
                vm.data.systolic_value_color = '#000';
            }
            //舒张压
            if (diastolic_value <= 80) {
                vm.data.diastolic_value_color = '#3B7621';
                vm.data.diastolic_value_level = 1;
            } else if (diastolic_value <= 85 && diastolic_value > 80) {
                vm.data.diastolic_value_color = '#71D641';
                vm.data.diastolic_value_level = 2;
            } else if (diastolic_value <= 90 && diastolic_value > 85) {
                vm.data.diastolic_value_color = '#B0EB8C';
                vm.data.diastolic_value_level = 3;
            } else if (diastolic_value <= 100 && diastolic_value > 90) {
                vm.data.diastolic_value_color = '#F3EB45';
                vm.data.diastolic_value_level = 4;
            } else if (diastolic_value <= 110 && diastolic_value > 100) {
                vm.data.diastolic_value_color = '#F3A83B';
                vm.data.diastolic_value_level = 5;
            } else if (diastolic_value > 110) {
                vm.data.diastolic_value_color = '#D00D23';
                vm.data.diastolic_value_level = 6;
            } else {
                vm.data.diastolic_value_color = '#000';
            }
            //判断结果
            if (vm.data.diastolic_value_level > vm.data.systolic_value_level) {
                switch (vm.data.diastolic_value_level) {
                    case 1:
                        vm.data.resultString = "最佳血压";
                        vm.data.stare_left = "115px";
                        break;
                    case 2:
                        vm.data.resultString = "正常血压";
                        vm.data.stare_left = "215px";
                        break;
                    case 3:
                        vm.data.resultString = "正常高值血压";
                        vm.data.stare_left = "315px";
                        break;
                    case 4:
                        vm.data.resultString = "轻度高血压";
                        vm.data.stare_left = "415px";
                        break;
                    case 5:
                        vm.data.resultString = "中度高血压";
                        vm.data.stare_left = "515px";
                        break;
                    case 6:
                        vm.data.resultString = "严重高血压";
                        vm.data.stare_left = "615px";
                        break;
                    default:
                        vm.data.resultString = "正常血压";
                        vm.data.stare_left = "115px";
                }
            } else {
                switch (vm.data.systolic_value_level) {
                    case 1:
                        vm.data.resultString = "最佳血压";
                        vm.data.stare_left = "115px";
                        break;
                    case 2:
                        vm.data.resultString = "正常血压";
                        vm.data.stare_left = "215px";
                        break;
                    case 3:
                        vm.data.resultString = "正常高值血压";
                        vm.data.stare_left = "315px";
                        break;
                    case 4:
                        vm.data.resultString = "轻度高血压";
                        vm.data.stare_left = "415px";
                        break;
                    case 5:
                        vm.data.resultString = "中度高血压";
                        vm.data.stare_left = "515px";
                        break;
                    case 6:
                        vm.data.resultString = "严重高血压";
                        vm.data.stare_left = "615px";
                        break;
                    default:
                        vm.data.resultString = "正常血压";
                        vm.data.stare_left = "125px";
                }
            }
        },
        saveResults: function saveResults() {
            var vu = this;
            var jsonObj = {
                title: '血压计',
                time: this.data.timeNow,
                lastValue: this.data.diastolic_value + '-' + this.data.systolic_value + 'mmHg',
                img: 'https://hardware.baichengyiliao.com/static/sphygmomano-meter.jpg',
                query: 'bluetooth-pre',
                systolic_value: this.data.systolic_value,
                diastolic_value: this.data.diastolic_value,
                heart_rate: this.data.heart_rate
            };
            vu.data.jsonString = JSON.stringify(jsonObj);
            storage.setItem('bloodPress', vu.data.jsonString, function (event) {
                console.log('set success');
            });
        },
        contactDoctor: function contactDoctor() {
            var ve = this;
            console.log(ve.data.jsonString);
            //调用原生方法
            native.getPressureInformation(ve.data.jsonString);
        }
    },
    components: {
        HeaderClo: _HeaderClo2.default
    }
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _HeaderRet = __webpack_require__(0);

var _HeaderRet2 = _interopRequireDefault(_HeaderRet);

var _pressure = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var native = weex.requireModule('event');

exports.default = {
    mounted: function mounted() {
        this.startListen();
    },
    data: function data() {
        return {
            data: { text: '请将设备绑在手臂上开始测量', value: '000', button: '开始测量' },
            startMeasureState: true,
            leftValue: '194px'
        };
    },

    methods: {
        startMeasure: function startMeasure() {
            if (this.startMeasureState) {
                this.data.text = '正在测量，请放松身体';
                //this.data.value = '139'
                this.data.button = '正在测量';
                this.startMeasureState = false;
                this.leftValue = '230px';
                this.startRun();
            } else {
                //this.data.text = '请将设备绑在手臂上开始测量'
                //this.data.value = '000'
                //this.data.button = '开始测量'
                //this.startMeasureState = true
                //this.leftValue = '194px'
                //this.jump('/blood-press-result')
            }
        },
        startListen: function startListen() {
            var vm = this;
            (0, _pressure.whenDeviceDisconnected)(function () {
                native.showToastWithMsg('连接中断，请重试！', 0);
                vm.jump("/bluetooth-pre");
            });
            (0, _pressure.setMonitoringCallback)(function (data) {
                console.log(data);
                if (data > 0 && data < 400) {
                    vm.data.value = data;
                }
            });
            (0, _pressure.setSuccessCallback)(function (data) {
                console.log(data);
                vm.$router.push({ path: '/blood-press-result', query: { result: data } });
            });
            (0, _pressure.setFailCallback)(function (data) {
                console.log(data
                //this.jump("/device-mine")
                );vm.data.text = '测量失败，请点击重新测量';
                vm.data.value = '000';
                vm.data.button = '重新测量';
                vm.leftValue = '194px';
                vm.startMeasureState = true;
            });
        },
        startRun: function startRun() {
            (0, _pressure.startMonitor)();
        }
    },
    components: {
        HeaderRet: _HeaderRet2.default
    }
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _HeaderClo = __webpack_require__(2);

var _HeaderClo2 = _interopRequireDefault(_HeaderClo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      button_color_1: '#FFF',
      button_color_2: '#FFF',
      button_color_text_1: '#000',
      button_color_text_2: '#000',
      data: {}
    };
  },

  methods: {
    changeChoice: function changeChoice(params) {
      if (params == 1) {
        this.button_color_1 = '#00A0E9';
        this.button_color_2 = '#FFF';
        this.button_color_text_1 = '#FFF';
        this.button_color_text_2 = '#000';
      } else {
        this.button_color_1 = '#FFF';
        this.button_color_2 = '#00A0E9';
        this.button_color_text_1 = '#000';
        this.button_color_text_2 = '#FFF';
      }
    }
  },
  components: {
    HeaderClo: _HeaderClo2.default
  }
}; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _HeaderRet = __webpack_require__(0);

var _HeaderRet2 = _interopRequireDefault(_HeaderRet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    data: function data() {
        return {
            data: {
                items: []
            }
        };
    },

    components: {
        HeaderRet: _HeaderRet2.default
    }
}; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _HeaderRet = __webpack_require__(0);

var _HeaderRet2 = _interopRequireDefault(_HeaderRet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      data: {
        items: []
      }
    };
  },

  components: {
    HeaderRet: _HeaderRet2.default
  }
}; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _pressure = __webpack_require__(1);

var _HeaderRet = __webpack_require__(0);

var _HeaderRet2 = _interopRequireDefault(_HeaderRet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

exports.default = {
    mounted: function mounted() {
        console.log((0, _pressure.deviceIsConnected)());
        (0, _pressure.whenDeviceDisconnected)(function () {});
        var blueToothState = (0, _pressure.deviceIsConnected)();
        if (blueToothState) {
            this.jump("/blood-press-run");
        }
    },
    data: function data() {
        return {
            data: {}
        };
    },

    methods: {},
    components: {
        HeaderRet: _HeaderRet2.default
    }
};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _HeaderWhi = __webpack_require__(12);

var _HeaderWhi2 = _interopRequireDefault(_HeaderWhi);

var _pressure = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var animation = weex.requireModule('animation');
var modal = weex.requireModule('modal');

exports.default = {
    mounted: function mounted() {
        this.connectBluetooth();
    },
    data: function data() {
        return {
            data: {
                items: []
            }
        };
    },

    methods: {
        moveAnm: function moveAnm() {
            var pic = this.$refs.pic;
            animation.transition(pic, {
                styles: {
                    transform: 'rotate(7200deg)'
                },
                duration: 80000,
                timingFunction: 'ease',
                delay: 0
            }, function () {});
        },
        connectBluetooth: function connectBluetooth() {
            this.moveAnm();
            var that = this;
            (0, _pressure.startConnect)(function (data) {
                if (data == "success") {
                    that.jump("/blood-press-run");
                } else {
                    that.jump("/blood-press-error");
                }
            });
        },
        stopBlueToothScanning: function stopBlueToothScanning() {
            (0, _pressure.stopScanning)();
            this.jump('/bluetooth-error');
        }
    },
    components: {
        HeaderWhi: _HeaderWhi2.default
    }
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _HeaderNor = __webpack_require__(11);

var _HeaderNor2 = _interopRequireDefault(_HeaderNor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var storage = weex.requireModule('storage'); //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var modal = weex.requireModule('modal');

exports.default = {
    mounted: function mounted() {
        this.getItem();
        console.log('mdzz'
        //            this.catchShowTag()
        );
    },
    data: function data() {
        return {
            items: [],
            showTag: true
        };
    },

    methods: {
        jumpTo: function jumpTo(query) {
            this.jump('/' + query
            //                this.$router.push({path: 'blood-press-result', query: {result: '156,89,77'}})
            );
        },
        getItem: function getItem() {
            var vm = this;
            var isCatch = false;
            storage.getItem('bloodPress', function (event) {
                console.log('get value:', event);
                if (event.data != "undefined") {
                    var jsonobj = JSON.parse(event.data);
                    vm.items.push(jsonobj);
                    isCatch = true;
                    if (isCatch) {
                        vm.showTag = false;
                        console.log('mdzzzzzzzzz');
                    }
                }
            });
            console.log(vm.showTag);
        },
        catchShowTag: function catchShowTag() {
            console.log(this.items);
            console.log(this.items.length);
            if (this.items.length > 0) {
                this.showTag = false;
            }
            console.log(this.showTag);
        }
    },
    components: {
        HeaderNor: _HeaderNor2.default
    }
};

/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = {
  "text": {
    "fontSize": 200
  },
  "tag1": {
    "position": "absolute",
    "top": 575,
    "left": 238,
    "color": "#838383",
    "fontSize": 28
  },
  "tag2": {
    "position": "absolute",
    "top": 621,
    "left": 208,
    "color": "#838383",
    "fontSize": 28
  },
  "device-list": {
    "height": 160,
    "borderBottomColor": "#B4B4B4",
    "borderBottomStyle": "solid",
    "borderBottomWidth": 1,
    "backgroundColor": "#FFFFFF"
  },
  "device-pic": {
    "height": 100,
    "width": 78,
    "position": "relative",
    "left": 46,
    "top": 30,
    "bottom": 30
  },
  "device-title": {
    "fontSize": 31,
    "position": "absolute",
    "top": 46,
    "left": 158
  },
  "device-used-time": {
    "position": "absolute",
    "fontSize": 19,
    "top": 95,
    "left": 159,
    "color": "#838383"
  },
  "device-subtitle": {
    "position": "absolute",
    "top": 57,
    "right": 49,
    "fontSize": 19,
    "color": "#333333"
  },
  "device-value": {
    "position": "absolute",
    "top": 88,
    "right": 49,
    "fontSize": 19,
    "color": "#333333"
  }
}

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = {
  "header": {
    "position": "fixed",
    "top": 1,
    "left": 0,
    "width": 750,
    "borderBottomStyle": "solid",
    "borderColor": "#B4B4B4",
    "borderBottomWidth": 1
  },
  "in-header": {
    "height": 89,
    "width": 750,
    "backgroundColor": "#FFFFFF",
    "position": "relative",
    "zIndex": 999
  },
  "title": {
    "position": "absolute",
    "height": 88,
    "top": 22,
    "left": 308,
    "color": "#333333",
    "textAlign": "center",
    "fontSize": 33
  },
  "return": {
    "position": "absolute",
    "height": 88,
    "width": 29,
    "left": 35
  }
}

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = {
  "remind-1": {
    "position": "absolute",
    "top": 537,
    "left": 222,
    "fontSize": 29
  },
  "remind-2": {
    "position": "absolute",
    "top": 587,
    "left": 327,
    "fontSize": 26,
    "color": "#2392DF"
  },
  "button-frame": {
    "position": "absolute",
    "left": 240,
    "top": 205,
    "height": 270,
    "width": 270
  },
  "button-frame-large": {
    "position": "absolute",
    "bottom": 200,
    "left": 50,
    "width": 650,
    "height": 80
  },
  "button-choice-flat": {
    "backgroundColor": "#FFFFFF",
    "height": 80,
    "width": 650,
    "borderRadius": 40,
    "borderColor": "#B4B4B4",
    "borderStyle": "solid",
    "borderWidth": 1
  },
  "button-choice-flat-text": {
    "position": "absolute",
    "left": 258,
    "top": 18,
    "fontSize": 33
  }
}

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = {
  "header": {
    "position": "fixed",
    "top": 1,
    "left": 0,
    "width": 750,
    "borderBottomStyle": "solid",
    "borderColor": "#B4B4B4",
    "borderBottomWidth": 1
  },
  "in-header": {
    "height": 89,
    "width": 750,
    "backgroundColor": "#FFFFFF",
    "position": "relative",
    "zIndex": 999
  },
  "title": {
    "position": "absolute",
    "height": 88,
    "top": 22,
    "left": 308,
    "color": "#333333",
    "textAlign": "center",
    "fontSize": 33
  },
  "return": {
    "position": "absolute",
    "height": 88,
    "width": 29,
    "left": 35
  }
}

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = {
  "header": {
    "position": "fixed",
    "top": 0,
    "left": 0,
    "width": 750,
    "borderBottomStyle": "solid",
    "borderColor": "#B4B4B4",
    "borderBottomWidth": 1
  },
  "in-header": {
    "height": 89,
    "width": 750,
    "backgroundColor": "#FFFFFF",
    "position": "relative"
  },
  "title": {
    "position": "absolute",
    "height": 88,
    "top": 22,
    "left": 308,
    "color": "#333333",
    "textAlign": "center",
    "fontSize": 33
  },
  "return": {
    "position": "absolute",
    "height": 88,
    "width": 29,
    "left": 35
  },
  "add": {
    "position": "absolute",
    "height": 88,
    "width": 36,
    "right": 34
  }
}

/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = {
  "header": {
    "position": "fixed",
    "top": 0,
    "left": 0,
    "width": 750,
    "borderBottomStyle": "solid",
    "borderColor": "#B4B4B4",
    "borderBottomWidth": 1
  },
  "in-header": {
    "height": 89,
    "width": 750,
    "backgroundColor": "#FFFFFF",
    "position": "relative"
  },
  "title": {
    "position": "absolute",
    "height": 88,
    "top": 22,
    "left": 308,
    "color": "#333333",
    "textAlign": "center",
    "fontSize": 33
  },
  "close": {
    "position": "absolute",
    "height": 88,
    "width": 36,
    "right": 34
  }
}

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = {
  "state-measure": {
    "position": "absolute",
    "textAlign": "center",
    "fontSize": 28,
    "left": 194,
    "top": 115
  },
  "value-measure": {
    "position": "absolute",
    "textAlign": "center",
    "fontSize": 195,
    "left": 180,
    "top": 218,
    "width": 380
  },
  "unit-measure": {
    "position": "absolute",
    "fontSize": 32,
    "left": 320,
    "top": 439
  },
  "button-frame": {
    "position": "absolute",
    "left": 266,
    "top": 675,
    "height": 221,
    "width": 221
  },
  "button-choice": {
    "borderRadius": 110,
    "height": 221,
    "width": 221,
    "borderColor": "#B4B4B4",
    "borderWidth": 1,
    "borderStyle": "solid",
    "backgroundColor": "#5A33BE"
  },
  "button-choice-text": {
    "position": "absolute",
    "top": 88,
    "left": 46,
    "fontSize": 32,
    "color": "#ffffff"
  }
}

/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = {
  "cell": {
    "height": 156
  },
  "hand-measure": {
    "position": "absolute",
    "top": 130,
    "width": 30,
    "height": 36
  },
  "list": {
    "position": "absolute",
    "top": 285,
    "left": 137
  },
  "title-result": {
    "fontSize": 45
  },
  "subtitle-result": {
    "fontSize": 26,
    "top": 3,
    "color": "#848484"
  },
  "value-result": {
    "fontSize": 110,
    "position": "absolute",
    "left": 289,
    "top": -20,
    "color": "#000000"
  },
  "time-measure": {
    "position": "absolute",
    "fontSize": 22,
    "left": 225,
    "top": 28
  },
  "pic-press": {
    "width": 662,
    "height": 28,
    "position": "absolute",
    "top": 173,
    "left": 44
  },
  "state-measure": {
    "position": "absolute",
    "left": 305,
    "top": 74,
    "fontSize": 34,
    "color": "#71D641"
  },
  "value-measure": {
    "position": "absolute",
    "fontSize": 195,
    "left": 230,
    "top": 139
  },
  "remind": {
    "position": "absolute",
    "top": 545,
    "left": 285,
    "fontSize": 26
  },
  "button-frame-large": {
    "position": "absolute",
    "bottom": 200,
    "left": 50,
    "width": 650,
    "height": 80
  },
  "button-choice-flat": {
    "backgroundColor": "#FFFFFF",
    "height": 80,
    "width": 310,
    "borderRadius": 40,
    "borderColor": "#B4B4B4",
    "borderStyle": "solid",
    "borderWidth": 1
  },
  "button-choice-flat-text": {
    "position": "absolute",
    "left": 90,
    "top": 19,
    "fontSize": 32
  }
}

/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = {
  "app": {
    "backgroundColor": "#F7F7F7"
  }
}

/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = {
  "remind-1": {
    "position": "absolute",
    "top": 537,
    "left": 166,
    "fontSize": 29
  },
  "remind-2": {
    "position": "absolute",
    "top": 587,
    "left": 327,
    "fontSize": 26,
    "color": "#2392DF"
  },
  "button-frame": {
    "position": "absolute",
    "left": 240,
    "top": 205,
    "height": 270,
    "width": 270
  },
  "button-frame-large": {
    "position": "absolute",
    "bottom": 200,
    "left": 50,
    "width": 650,
    "height": 80
  },
  "button-choice-flat": {
    "backgroundColor": "#FFFFFF",
    "height": 80,
    "width": 650,
    "borderRadius": 40,
    "borderColor": "#B4B4B4",
    "borderStyle": "solid",
    "borderWidth": 1
  },
  "button-choice-flat-text": {
    "position": "absolute",
    "left": 258,
    "top": 18,
    "fontSize": 33
  }
}

/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = {
  "remind-1": {
    "position": "absolute",
    "top": 537,
    "left": 281,
    "fontSize": 29
  },
  "remind-2": {
    "position": "absolute",
    "top": 587,
    "left": 327,
    "fontSize": 26,
    "color": "#2392DF"
  },
  "button-frame": {
    "position": "absolute",
    "left": 240,
    "top": 205,
    "height": 270,
    "width": 270
  },
  "button-frame-large": {
    "position": "absolute",
    "bottom": 200,
    "left": 50,
    "width": 650,
    "height": 80
  },
  "button-choice-flat": {
    "backgroundColor": "#FFFFFF",
    "height": 80,
    "width": 650,
    "borderRadius": 40,
    "borderColor": "#B4B4B4",
    "borderStyle": "solid",
    "borderWidth": 1
  },
  "button-choice-flat-text": {
    "position": "absolute",
    "left": 258,
    "top": 18,
    "fontSize": 33
  }
}

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = {
  "time-measure": {
    "position": "absolute",
    "fontSize": 22,
    "left": 225,
    "top": 28
  },
  "value-measure": {
    "position": "absolute",
    "fontSize": 195,
    "left": 230,
    "top": 139
  },
  "unit-measure": {
    "position": "absolute",
    "fontSize": 26,
    "left": 325,
    "top": 370
  },
  "line-part": {
    "position": "absolute",
    "top": 469,
    "left": 90,
    "width": 570,
    "borderBottomStyle": "solid",
    "borderBottomColor": "#B4B4B4",
    "borderBottomWidth": 1
  },
  "remind": {
    "position": "absolute",
    "top": 545,
    "left": 285,
    "fontSize": 26
  },
  "button-frame": {
    "position": "absolute",
    "left": 125,
    "top": 619,
    "height": 200,
    "width": 500
  },
  "button-choice": {
    "borderRadius": 100,
    "height": 200,
    "width": 200,
    "borderColor": "#B4B4B4",
    "borderWidth": 1,
    "borderStyle": "solid"
  },
  "button-choice-pitch": {
    "backgroundColor": "rgb(0,160,223)"
  },
  "button-choice-text-pitch": {
    "color": "#ffffff"
  },
  "button-choice-text": {
    "position": "absolute",
    "top": 76,
    "left": 68,
    "fontSize": 32
  },
  "button-frame-large": {
    "position": "absolute",
    "bottom": 200,
    "left": 50,
    "width": 650,
    "height": 80
  },
  "button-choice-flat": {
    "backgroundColor": "#FFFFFF",
    "height": 80,
    "width": 310,
    "borderRadius": 40,
    "borderColor": "#B4B4B4",
    "borderStyle": "solid",
    "borderWidth": 1
  },
  "button-choice-flat-text": {
    "position": "absolute",
    "left": 90,
    "top": 19,
    "fontSize": 32
  }
}

/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = {
  "item": {
    "flex": 1,
    "justifyContent": "center",
    "alignItems": "center",
    "borderBottomWidth": 1,
    "borderBottomStyle": "solid",
    "borderBottomColor": "#B4B4B4",
    "borderLeftWidth": 1,
    "borderLeftStyle": "solid",
    "borderLeftColor": "#B4B4B4",
    "backgroundColor": "#FFFFFF"
  },
  "item-white": {
    "flex": 1,
    "justifyContent": "center",
    "alignItems": "center"
  },
  "row": {
    "flexDirection": "row",
    "height": 201,
    "top": 3
  },
  "subscript": {
    "position": "absolute",
    "width": 50,
    "height": 50,
    "top": 0,
    "left": 0
  },
  "pic": {
    "position": "absolute",
    "top": 26,
    "left": 49,
    "width": 93,
    "height": 104
  },
  "title": {
    "position": "absolute",
    "fontSize": 23,
    "top": 152,
    "left": 58
  }
}

/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = {
  "state-measure": {
    "position": "absolute",
    "fontSize": 28,
    "left": 255,
    "top": 115
  },
  "value-measure": {
    "position": "absolute",
    "fontSize": 195,
    "left": 236,
    "top": 218
  },
  "unit-measure": {
    "position": "absolute",
    "fontSize": 32,
    "left": 317,
    "top": 439
  },
  "button-frame": {
    "position": "absolute",
    "left": 266,
    "top": 675,
    "height": 221,
    "width": 221
  },
  "button-choice": {
    "borderRadius": 110,
    "height": 221,
    "width": 221,
    "borderColor": "#B4B4B4",
    "borderWidth": 1,
    "borderStyle": "solid",
    "backgroundColor": "#5A33BE"
  },
  "button-choice-text": {
    "position": "absolute",
    "top": 88,
    "left": 46,
    "fontSize": 32,
    "color": "#ffffff"
  }
}

/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('HeaderNor', {
    attrs: {
      "title": "我的设备"
    }
  }), (_vm.showTag === true) ? _c('div', [_c('text', {
    staticClass: ["tag1"]
  }, [_vm._v("目前尚未使用任何设备")]), _c('text', {
    staticClass: ["tag2"]
  }, [_vm._v("请点击屏幕右上角添加设备")])]) : _vm._e(), _c('div', [_c('list', {
    staticStyle: {
      width: "750px",
      height: "1294px",
      top: "2px"
    }
  }, _vm._l((_vm.items), function(item) {
    return _c('cell', {
      staticClass: ["device-list"],
      appendAsTree: true,
      attrs: {
        "append": "tree"
      },
      on: {
        "click": function($event) {
          _vm.jumpTo(item.query)
        }
      }
    }, [_c('image', {
      staticClass: ["device-pic"],
      attrs: {
        "src": item.img
      }
    }), _c('text', {
      staticClass: ["device-title"]
    }, [_vm._v(_vm._s(item.title))]), _c('text', {
      staticClass: ["device-used-time"]
    }, [_vm._v(_vm._s(item.time) + "使用")]), _c('text', {
      staticClass: ["device-subtitle"]
    }, [_vm._v("上次测量结果")]), _c('text', {
      staticClass: ["device-value"]
    }, [_vm._v(_vm._s(item.lastValue))])])
  }))])], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 50 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('div', {
    staticClass: ["header"]
  }, [_c('div', {
    staticClass: ["in-header"]
  }, [_c('text', {
    staticClass: ["title"]
  }, [_vm._v(_vm._s(_vm.title))])])]), _c('div', {
    staticStyle: {
      height: "88px"
    }
  })])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('HeaderRet', {
    attrs: {
      "title": "添加设备",
      "path": "/device-mine"
    }
  }), _c('div', {
    staticStyle: {
      height: "1246px",
      width: "750px"
    }
  }, [_vm._m(0), _c('text', {
    staticClass: ["remind-1"]
  }, [_vm._v("没有发现可用的蓝牙设备")]), _c('text', {
    staticClass: ["remind-2"]
  }, [_vm._v("连接帮助")]), _c('div', {
    staticClass: ["button-frame-large"]
  }, [_c('div', {
    staticClass: ["button-choice-flat"],
    on: {
      "click": function($event) {
        _vm.jump('/bluetooth-run')
      }
    }
  }, [_c('text', {
    staticClass: ["button-choice-flat-text"]
  }, [_vm._v("重新扫描")])])])])], 1)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: ["button-frame"]
  }, [_c('image', {
    staticStyle: {
      width: "270px",
      height: "270px"
    },
    attrs: {
      "src": "https://hardware.baichengyiliao.com/static/bluetooth.jpg"
    }
  })])
}]}
module.exports.render._withStripped = true

/***/ }),
/* 52 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('div', {
    staticClass: ["header"]
  }, [_c('div', {
    staticClass: ["in-header"]
  }, [_c('div', {
    staticStyle: {
      width: "200px",
      height: "88px"
    },
    on: {
      "click": function($event) {
        _vm.goBack(_vm.path)
      }
    }
  }, [_c('image', {
    staticClass: ["return"],
    attrs: {
      "src": "https://hardware.baichengyiliao.com/static/return-button.jpg"
    }
  })]), _c('text', {
    staticClass: ["title"]
  }, [_vm._v(_vm._s(_vm.title))])])]), _c('div', {
    staticStyle: {
      height: "88px"
    }
  })])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('div', {
    staticClass: ["header"]
  }, [_c('div', {
    staticClass: ["in-header"]
  }, [_c('image', {
    staticClass: ["return"],
    attrs: {
      "src": "https://hardware.baichengyiliao.com/static/return-button.jpg"
    },
    on: {
      "click": function($event) {
        _vm.goBack()
      }
    }
  }), _c('image', {
    staticClass: ["add"],
    attrs: {
      "src": "https://hardware.baichengyiliao.com/static/add-button.jpg"
    },
    on: {
      "click": function($event) {
        _vm.jump('/device-add')
      }
    }
  }), _c('text', {
    staticClass: ["title"]
  }, [_vm._v(_vm._s(_vm.title))])])]), _c('div', {
    staticStyle: {
      height: "88px"
    }
  })])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('div', {
    staticClass: ["header"]
  }, [_c('div', {
    staticClass: ["in-header"]
  }, [_c('image', {
    staticClass: ["close"],
    attrs: {
      "src": "https://hardware.baichengyiliao.com/static/close-button.jpg"
    },
    on: {
      "click": function($event) {
        _vm.jump('/device-mine')
      }
    }
  }), _c('text', {
    staticClass: ["title"]
  }, [_vm._v("测量结果")])])]), _c('div', {
    staticStyle: {
      height: "88px"
    }
  })])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 55 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('HeaderRet', {
    attrs: {
      "title": "   血压计",
      "path": "/device-mine"
    }
  }), _c('div', {
    staticStyle: {
      height: "1246px",
      width: "750px"
    }
  }, [_c('text', {
    staticClass: ["state-measure"],
    style: {
      left: _vm.leftValue
    }
  }, [_vm._v(_vm._s(_vm.data.text))]), _c('text', {
    staticClass: ["value-measure"]
  }, [_vm._v(_vm._s(_vm.data.value))]), _c('text', {
    staticClass: ["unit-measure"]
  }, [_vm._v("mmHg")]), _c('div', {
    staticClass: ["button-frame"]
  }, [_c('div', {
    staticClass: ["button-choice"],
    staticStyle: {
      position: "absolute",
      top: "0px",
      right: "0px"
    },
    on: {
      "click": function($event) {
        _vm.startMeasure()
      }
    }
  }, [_c('text', {
    staticClass: ["button-choice-text"]
  }, [_vm._v(_vm._s(_vm.data.button))])])])])], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 56 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('HeaderClo'), _c('div', {
    staticStyle: {
      height: "1246px",
      width: "750px"
    }
  }, [_c('text', {
    staticClass: ["time-measure"]
  }, [_vm._v("测量时间：" + _vm._s(_vm.data.timeNow))]), _c('text', {
    staticClass: ["state-measure"]
  }, [_vm._v(_vm._s(_vm.data.resultString))]), _c('image', {
    staticClass: ["hand-measure"],
    style: {
      left: _vm.data.stare_left
    },
    attrs: {
      "src": "https://hardware.baichengyiliao.com/static/blood-pressure-markers.jpg"
    }
  }), _c('image', {
    staticClass: ["pic-press"],
    attrs: {
      "src": "https://hardware.baichengyiliao.com/static/blood-pressure-index.jpg"
    }
  }), _c('div', {
    staticClass: ["list"]
  }, [_c('list', {
    staticStyle: {
      width: "750px",
      height: "750px"
    }
  }, [_c('cell', {
    staticClass: ["cell"],
    appendAsTree: true,
    attrs: {
      "append": "tree"
    }
  }, [_c('text', {
    staticClass: ["title-result"]
  }, [_vm._v("收缩压")]), _c('text', {
    staticClass: ["subtitle-result"]
  }, [_vm._v("mmHg")]), _c('text', {
    staticClass: ["value-result"],
    style: {
      color: _vm.data.systolic_value_color
    }
  }, [_vm._v(_vm._s(_vm.data.systolic_value))])]), _c('cell', {
    staticClass: ["cell"],
    appendAsTree: true,
    attrs: {
      "append": "tree"
    }
  }, [_c('text', {
    staticClass: ["title-result"]
  }, [_vm._v("舒张压")]), _c('text', {
    staticClass: ["subtitle-result"]
  }, [_vm._v("mmHg")]), _c('text', {
    staticClass: ["value-result"],
    style: {
      color: _vm.data.diastolic_value_color
    }
  }, [_vm._v(_vm._s(_vm.data.diastolic_value))])]), _c('cell', {
    staticClass: ["cell"],
    appendAsTree: true,
    attrs: {
      "append": "tree"
    }
  }, [_c('text', {
    staticClass: ["title-result"]
  }, [_vm._v("心率")]), _c('text', {
    staticClass: ["subtitle-result"]
  }, [_vm._v("BPS")]), _c('text', {
    staticClass: ["value-result"]
  }, [_vm._v(_vm._s(_vm.data.heart_rate))])])])]), _c('div', {
    staticClass: ["button-frame-large"]
  }, [_c('div', {
    staticClass: ["button-choice-flat"],
    on: {
      "click": function($event) {
        _vm.contactDoctor()
      }
    }
  }, [_c('text', {
    staticClass: ["button-choice-flat-text"],
    staticStyle: {
      color: "rgb(0,160,223)"
    }
  }, [_vm._v("咨询医生")])]), _c('div', {
    staticClass: ["button-choice-flat"],
    staticStyle: {
      position: "absolute",
      top: "0px",
      right: "0px"
    }
  }, [_c('text', {
    staticClass: ["button-choice-flat-text"],
    on: {
      "click": function($event) {
        _vm.jump('/blood-press-run')
      }
    }
  }, [_vm._v("再次测量")])])])])], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 57 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: ["app"],
    attrs: {
      "id": "app"
    },
    on: {
      "androidback": _vm.back
    }
  }, [_c('router-view', {
    staticStyle: {
      flex: "1"
    }
  })], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('HeaderRet', {
    attrs: {
      "title": "添加设备",
      "path": "/device-mine"
    }
  }), _c('div', {
    staticStyle: {
      height: "1246px",
      width: "750px"
    }
  }, [_vm._m(0), _c('text', {
    staticClass: ["remind-1"]
  }, [_vm._v("请打开手机蓝牙，且保持设备有电")]), _c('text', {
    staticClass: ["remind-2"]
  }, [_vm._v("连接帮助")]), _c('div', {
    staticClass: ["button-frame-large"]
  }, [_c('div', {
    staticClass: ["button-choice-flat"],
    on: {
      "click": function($event) {
        _vm.jump('/bluetooth-run')
      }
    }
  }, [_c('text', {
    staticClass: ["button-choice-flat-text"]
  }, [_vm._v("扫描设备")])])])])], 1)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: ["button-frame"]
  }, [_c('image', {
    staticStyle: {
      width: "270px",
      height: "270px"
    },
    attrs: {
      "src": "https://hardware.baichengyiliao.com/static/bluetooth.jpg"
    }
  })])
}]}
module.exports.render._withStripped = true

/***/ }),
/* 59 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('HeaderWhi', {
    attrs: {
      "title": "添加设备"
    }
  }), _c('div', {
    staticStyle: {
      height: "1246px",
      width: "750px"
    }
  }, [_vm._m(0), _c('div', {
    staticClass: ["button-frame"],
    on: {
      "click": _vm.move
    }
  }, [_c('image', {
    ref: "pic",
    staticStyle: {
      width: "270px",
      height: "270px"
    },
    attrs: {
      "src": "https://hardware.baichengyiliao.com/static/bluetooth-anm.jpg"
    }
  })]), _c('text', {
    staticClass: ["remind-1"]
  }, [_vm._v("正在连接设备...")]), _c('text', {
    staticClass: ["remind-2"]
  }, [_vm._v("连接帮助")]), _c('div', {
    staticClass: ["button-frame-large"],
    on: {
      "click": _vm.stopBlueToothScanning
    }
  }, [_vm._m(1)])])], 1)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: ["button-frame"]
  }, [_c('image', {
    staticStyle: {
      width: "270px",
      height: "270px"
    },
    attrs: {
      "src": "https://hardware.baichengyiliao.com/static/bluetooth.jpg"
    }
  })])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: ["button-choice-flat"]
  }, [_c('text', {
    staticClass: ["button-choice-flat-text"]
  }, [_vm._v("取消连接")])])
}]}
module.exports.render._withStripped = true

/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('HeaderClo'), _c('div', {
    staticStyle: {
      height: "1246px",
      width: "750px"
    }
  }, [_c('text', {
    staticClass: ["time-measure"]
  }, [_vm._v("测量时间：2017.05.05 08:30")]), _c('text', {
    staticClass: ["value-measure"]
  }, [_vm._v("7.5")]), _c('text', {
    staticClass: ["unit-measure"]
  }, [_vm._v("mmol/L")]), _c('div', {
    staticClass: ["line-part"]
  }), _c('text', {
    staticClass: ["remind"]
  }, [_vm._v("本次测量是在？")]), _c('div', {
    staticClass: ["button-frame"]
  }, [_c('div', {
    staticClass: ["button-choice"],
    style: {
      'background-color': _vm.button_color_1
    },
    on: {
      "click": function($event) {
        _vm.changeChoice(1)
      }
    }
  }, [_c('text', {
    staticClass: ["button-choice-text"],
    style: {
      color: _vm.button_color_text_1
    }
  }, [_vm._v("餐前")])]), _c('div', {
    staticClass: ["button-choice"],
    staticStyle: {
      position: "absolute",
      top: "0px",
      right: "0px"
    },
    style: {
      'background-color': _vm.button_color_2
    },
    on: {
      "click": function($event) {
        _vm.changeChoice(2)
      }
    }
  }, [_c('text', {
    staticClass: ["button-choice-text"],
    style: {
      color: _vm.button_color_text_2
    }
  }, [_vm._v("空腹")])])]), _vm._m(0)])], 1)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: ["button-frame-large"]
  }, [_c('div', {
    staticClass: ["button-choice-flat"]
  }, [_c('text', {
    staticClass: ["button-choice-flat-text"],
    staticStyle: {
      color: "rgb(0,160,223)"
    }
  }, [_vm._v("保存结果")])]), _c('div', {
    staticClass: ["button-choice-flat"],
    staticStyle: {
      position: "absolute",
      top: "0px",
      right: "0px"
    }
  }, [_c('text', {
    staticClass: ["button-choice-flat-text"]
  }, [_vm._v("保存结果")])])])
}]}
module.exports.render._withStripped = true

/***/ }),
/* 61 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('HeaderRet', {
    attrs: {
      "title": "添加设备",
      "path": "/device-mine"
    }
  }), _c('div', {
    staticClass: ["row"]
  }, [_c('div', {
    staticClass: ["item"],
    on: {
      "click": _vm.showToast
    }
  }, [_c('image', {
    staticClass: ["pic"],
    attrs: {
      "src": "https://hardware.baichengyiliao.com/static/blood-glucose-meter.jpg"
    }
  }), _c('text', {
    staticClass: ["title"]
  }, [_vm._v("血糖仪")])]), _c('div', {
    staticClass: ["item"],
    on: {
      "click": function($event) {
        _vm.jump('/bluetooth-pre')
      }
    }
  }, [_c('image', {
    staticClass: ["subscript"],
    attrs: {
      "src": "https://hardware.baichengyiliao.com/static/add-device-tag.jpg"
    }
  }), _c('image', {
    staticClass: ["pic"],
    attrs: {
      "src": "https://hardware.baichengyiliao.com/static/sphygmomano-meter.jpg"
    }
  }), _c('text', {
    staticClass: ["title"]
  }, [_vm._v("血压计")])]), _c('div', {
    staticClass: ["item"],
    on: {
      "click": _vm.showToast
    }
  }, [_c('image', {
    staticClass: ["pic"],
    attrs: {
      "src": "https://hardware.baichengyiliao.com/static/fetal-heart-monitor.jpg"
    }
  }), _c('text', {
    staticClass: ["title"],
    staticStyle: {
      left: "34px"
    }
  }, [_vm._v("胎心监护仪")])]), _c('div', {
    staticClass: ["item"],
    on: {
      "click": _vm.showToast
    }
  }, [_c('image', {
    staticClass: ["pic"],
    attrs: {
      "src": "https://hardware.baichengyiliao.com/static/body-fat-detection.jpg"
    }
  }), _c('text', {
    staticClass: ["title"],
    staticStyle: {
      left: "34px"
    }
  }, [_vm._v("体脂检测仪")])])]), _c('div', {
    staticClass: ["row"]
  }, [_c('div', {
    staticClass: ["item"],
    staticStyle: {
      borderRightWidth: "1px",
      borderRightStyle: "solid",
      borderRightColor: "#B4B4B4"
    },
    on: {
      "click": function($event) {
        _vm.showToast()
      }
    }
  }, [_c('image', {
    staticClass: ["pic"],
    attrs: {
      "src": "https://hardware.baichengyiliao.com/static/ECG.jpg"
    }
  }), _c('text', {
    staticClass: ["title"]
  }, [_vm._v("心电仪")])]), _c('div', {
    staticClass: ["item-white"]
  }), _c('div', {
    staticClass: ["item-white"]
  }), _c('div', {
    staticClass: ["item-white"]
  })])], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 62 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('HeaderRet', {
    attrs: {
      "title": "   血糖仪"
    }
  }), _c('div', {
    staticStyle: {
      height: "1246px",
      width: "750px"
    }
  }, [_c('text', {
    staticClass: ["state-measure"]
  }, [_vm._v("正在测量，请稍后…")]), _c('text', {
    staticClass: ["value-measure"]
  }, [_vm._v("7.5")]), _c('text', {
    staticClass: ["unit-measure"]
  }, [_vm._v("mmol/L")]), _c('div', {
    staticClass: ["button-frame"]
  }, [_c('div', {
    staticClass: ["button-choice"],
    staticStyle: {
      position: "absolute",
      top: "0px",
      right: "0px"
    },
    on: {
      "click": function($event) {
        _vm.jump('/blood-sugar-result')
      }
    }
  }, [_c('text', {
    staticClass: ["button-choice-text"]
  }, [_vm._v("停止测量")])])])])], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ })
/******/ ]);