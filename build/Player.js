'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _presentationValidator = require('./presentationValidator');

var _presentationValidator2 = _interopRequireDefault(_presentationValidator);

var _PresentationLayout = require('./PresentationLayout');

var _PresentationLayout2 = _interopRequireDefault(_PresentationLayout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

    _this.state = {
      status: 'waiting',
      navigation: {},
      gui: {
        asideVisible: false
      }
    };

    if (props.presentation) {
      var valid = (0, _presentationValidator2.default)(props.presentation);
      if (valid) {
        _this.state.status = 'loaded';
        _this.state.presentation = props.presentation;
      } else {
        _this.state.status = 'error';
      }
    }
    return _this;
  }

  _createClass(QuinoaPresentationPlayer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.state.presentation) {
        this.setCurrentSlide(this.state.presentation.order[0]);
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      return true;
    }
  }, {
    key: 'initPresentation',
    value: function initPresentation(presentation) {
      var valid = (0, _presentationValidator2.default)(presentation);
      if (valid) {
        this.setState({
          status: 'loaded',
          presentation: presentation
        });
      } else {
        this.setState({
          status: 'error'
        });
      }
    }
  }, {
    key: 'renderComponent',
    value: function renderComponent() {
      if (this.state.presentation && this.state.status === 'loaded') {
        return _react2.default.createElement(_PresentationLayout2.default, {
          presentation: this.state.presentation,
          navigation: this.state.navigation,
          setCurrentSlide: this.setCurrentSlide,
          stepSlide: this.stepSlide,
          toggleAside: this.toggleAside,
          gui: this.state.gui
        })

        // PresentationLayout({
        //   presentation: this.state.presentation,
        //   navigation: this.state.navigation,
        //   setCurrentSlide: this.setCurrentSlide,
        //   stepSlide: this.stepSlide,
        //   toggleAside: this.toggleAside,
        //   gui: this.state.gui
        // })
        ;
      } else if (this.status === 'error') {
        return _react2.default.createElement(
          'div',
          null,
          'Oups'
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
      if (this.state.presentation.slides[id]) {
        this.setState({
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
        newSlidePosition = this.state.navigation.position < this.state.presentation.order.length - 1 ? this.state.navigation.position + 1 : 0;
      } else {
        newSlidePosition = this.state.navigation.position > 0 ? this.state.navigation.position - 1 : this.state.presentation.order.length - 1;
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
      return _react2.default.createElement(
        'div',
        { className: 'quinoa-presentation-player' },
        this.renderComponent()
      );
    }
  }]);

  return QuinoaPresentationPlayer;
}(_react.Component);

QuinoaPresentationPlayer.propTypes = {
  // presentation: PropTypes.Object,
  allowDataExploration: _react.PropTypes.bool, // whether users can pan/zoom/navigate inside view
  onSlideChange: _react.PropTypes.func };

exports.default = QuinoaPresentationPlayer;