'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = undefined;

var _Player = require('./Player');

var _Player2 = _interopRequireDefault(_Player);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var templateInfo = [require('./templates/scroller/info'), require('./templates/stepper/info')];

var templates = exports.templates = templateInfo;

exports.default = _Player2.default;