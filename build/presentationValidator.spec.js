'use strict';

var _chai = require('chai');

var _presentationValidator = require('./presentationValidator');

var _presentationValidator2 = _interopRequireDefault(_presentationValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var validPresentations = [{
  metadata: {
    title: 'A good presentation'
  },
  datasets: {
    '23d2b06d-bb5d-4a23-b0e6-0330a65c0cd1': {
      metadata: {
        title: 'a first dataset',
        format: 'json'
      },
      data: [{
        name: 'A first object',
        lat: 2.8,
        lng: 3.2
      }, {
        name: 'A second object',
        lat: 2.3,
        lng: 3.6
      }]
    }
  },
  visualizations: {
    'f8920ce3-b77a-407e-90eb-1b1c831455fe': {
      metadata: {
        title: 'My good view',
        visualizationType: 'map'
      },
      datasets: ['23d2b06d-bb5d-4a23-b0e6-0330a65c0cd1']
    }
  },
  slides: {
    'ae815661-1cff-499a-9d1a-ed550aa468f3': {
      id: 'ae815661-1cff-499a-9d1a-ed550aa468f3',
      views: {
        'f8920ce3-b77a-407e-90eb-1b1c831455fe': {
          viewParameters: {
            zoom: 3,
            latitude: 2.1,
            longitude: 3.1
          },
          viewDataMap: [{
            inputKey: 'name',
            outputKey: 'title'
          }, {
            inputKey: 'lat',
            outputKey: 'latitude'
          }, {
            inputKey: 'lng',
            outputKey: 'longitude'
          }]
        }
      },
      title: 'My first slide',
      markdown: 'An *italic* comment'
    },
    '7001c8d8-d2db-489d-80cc-6bf11ee87689': {
      id: '7001c8d8-d2db-489d-80cc-6bf11ee87689',
      views: {
        'f8920ce3-b77a-407e-90eb-1b1c831455fe': {
          viewParameters: {
            zoom: 3,
            latitude: 2.1,
            longitude: 3.1
          },
          viewDataMap: [{
            inputKey: 'name',
            outputKey: 'title'
          }, {
            inputKey: 'lat',
            outputKey: 'latitude'
          }, {
            inputKey: 'lng',
            outputKey: 'longitude'
          }]
        }
      },
      title: 'My second slide',
      markdown: 'A **bold** comment'
    }
  },
  order: ['7001c8d8-d2db-489d-80cc-6bf11ee87689', 'ae815661-1cff-499a-9d1a-ed550aa468f3']
}];
var invalidPresentations = [Object.assign({}, validPresentations[0], { order: undefined })];

describe('presentationValidator', function () {
  it('should successfully parse valid presentations', function (done) {
    validPresentations.forEach(function (presentation) {
      var validated = (0, _presentationValidator2.default)(presentation);
      return (0, _chai.expect)(validated).to.be.true;
    });
    done();
  });

  it('should successfully parse presentations with missing titles', function (done) {

    done();
  });

  it('should refuse presentations with missing fields', function (done) {
    invalidPresentations.forEach(function (presentation) {
      var validated = (0, _presentationValidator2.default)(presentation);
      return (0, _chai.expect)(validated).to.be.false;
    });
    done();
  });

  // todo
  // it('should refuse presentations with non-matching uuids', done => {
  //   done();
  // });


  // it('', done => {
  //  done();
  // });
});