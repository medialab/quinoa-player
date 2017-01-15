'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = validatePresentationData;

var _presentationModel = require('./presentationModel.json');

var _presentationModel2 = _interopRequireDefault(_presentationModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

var validateEntity = {};

var validateObject = function validateObject(model, obj) {
  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
    return false;
  }
  if (model.keys) {
    var keys = Object.keys(model.keys);
    // case non-controlled keys (i.e. uuids)
    if (keys.indexOf('$each') > -1) {
      var keyType = model.keys.$each.keyType;
      if (keyType === 'uuid') {
        var _invalidKey = Object.keys(obj).find(function (key) {
          return uuidRegex.test(key) === false;
        });
        // some keys are not uuid
        if (_invalidKey !== undefined) {
          return false;
        }
      }
      var invalidKey = Object.keys(obj).find(function (objKey) {
        return !validateEntity(model.keys.$each, obj[objKey]);
      });
      return invalidKey === undefined;
    } else {
      // looking for any invalid key in the object
      var _invalidKey2 = keys.find(function (modelKey) {
        var isRequired = model.keys[modelKey].required;
        // the object has the prop or the prop is not required
        if (obj[modelKey] || !isRequired) {
          return !validateEntity(model.keys[modelKey], obj[modelKey]);
          // the object does not have the prop and it is required
        } else {
          return true;
        }
      });
      return _invalidKey2 === undefined;
    }
  }
  return true;
};

var validateArray = function validateArray(model, array) {
  if (!Array.isArray(array)) {
    return false;
  }
  if (model.children) {
    var invalidChild = array.find(function (child) {
      return validateEntity(model.children, child) === false;
    });
    return invalidChild === undefined;
  }
  return true;
};

var validateString = function validateString(model, entity, regex) {
  if (typeof entity !== 'string') {
    return false;
  }
  if (model.possibleValues) {
    return model.possibleValues.indexOf(entity) > -1;
  }
  if (regex) {
    return regex.test(entity);
  }
  return true;
};

validateEntity = function validateEntity(model, entity) {
  if (entity === undefined && !model.required) {
    return true;
  }
  var dataType = model.type;
  if (Array.isArray(dataType)) {
    // guess datatype
    if (typeof entity === 'string') {
      dataType = uuidRegex.test(entity) ? 'uuid' : 'string';
    } else if (typeof entity === 'number') {
      dataType = 'number';
    } else if ((typeof entity === 'undefined' ? 'undefined' : _typeof(entity)) === 'object') {
      if (Array.isArray(entity)) {
        dataType = 'array';
      } else {
        dataType = 'object';
      }
    }
  }
  switch (dataType) {
    case 'object':
      return validateObject(model, entity);
    case 'string':
      return validateString(model, entity);
    case 'uuid':
      return validateString(model, entity, uuidRegex);
    case 'array':
      return validateArray(model, entity);
    default:
      return true;
  }
};

function validatePresentationData(data) {
  return validateEntity(_presentationModel2.default, data);
}