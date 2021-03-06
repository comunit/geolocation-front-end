// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({9:[function(require,module,exports) {
module.exports = {
  disconnectedMessage: function disconnectedMessage(message) {
    var div = document.getElementsByClassName('success-hide');
    div[0].style.display = "block";
    div[0].classList.remove('alert-primary');
    div[0].classList.add('alert-danger');
    div[0].innerText = message;
    setTimeout(function () {
      div[0].style.display = "none";
    }, 8000);
  }
};
},{}],11:[function(require,module,exports) {
module.exports = {
  markersarray: [],
  initialLocation: []
};
},{}],4:[function(require,module,exports) {
userId = function (_userId) {
    function userId() {
        return _userId.apply(this, arguments);
    }

    userId.toString = function () {
        return _userId.toString();
    };

    return userId;
}(function () {
    userId = Math.floor(Math.random() * 10000000000000000000 + 1);
    return userId;
});
module.exports = {
    id: userId()
};
},{}],10:[function(require,module,exports) {
'use strict';

var _markers = require('./markers');

var _userId = require('./userId');

var idtostring2 = String(_userId.id);

module.exports = {
  initMap: function initMap() {
    var center = {
      lat: 51.507351,
      lng: -0.127758
    };

    // Create a map object and specify the DOM element
    // for display.
    var map = new google.maps.Map(document.getElementById('map'), {
      center: center,
      zoom: 11
    });
    // getting data from database
    db.collection('geolocation').onSnapshot(function (snapshot) {
      var changes = snapshot.docChanges();
      changes.forEach(function (change) {
        if (change.type == 'added') {
          if (change.doc.data().userId == idtostring2) {
            // Create a marker and set its position.
            var marker = new google.maps.Marker({
              icon: './img/map-icon.png',
              content: change.doc.data().name,
              disableAutoPan: true,
              map: map
            });
          } else {
            // Create a marker and set its position.
            var marker = new google.maps.InfoWindow({
              content: change.doc.data().name,
              disableAutoPan: true,
              map: map
            });
          }

          marker.setPosition({
            lat: change.doc.data().lat,
            lng: change.doc.data().lng
          });
          marker.set('id', change.doc.id);
          marker.set('userId', idtostring2);
          _markers.markersarray.push(marker);
        } else if (change.type == 'modified') {
          // get modified id of document
          var docId = change.doc.id;
          _markers.markersarray.forEach(function (marker) {
            if (marker.id == docId) {
              // update location
              marker.setPosition({
                lat: change.doc.data().lat,
                lng: change.doc.data().lng
              });
            }
          });
        }
      });
    });
  }
};
},{"./markers":11,"./userId":4}],5:[function(require,module,exports) {
module.exports = {
  socket: io.connect('https://geolocation-comunit.herokuapp.com'),
  socketId: []
  // https://geolocation-comunit.herokuapp.com/

};
},{}],8:[function(require,module,exports) {
module.exports = {
  nameOfUser: []
};
},{}],12:[function(require,module,exports) {
'use strict';

var _socket = require('./socket');

var _socket2 = _interopRequireDefault(_socket);

var _userId = require('./userId');

var _checkformsubmited = require('./checkformsubmited');

var _markers = require('./markers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var spinners = document.getElementsByClassName('main-bg');
var serverDownAlert = document.getElementsByClassName('serverdownalert');
document.getElementsByTagName('form#form');
var body = document.getElementsByTagName('body');
var idtostring2 = String(_userId.id);

module.exports = {
  // check if server down
  serverDownCheck: _socket.socket.on('connect_error', function () {
    serverDownAlert[0].style.display = 'block';
    body[0].classList.add('spinner-1');
    form.style.display = 'none';
    serverDownAlert[0].innerText = 'No internet connection can be found!';
    db.collection("onlineusers").doc(_socket2.default.socketId[0]).delete().then(function () {});
    db.collection("geolocation").doc(idtostring2).delete().then(function () {});
    _markers.markersarray.forEach(function (marker) {
      if (marker.id === idtostring2) {
        marker.setMap(null);
      }
    });
  }),

  ConnectionUp: _socket.socket.on('connect', function () {
    body[0].classList.remove('spinner-1');
    form.style.display = 'block';
    serverDownAlert[0].style.display = 'none';
    _socket2.default.socketId.splice(0, _socket2.default.socketId.length);
    _socket2.default.socketId.push(_socket.socket.id);
    db.collection("onlineusers").doc(_socket.socket.id).set({
      userId: idtostring2,
      socketid: _socket.socket.id
    }).then(function () {
      if (_checkformsubmited.nameOfUser.length == 1) {
        db.collection("geolocation").doc(idtostring2).set({
          name: _checkformsubmited.nameOfUser["0"],
          lat: 51.507351,
          lng: -0.127758,
          userId: idtostring2
        });
      }
    });
  })
};
},{"./socket":5,"./userId":4,"./checkformsubmited":8,"./markers":11}],2:[function(require,module,exports) {
'use strict';

var _disconnected = require('./disconnected');

var _map = require('./map');

var _userId = require('./userId');

var _markers = require('./markers');

var _markers2 = _interopRequireDefault(_markers);

var _socket = require('./socket');

var _socketConnectionCheck = require('./socketConnectionCheck');

var _checkformsubmited = require('./checkformsubmited');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var idtostring = String(_userId.id);

var form = document.getElementById('form');
var formdiv = document.getElementById('main-bg');

form.addEventListener('submit', function (e) {
  var name = document.getElementById('name').value;
  _checkformsubmited.nameOfUser.push(name);
  // remove main main-bg
  formdiv.style.display = "none";
  // set map height
  document.getElementById('map').style.height = '100%';
  // save user in database with initizlized lat and lng
  db.collection("geolocation").doc(idtostring).set({
    name: name,
    lat: 51.507351,
    lng: -0.127758,
    accuracy: 0,
    userId: idtostring
  });
  // initilize map
  (0, _map.initMap)();
  e.preventDefault();
});
},{"./disconnected":9,"./map":10,"./userId":4,"./markers":11,"./socket":5,"./socketConnectionCheck":12,"./checkformsubmited":8}],3:[function(require,module,exports) {
'use strict';

var _checkformsubmited = require('./checkformsubmited');

module.exports = {
  alertMessage: function alertMessage(message) {
    // if statement to avoid alert message showing on first screen
    if (_checkformsubmited.nameOfUser.length === 0) {
      //if form not submitted this will take care of it and won't show any alert
    } else {
      var div = document.getElementsByClassName('success-hide');
      if (div[0].classList.contains('alert-danger')) {
        div[0].classList.remove('alert-danger');
        div[0].classList.add('alert-primary');
      }
      div[0].style.display = "block";
      div[0].innerText = message;
      setTimeout(function () {
        div[0].style.display = "none";
      }, 8000);
    }
  }
};
},{"./checkformsubmited":8}],6:[function(require,module,exports) {
'use strict';

var _markers = require('./markers');

var _socket = require('./socket');

var _disconnected = require('./disconnected');

module.exports = {
  handleDisconnect: _socket.socket.on('disconnectId', function (data) {
    db.collection('onlineusers').where('socketid', '==', data.disconnetId).get().then(function (snapshot) {
      snapshot.docs.forEach(function (doc) {
        _markers.markersarray.forEach(function (marker) {
          if (marker.id == doc.data().userId) {
            marker.setMap(null);
            (0, _disconnected.disconnectedMessage)(marker.content + ' Disconnected');
          }
        });
      });
    });
  })
};
},{"./markers":11,"./socket":5,"./disconnected":9}],7:[function(require,module,exports) {
'use strict';

var _userId = require('./userId');

var idtostring = String(_userId.id);
module.exports = {
  showPosition:
  //  update it main functionality
  function showPosition(position) {
    // find user by userId
    db.collection('geolocation').where('userId', '==', idtostring).get().then(function (snapshot) {
      snapshot.docs.forEach(function (doc) {
        var userId = doc.id;
        // update location 
        db.collection('geolocation').doc(userId).update({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    });
  }
};
},{"./userId":4}],1:[function(require,module,exports) {
'use strict';

var _formhandle = require('./formhandle');

var _formhandle2 = _interopRequireDefault(_formhandle);

var _success = require('./success');

var _userId = require('./userId');

var _socket = require('./socket');

var _socket2 = _interopRequireDefault(_socket);

var _handledisconnect = require('./handledisconnect');

var _geolocationUpdate = require('./geolocationUpdate');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// get position of user every 2 seconds
if (navigator.geolocation) {
  setInterval(function () {
    navigator.geolocation.getCurrentPosition(_geolocationUpdate.showPosition);
  }, 2000);
} else {
  alert('Geolocation is not supported by this browser.');
}

db.collection('geolocation').onSnapshot(function (snapshot) {
  var num = snapshot.docs.length;
  var changes = snapshot.docChanges();
  if (changes.length > 1) {
    changes.forEach(function (change) {
      if (change.type == 'added') {
        if (change.doc.data().userId == _userId.id == false) {
          (0, _success.alertMessage)(num + ' Joined In');
        }
      }
    });
  } else {
    changes.forEach(function (change) {
      if (change.type == 'added') {
        if (change.doc.data().userId == _userId.id == false) {
          (0, _success.alertMessage)(change.doc.data().name + ' Joined In');
        }
      }
    });
  }
});
},{"./formhandle":2,"./success":3,"./userId":4,"./socket":5,"./handledisconnect":6,"./geolocationUpdate":7}],18:[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = undefined || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '50244' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
      // Clear the console after HMR
      console.clear();
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},[18,1], null)
//# sourceMappingURL=/index.map