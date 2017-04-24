'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _StepperLayout = require('./templates/stepper/StepperLayout');

var _StepperLayout2 = _interopRequireDefault(_StepperLayout);

var _ScrollerLayout = require('./templates/scroller/ScrollerLayout');

var _ScrollerLayout2 = _interopRequireDefault(_ScrollerLayout);

var _quinoaVisModules = require('quinoa-vis-modules');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint react/no-did-mount-set-state : 0 */


require('./Player.scss');

var QuinoaPresentationPlayer = function (_Component) {
  _inherits(QuinoaPresentationPlayer, _Component);

  function QuinoaPresentationPlayer(props) {
    _classCallCheck(this, QuinoaPresentationPlayer);

    var _this = _possibleConstructorReturn(this, (QuinoaPresentationPlayer.__proto__ || Object.getPrototypeOf(QuinoaPresentationPlayer)).call(this, props));

    _this.initPresentation = _this.initPresentation.bind(_this);
    _this.renderComponent = _this.renderComponent.bind(_this);

    _this.setCurrentSlide = _this.setCurrentSlide.bind(_this);
    _this.stepSlide = _this.stepSlide.bind(_this);
    _this.toggleAside = _this.toggleAside.bind(_this);
    _this.resetView = _this.resetView.bind(_this);
    _this.onUserViewChange = _this.onUserViewChange.bind(_this);
    _this.toggleInteractionMode = _this.toggleInteractionMode.bind(_this);

    var initialState = {
      status: 'waiting',
      navigation: {},
      gui: {
        asideVisible: false,
        interactionMode: 'read'
      },
      datasets: {},
      activeViewsParameters: {}
    };

    if (props.presentation) {
      initialState.status = 'loaded';
      initialState.presentation = props.presentation;
    }

    _this.state = initialState;
    return _this;
  }

  _createClass(QuinoaPresentationPlayer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      if (this.state.presentation) {
        if (this.state.presentation.order && this.state.presentation.order.length) {
          var beginAt = this.props.beginAt && this.props.beginAt < this.state.presentation.order.length ? this.props.beginAt : 0;
          this.setCurrentSlide(this.state.presentation.order[beginAt]);
        } else {
          var datasets = {};
          var views = this.state.presentation.visualizations;
          Object.keys(views).map(function (viewKey) {
            var view = views[viewKey];
            var visualization = _this2.state.presentation.visualizations[viewKey];
            var visType = visualization.metadata.visualizationType;
            var dataset = visualization.data;
            var mappedData = void 0;
            switch (visType) {
              case 'map':
                mappedData = (0, _quinoaVisModules.mapMapData)(dataset, view.flattenedDataMap);
                break;
              case 'timeline':
                mappedData = (0, _quinoaVisModules.mapTimelineData)(dataset, view.flattenedDataMap);
                break;
              case 'network':
                mappedData = (0, _quinoaVisModules.mapNetworkData)(dataset, view.flattenedDataMap);
                break;
              default:
                break;
            }
            datasets[viewKey] = mappedData;
          });
          this.setState({
            activeViewsParameters: _extends({}, this.state.presentation.visualizations),
            datasets: datasets
          });
        }
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      return true;
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {
      var _this3 = this;

      var slide = nextState.currentSlide;
      var previousSlide = this.state.currentSlide;
      var slideParamsMark = slide && Object.keys(slide.views).map(function (viewKey) {
        return slide.views[viewKey] && slide.views[viewKey].viewParameters && slide.views[viewKey].viewParameters.flattenedDataMap;
      });
      var previousSlideParamsMark = previousSlide && Object.keys(previousSlide.views).map(function (viewKey) {
        return previousSlide.views[viewKey] && previousSlide.views[viewKey].viewParameters && previousSlide.views[viewKey].viewParameters.flattenedDataMap;
      });
      if (JSON.stringify(slideParamsMark) !== JSON.stringify(previousSlideParamsMark)) {
        var datasets = {};
        var views = slide ? slide.views : nextState.presentation.visualizations;
        Object.keys(views).map(function (viewKey) {
          var view = views[viewKey];
          var viewDataMap = Object.keys(view.viewParameters.dataMap).reduce(function (result, collectionId) {
            return _extends({}, result, _defineProperty({}, collectionId, Object.keys(view.viewParameters.dataMap[collectionId]).reduce(function (propsMap, parameterId) {
              var parameter = view.viewParameters.dataMap[collectionId][parameterId];
              if (parameter.mappedField) {
                return _extends({}, propsMap, _defineProperty({}, parameterId, parameter.mappedField));
              }
              return propsMap;
            }, {})));
          }, {});
          var visualization = _this3.state.presentation.visualizations[viewKey];
          var visType = visualization.metadata.visualizationType;
          var dataset = visualization.data;
          var mappedData = void 0;
          switch (visType) {
            case 'map':
              mappedData = (0, _quinoaVisModules.mapMapData)(dataset, viewDataMap);
              break;
            case 'timeline':
              mappedData = (0, _quinoaVisModules.mapTimelineData)(dataset, viewDataMap);
              break;
            case 'network':
              mappedData = (0, _quinoaVisModules.mapNetworkData)(dataset, viewDataMap);
              break;
            default:
              break;
          }
          datasets[viewKey] = mappedData;
        });
        this.setState({
          datasets: datasets
        });
      }
      var slideViewParamsMark = previousSlide && Object.keys(previousSlide.views).map(function (viewKey) {
        return previousSlide.views[viewKey];
      });
      var activeViewParamsMark = slide && Object.keys(slide.views).map(function (viewKey) {
        return _this3.state.activeViewsParameters[viewKey];
      });
      if (previousSlide && JSON.stringify(slideViewParamsMark) !== JSON.stringify(activeViewParamsMark) && !this.state.viewDifferentFromSlide) {
        this.setState({
          viewDifferentFromSlide: true
        });
      }
    }
  }, {
    key: 'onUserViewChange',
    value: function onUserViewChange(viewKey, viewParameters) {
      this.setState({
        activeViewsParameters: _extends({}, this.state.activeViews, _defineProperty({}, viewKey, { viewParameters: viewParameters }))
      });
    }
  }, {
    key: 'resetView',
    value: function resetView() {
      var slide = this.state.currentSlide;
      if (slide) {
        var activeViewsParameters = Object.keys(slide.views).reduce(function (result, viewKey) {
          return _extends({}, result, _defineProperty({}, viewKey, { viewParameters: slide.views[viewKey].viewParameters }));
        }, {});
        this.setState({
          activeViewsParameters: activeViewsParameters,
          viewDifferentFromSlide: false
        });
      } else {
        var visualizations = this.state.presentation.visualizations;
        var _activeViewsParameters = Object.keys(visualizations).reduce(function (result, viewKey) {
          return _extends({}, result, _defineProperty({}, viewKey, { viewParameters: visualizations[viewKey].viewParameters }));
        }, {});
        this.setState({
          activeViewsParameters: _activeViewsParameters,
          viewDifferentFromSlide: false
        });
      }
    }
  }, {
    key: 'initPresentation',
    value: function initPresentation(presentation) {
      // const valid = validate(presentation);
      // if (valid) {
      this.setState({
        status: 'loaded',
        presentation: presentation
      });
      //    }
      // else {
      //      this.setState({
      //        status: 'error'
      //      });
      //    }
    }
  }, {
    key: 'toggleInteractionMode',
    value: function toggleInteractionMode(to) {
      this.setState({
        gui: _extends({}, this.state.gui, {
          interactionMode: to
        })
      });
    }
  }, {
    key: 'renderComponent',
    value: function renderComponent() {
      var _props = this.props,
          _props$options = _props.options,
          options = _props$options === undefined ? {} : _props$options,
          _props$template = _props.template,
          template = _props$template === undefined ? 'stepper' : _props$template;

      if (this.state.presentation && this.state.status === 'loaded') {
        switch (template) {
          case 'scroller':
            return _react2.default.createElement(_ScrollerLayout2.default, {
              currentSlide: this.state.currentSlide,
              activeViewsParameters: this.state.activeViewsParameters,
              viewDifferentFromSlide: this.state.viewDifferentFromSlide,
              datasets: this.state.datasets,
              presentation: this.state.presentation,
              navigation: this.state.navigation,
              setCurrentSlide: this.setCurrentSlide,
              stepSlide: this.stepSlide,
              toggleAside: this.toggleAside,
              gui: this.state.gui,
              options: options,
              resetView: this.resetView,
              onUserViewChange: this.onUserViewChange,
              toggleInteractionMode: this.toggleInteractionMode,
              onExit: this.props.onExit });
          case 'stepper':
          default:
            return _react2.default.createElement(_StepperLayout2.default, {
              currentSlide: this.state.currentSlide,
              activeViewsParameters: this.state.activeViewsParameters,
              viewDifferentFromSlide: this.state.viewDifferentFromSlide,
              datasets: this.state.datasets,
              presentation: this.state.presentation,
              navigation: this.state.navigation,
              setCurrentSlide: this.setCurrentSlide,
              stepSlide: this.stepSlide,
              toggleAside: this.toggleAside,
              gui: this.state.gui,
              options: options,
              resetView: this.resetView,
              onUserViewChange: this.onUserViewChange });
        }
      } else if (this.status === 'error') {
        return _react2.default.createElement(
          'div',
          null,
          'Oups, that looks like an error'
        );
      } else {
        return _react2.default.createElement(
          'div',
          null,
          'No data yet'
        );
      }
    }
  }, {
    key: 'setCurrentSlide',
    value: function setCurrentSlide(id) {
      var slide = this.state.presentation.slides[id];
      if (slide) {
        var activeViewsParameters = Object.keys(slide.views).reduce(function (result, viewKey) {
          return _extends({}, result, _defineProperty({}, viewKey, { viewParameters: slide.views[viewKey].viewParameters }));
        }, {});
        this.setState({
          currentSlide: slide,
          viewDifferentFromSlide: false,
          activeViewsParameters: activeViewsParameters,
          navigation: _extends({}, this.state.navigation, {
            currentSlideId: id,
            position: this.state.presentation.order.indexOf(id),
            firstSlide: this.state.navigation.position === 0,
            lastSlide: this.state.navigation.position === this.state.presentation.order.length - 1
          })
        });
        if (this.props.onSlideChange) {
          this.props.onSlideChange(id);
        }
      }
    }
  }, {
    key: 'stepSlide',
    value: function stepSlide(forward) {
      var newSlidePosition = void 0;
      if (forward) {
        newSlidePosition = this.state.navigation.position < this.state.presentation.order.length - 1 ? this.state.navigation.position + 1 : this.state.navigation.position; // 0;
      } else {
        newSlidePosition = this.state.navigation.position > 0 ? this.state.navigation.position - 1 : this.state.navigation.position; // this.state.presentation.order.length - 1;
      }
      this.setCurrentSlide(this.state.presentation.order[newSlidePosition]);
    }
  }, {
    key: 'toggleAside',
    value: function toggleAside() {
      this.setState({
        gui: _extends({}, this.state.gui, {
          asideVisible: !this.state.gui.asideVisible
        })
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props$template2 = this.props.template,
          template = _props$template2 === undefined ? 'stepper' : _props$template2;

      return _react2.default.createElement(
        'div',
        { className: 'quinoa-presentation-player ' + template },
        this.renderComponent()
      );
    }
  }]);

  return QuinoaPresentationPlayer;
}(_react.Component);

QuinoaPresentationPlayer.propTypes = {
  // presentation: PropTypes.Object,
  options: _react.PropTypes.shape({
    allowViewExploration: _react.PropTypes.bool // whether users can pan/zoom/navigate inside view
  }),
  onSlideChange: _react.PropTypes.func };

exports.default = QuinoaPresentationPlayer;