'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactMarkdown = require('react-markdown');

var _reactMarkdown2 = _interopRequireDefault(_reactMarkdown);

var _quinoaVisModules = require('quinoa-vis-modules');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PresentationLayout = function PresentationLayout(_ref) {
  var currentSlide = _ref.currentSlide,
      activeViewsParameters = _ref.activeViewsParameters,
      viewDifferentFromSlide = _ref.viewDifferentFromSlide,
      datasets = _ref.datasets,
      presentation = _ref.presentation,
      navigation = _ref.navigation,
      setCurrentSlide = _ref.setCurrentSlide,
      stepSlide = _ref.stepSlide,
      toggleAside = _ref.toggleAside,
      asideVisible = _ref.gui.asideVisible,
      _ref$options$allowVie = _ref.options.allowViewExploration,
      allowViewExploration = _ref$options$allowVie === undefined ? true : _ref$options$allowVie,
      onUserViewChange = _ref.onUserViewChange,
      resetView = _ref.resetView;

  var next = function next() {
    return !presentation.lastSlide && stepSlide(true);
  };
  var prev = function prev() {
    return !presentation.firstSlide && stepSlide(false);
  };
  return _react2.default.createElement(
    'div',
    { className: 'wrapper' },
    currentSlide ? _react2.default.createElement(
      'figure',
      null,
      _react2.default.createElement(
        'div',
        { className: 'views-container' },
        Object.keys(presentation.visualizations).map(function (viewKey) {
          var visualization = presentation.visualizations[viewKey];
          var visType = visualization.metadata.visualizationType;
          var dataset = datasets[viewKey];
          var Component = _react2.default.createElement('span', null);
          switch (visType) {
            case 'timeline':
              Component = _quinoaVisModules.Timeline;
              break;
            case 'map':
              Component = _quinoaVisModules.Map;
              break;
            case 'network':
              Component = _quinoaVisModules.Network;
              break;
            default:
              break;
          }
          if (dataset) {
            var onViewChange = function onViewChange(e) {
              onUserViewChange(viewKey, e.viewParameters);
            };
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
                _react2.default.createElement(Component, {
                  data: dataset,
                  viewParameters: activeViewsParameters[viewKey].viewParameters,
                  allowUserViewChange: allowViewExploration,
                  onUserViewChange: onViewChange })
              )
            );
          }
        })
      ),
      _react2.default.createElement(
        'figcaption',
        { className: 'caption-container' },
        _react2.default.createElement(
          'div',
          { className: 'legend-container' },
          Object.keys(presentation.slides[navigation.currentSlideId].views).map(function (viewId) {
            return _react2.default.createElement(
              'div',
              { key: viewId, className: 'view-legend' },
              Object.keys(presentation.slides[navigation.currentSlideId].views[viewId].viewParameters.colorsMap).filter(function (collectionId) {
                return collectionId !== 'default';
              }).map(function (collectionId) {
                return _react2.default.createElement(
                  'div',
                  { className: 'collection-legend', key: collectionId },
                  Object.keys(presentation.slides[navigation.currentSlideId].views[viewId].viewParameters.colorsMap).length > 2 ? _react2.default.createElement(
                    'h4',
                    null,
                    collectionId
                  ) : null,
                  _react2.default.createElement(
                    'ul',
                    { className: 'legend-group' },
                    Object.keys(presentation.slides[navigation.currentSlideId].views[viewId].viewParameters.colorsMap[collectionId]).map(function (category) {
                      return _react2.default.createElement(
                        'li',
                        { className: 'legend-item', key: category },
                        _react2.default.createElement('span', { className: 'color',
                          style: {
                            background: presentation.slides[navigation.currentSlideId].views[viewId].viewParameters.colorsMap[collectionId][category]
                          } }),
                        _react2.default.createElement(
                          'span',
                          { className: 'category' },
                          category
                        )
                      );
                    })
                  )
                );
              })
            );
          })
        ),
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
          viewDifferentFromSlide ? _react2.default.createElement(
            'button',
            { onClick: resetView },
            'Reset'
          ) : '',
          _react2.default.createElement(
            'button',
            { onClick: next, className: presentation.lastSlide ? 'inactive' : '' },
            'Next slide'
          )
        )
      )
    ) : '',
    _react2.default.createElement(
      'aside',
      { className: asideVisible ? 'visible' : 'hidden' },
      _react2.default.createElement(
        'div',
        { className: 'metadata aside-group' },
        _react2.default.createElement(
          'h1',
          null,
          presentation.metadata.title || 'Quinoa'
        ),
        presentation.metadata.authors && presentation.metadata.authors.length ? _react2.default.createElement(
          'p',
          { className: 'authors-container' },
          'By ',
          presentation.metadata.authors.join(', ')
        ) : null,
        presentation.metadata.description ? _react2.default.createElement(
          'p',
          { className: 'description-container' },
          presentation.metadata.description
        ) : null
      ),
      _react2.default.createElement(
        'div',
        { className: 'summary aside-group' },
        _react2.default.createElement(
          'h2',
          null,
          'Summary'
        ),
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
      _react2.default.createElement(
        'div',
        { className: 'datasets aside-group' },
        _react2.default.createElement(
          'h2',
          null,
          'About data'
        ),
        Object.keys(presentation.datasets).map(function (dataKey) {
          return _react2.default.createElement(
            'div',
            { key: dataKey },
            _react2.default.createElement(
              'h3',
              null,
              presentation.datasets[dataKey].metadata.title
            ),
            presentation.datasets[dataKey].metadata.description ? _react2.default.createElement(
              'p',
              { className: 'dataset-description' },
              presentation.datasets[dataKey].metadata.description
            ) : null,
            presentation.datasets[dataKey].metadata.license ? _react2.default.createElement(
              'p',
              { className: 'dataset-license' },
              'License : ',
              presentation.datasets[dataKey].metadata.license
            ) : null
          );
        })
      ),
      _react2.default.createElement('div', { onClick: toggleAside, className: 'aside-toggler' })
    ),
    _react2.default.createElement('div', { className: 'aside-bg' + (asideVisible ? ' active' : ' inactive'), onClick: toggleAside })
  );
};

exports.default = PresentationLayout;