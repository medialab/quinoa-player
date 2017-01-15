'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactMarkdown = require('react-markdown');

var _reactMarkdown2 = _interopRequireDefault(_reactMarkdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PresentationLayout = function PresentationLayout(_ref) {
  var presentation = _ref.presentation,
      navigation = _ref.navigation,
      setCurrentSlide = _ref.setCurrentSlide,
      stepSlide = _ref.stepSlide,
      toggleAside = _ref.toggleAside,
      asideVisible = _ref.gui.asideVisible;

  var next = function next() {
    return !presentation.lastSlide && stepSlide(true);
  };
  var prev = function prev() {
    return !presentation.firstSlide && stepSlide(false);
  };
  return _react2.default.createElement(
    'div',
    { className: 'wrapper' },
    _react2.default.createElement(
      'aside',
      { className: asideVisible ? 'visible' : 'hidden' },
      _react2.default.createElement(
        'div',
        { className: 'metadata' },
        _react2.default.createElement(
          'h1',
          null,
          presentation.metadata.title || 'Quinoa'
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'summary' },
        _react2.default.createElement(
          'ul',
          null,
          presentation.order.map(function (id, index) {
            var slide = presentation.slides[id];
            var onSlideClick = function onSlideClick() {
              return setCurrentSlide(id);
            };
            return _react2.default.createElement(
              'li',
              { onClick: onSlideClick, key: index, className: navigation.currentSlideId === id ? 'active' : 'inactive' },
              _react2.default.createElement(
                'h3',
                null,
                slide.title
              )
            );
          })
        )
      ),
      _react2.default.createElement('div', { onClick: toggleAside, className: 'aside-toggler' })
    ),
    navigation.currentSlideId ? _react2.default.createElement(
      'figure',
      null,
      _react2.default.createElement(
        'div',
        { className: 'views-container' },
        Object.keys(presentation.visualizations).map(function (viewKey) {
          var visualization = presentation.visualizations[viewKey];
          var viewState = presentation.slides[navigation.currentSlideId].views[viewKey];
          return _react2.default.createElement(
            'div',
            { className: 'view-container', id: viewKey, key: viewKey },
            _react2.default.createElement(
              'div',
              { className: 'view-header' },
              _react2.default.createElement(
                'h3',
                null,
                visualization.metadata.title
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'view-body' },
              JSON.stringify(viewState.viewParameters, null, 2)
            )
          );
        })
      ),
      _react2.default.createElement(
        'figcaption',
        { className: 'caption-container' },
        _react2.default.createElement(
          'div',
          { className: 'caption-header' },
          _react2.default.createElement(
            'button',
            { onClick: prev, className: presentation.firstSlide ? 'inactive' : '' },
            'Previous slide'
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'caption-main' },
          _react2.default.createElement(
            'div',
            { className: 'caption-header' },
            _react2.default.createElement(
              'h2',
              null,
              presentation.slides[navigation.currentSlideId].title
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'caption-content' },
            _react2.default.createElement(_reactMarkdown2.default, { source: presentation.slides[navigation.currentSlideId].markdown })
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'caption-footer' },
          _react2.default.createElement(
            'button',
            { onClick: next, className: presentation.lastSlide ? 'inactive' : '' },
            'Next slide'
          )
        )
      )
    ) : '',
    _react2.default.createElement('div', { className: 'aside-bg' + (asideVisible ? ' active' : ' inactive'), onClick: toggleAside })
  );
};

exports.default = PresentationLayout;