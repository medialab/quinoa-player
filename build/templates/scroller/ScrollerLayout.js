'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactMarkdown = require('react-markdown');

var _reactMarkdown2 = _interopRequireDefault(_reactMarkdown);

var _reactKeyHandler = require('react-key-handler');

var _reactKeyHandler2 = _interopRequireDefault(_reactKeyHandler);

var _d3Ease = require('d3-ease');

var _d3Interpolate = require('d3-interpolate');

var _d3Timer = require('d3-timer');

var _quinoaVisModules = require('quinoa-vis-modules');

require('./ScrollerLayout.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } 


function getElementsByClassName(className, inputEl) {
  var el = inputEl;
  if (typeof inputEl === 'string') {
    el = document.getElementById(inputEl);
  }
  if (!inputEl) {
    el = document;
  }
  if (el.getElementsByClassName) {
    return el.getElementsByClassName(className);
  }
  var elements = [];
  var allEls = el.getElementsByTagName('*');
  for (var i = 0; i < allEls.length; i++) {
    if (allEls[i].className.split(' ').indexOf(className) > -1) {
      elements.push(allEls[i]);
    }
  }
  return elements;
}

var ScrollerLayout = function (_Component) {
  _inherits(ScrollerLayout, _Component);

  function ScrollerLayout(props) {
    _classCallCheck(this, ScrollerLayout);

    var _this = _possibleConstructorReturn(this, (ScrollerLayout.__proto__ || Object.getPrototypeOf(ScrollerLayout)).call(this, props));

    _this.transition = null;
    _this.state = {
      scrollTop: 0,
      initiated: false
    };
    _this.scrollToSlide = _this.scrollToSlide.bind(_this);
    return _this;
  }


  _createClass(ScrollerLayout, [{
    key: 'componentWillUpdate',
    value: function componentWillUpdate() {
      if (this.captionContainer && !this.state.initiated) {
        this.setState({
          scrollTop: this.captionContainer.offsetHeight / 2,
          initiated: true
        });
      }
    }

  }, {
    key: 'scrollToSlide',
    value: function scrollToSlide(id) {
      var _this2 = this;

      this.props.setCurrentSlide(id);
      var targetEl = document.getElementById(id);
      var target = this.captionContainer.offsetHeight / 2 - targetEl.offsetTop;
      var transitionsDuration = 500; 
      var interpTop = (0, _d3Interpolate.interpolateNumber)(this.state.scrollTop, target);
      var onTick = function onTick(elapsed) {
        var t = elapsed < transitionsDuration ? (0, _d3Ease.easeCubic)(elapsed / transitionsDuration) : 1;
        var scrollTop = interpTop(t);
        _this2.setState({
          scrollTop: scrollTop
        });
        if (t >= 1 && _this2.transition) {
          _this2.transition.stop();
          _this2.transition = null;
        }
      };
      if (this.transition === null) {
        this.transition = (0, _d3Timer.timer)(onTick);
      }
    }

  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          activeViewsParameters = _props.activeViewsParameters,
          datasets = _props.datasets,
          presentation = _props.presentation,
          navigation = _props.navigation,
          setCurrentSlide = _props.setCurrentSlide,
          stepSlide = _props.stepSlide,
          toggleAside = _props.toggleAside,
          _props$gui = _props.gui,
          asideVisible = _props$gui.asideVisible,
          _props$gui$interactio = _props$gui.interactionMode,
          interactionMode = _props$gui$interactio === undefined ? 'read' : _props$gui$interactio,
          _props$options$allowV = _props.options.allowViewExploration,
          allowViewExploration = _props$options$allowV === undefined ? true : _props$options$allowV,
          toggleInteractionMode = _props.toggleInteractionMode,
          onUserViewChange = _props.onUserViewChange,
          onExit = _props.onExit;


      var next = function next() {
        return !presentation.lastSlide && stepSlide(true);
      };
      var prev = function prev() {
        return !presentation.firstSlide && stepSlide(false);
      };
      var onClickExplore = function onClickExplore() {
        return toggleInteractionMode('explore');
      };
      var onClickRead = function onClickRead() {
        return toggleInteractionMode('read');
      };

      var onWheel = function onWheel(e) {
        if (!_this3.captionContainer) {
          return;
        }
        var scrollTop = _this3.state.scrollTop - e.deltaY;
        var relScrollTop = _this3.captionContainer.offsetHeight * 0.6 - scrollTop;
        var anchorsEls = getElementsByClassName('slide-content', _this3.captionContainer); 
        var anchors = [];
        var activeId = void 0;
        var totalHeight = 0;
        for (var i = 0; i < anchorsEls.length; i++) {
          var anchor = anchorsEls[i];
          var top = anchor.offsetTop;
          var id = anchor.getAttribute('id');
          totalHeight += anchor.offsetHeight;
          if (relScrollTop > top) {
            activeId = id;
          }
          anchors.push({
            id: id,
            top: top
          });
        }
        if (scrollTop > _this3.captionContainer.offsetHeight / 2) {
          if (typeof onExit === 'function') {
            onExit('top');
          }
        } else if (-scrollTop > totalHeight) {
          if (typeof onExit === 'function') {
            onExit('bottom');
          }
        } else {
          if (activeId && navigation.currentSideId !== activeId) {
            setCurrentSlide(activeId);
          }
          _this3.setState({
            scrollTop: scrollTop
          });
        }
      };

      var onLegendWheel = function onLegendWheel(e) {
        e.stopPropagation();
      };

      var bindRef = function bindRef(component) {
        _this3.component = component;
      };
      var bindCaptionContainer = function bindCaptionContainer(captionContainer) {
        _this3.captionContainer = captionContainer;
      };

      var css = presentation.settings && presentation.settings.css || '';
      return _react2.default.createElement(
        'figure',
        { className: 'wrapper', onWheel: onWheel, ref: bindRef },
        _react2.default.createElement(
          'figcaption',
          { className: 'caption-container' + ' ' + interactionMode },
          _react2.default.createElement(
            'h1',
            { onClick: toggleAside, className: 'caption-header ' + (asideVisible ? 'active' : '') },
            _react2.default.createElement(
              'span',
              { className: 'presentation-title' },
              presentation.metadata.title || 'Quinoa'
            )
          ),
          asideVisible ? _react2.default.createElement(
            'div',
            { className: 'caption-body-info' },
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
              { className: 'datasets aside-group' },
              _react2.default.createElement(
                'h2',
                null,
                'About the data'
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
            )
          ) : _react2.default.createElement(
            'div',
            { className: 'caption-body-slide' },
            presentation.order.length > 0 && _react2.default.createElement(
              'ul',
              { className: 'read-mode-toggler' },
              _react2.default.createElement(
                'li',
                {
                  className: interactionMode === 'read' ? 'active' : '',
                  onClick: onClickRead },
                _react2.default.createElement(
                  'button',
                  null,
                  'Read'
                )
              ),
              _react2.default.createElement(
                'li',
                {
                  className: interactionMode === 'explore' ? 'active' : '',
                  onClick: onClickExplore },
                _react2.default.createElement(
                  'button',
                  null,
                  'Explore'
                )
              )
            ),

            navigation.currentSlideId && interactionMode === 'read' ? _react2.default.createElement(
              'div',
              { className: 'slide-caption-container', ref: bindCaptionContainer },
              presentation.order.length > 1 ? _react2.default.createElement(
                'nav',
                { className: 'nav-container' },
                _react2.default.createElement(
                  'button',
                  { className: 'nav-arrow', onClick: prev },
                  '\u25B2'
                ),
                _react2.default.createElement(
                  'ul',
                  { className: 'quick-nav' },
                  presentation.order.map(function (id, index) {
                    var slide = presentation.slides[id];
                    var onSlideClick = function onSlideClick() {
                      return _this3.scrollToSlide(id);
                    };
                    return _react2.default.createElement(
                      'li',
                      { onClick: onSlideClick, key: index, className: navigation.currentSlideId === id ? 'active' : 'inactive' },
                      _react2.default.createElement(
                        'h3',
                        null,
                        _react2.default.createElement(
                          'span',
                          { className: 'tooltip-container' },
                          _react2.default.createElement(
                            'span',
                            { className: 'tooltip-content' },
                            slide.title.length ? 
                            slide.title : slide.markdown ? _react2.default.createElement(_reactMarkdown2.default, { source: slide.markdown.split(' ').slice(0, 3).join(' ') + '...' }) : '...'
                          )
                        )
                      )
                    );
                  })
                ),
                _react2.default.createElement(
                  'button',
                  { className: 'nav-arrow', onClick: next },
                  '\u25BC'
                )
              ) : null,
              _react2.default.createElement(
                'article',
                {
                  className: 'slide-caption',
                  style: {
                    top: this.state.scrollTop + 'px'
                  } },
                presentation.order.map(function (id) {
                  var slide = presentation.slides[id];
                  var onSlideClick = function onSlideClick() {
                    return _this3.scrollToSlide(id);
                  };
                  return _react2.default.createElement(
                    'div',
                    {
                      key: id,
                      className: 'slide-content ' + (id === navigation.currentSlideId ? 'active' : ''),
                      id: id,
                      onClick: onSlideClick },
                    _react2.default.createElement(
                      'h2',
                      { className: 'slide-title' },
                      slide.title
                    ),
                    slide.markdown.length ? _react2.default.createElement(_reactMarkdown2.default, { source: slide.markdown }) : _react2.default.createElement(
                      'p',
                      { className: 'placeholder-text' },
                      'No comments'
                    )
                  );
                })
              )
            ) : _react2.default.createElement(
              'p',
              { className: 'no-slide' },
              !navigation.currentSlideId && 'No slide to display'
            ),
            _react2.default.createElement(
              'div',
              { className: 'slide-legend-container', onWheel: onLegendWheel },
              _react2.default.createElement(
                'h4',
                null,
                'Legend'
              ),

              navigation.currentSlideId && Object.keys(presentation.slides[navigation.currentSlideId].views).map(function (viewId) {
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
                        Object.keys(presentation.slides[navigation.currentSlideId].views[viewId].viewParameters.colorsMap[collectionId]).filter(function (category) {
                          return category !== 'default';
                        }).map(function (category) {
                          return _react2.default.createElement(
                            'li',
                            { className: 'legend-item', key: category },
                            _react2.default.createElement('span', {
                              className: 'color',
                              style: {
                                background: presentation.slides[navigation.currentSlideId].views[viewId].viewParameters.colorsMap[collectionId][category],
                                opacity: presentation.slides[navigation.currentSlideId].views[viewId].viewParameters.shownCategories && presentation.slides[navigation.currentSlideId].views[viewId].viewParameters.shownCategories[collectionId].indexOf(category) === -1 ? 0.3 : 1
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
            )
          )
        ),
        activeViewsParameters ? _react2.default.createElement(
          'div',
          { className: 'views-container' },
          Object.keys(presentation.visualizations).map(function (viewKey) {
            var visualization = presentation.visualizations[viewKey];
            var visType = visualization.metadata.visualizationType;
            var dataset = datasets[viewKey];
            var VisComponent = _react2.default.createElement('span', null);
            switch (visType) {
              case 'timeline':
                VisComponent = _quinoaVisModules.Timeline;
                break;
              case 'map':
                VisComponent = _quinoaVisModules.Map;
                break;
              case 'network':
                VisComponent = _quinoaVisModules.Network;
                break;
              case 'svg':
                VisComponent = _quinoaVisModules.SVGViewer;
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
                { className: 'view-container ' + visType, id: viewKey, key: viewKey },
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
                  _react2.default.createElement(VisComponent, {
                    data: dataset,
                    viewParameters: activeViewsParameters[viewKey].viewParameters,
                    allowUserViewChange: allowViewExploration && interactionMode === 'explore',
                    onUserViewChange: onViewChange })
                )
              );
            }
          })
        ) : null,
        _react2.default.createElement('div', { className: 'aside-bg' + (asideVisible ? ' active' : ' inactive'), onClick: toggleAside }),
        _react2.default.createElement(_reactKeyHandler2.default, { keyEventName: _reactKeyHandler.KEYDOWN, keyValue: 'ArrowUp', onKeyHandle: prev }),
        _react2.default.createElement(_reactKeyHandler2.default, { keyEventName: _reactKeyHandler.KEYDOWN, keyValue: 'ArrowDown', onKeyHandle: next }),
        _react2.default.createElement(_reactKeyHandler2.default, { keyEventName: _reactKeyHandler.KEYDOWN, keyValue: 'ArrowRight', onKeyHandle: toggleAside }),
        _react2.default.createElement(_reactKeyHandler2.default, { keyEventName: _reactKeyHandler.KEYDOWN, keyValue: 'ArrowLeft', onKeyHandle: toggleAside }),
        _react2.default.createElement(
          'style',
          null,
          css
        )
      );
    }
  }]);

  return ScrollerLayout;
}(_react.Component);



ScrollerLayout.propTypes = {
  presentation: _propTypes2.default.object.isRequired,
  currentSlide: _propTypes2.default.object,
  activeViewsParameters: _propTypes2.default.object,
  viewDifferentFromSlide: _propTypes2.default.bool,
  datasets: _propTypes2.default.object,
  navigation: _propTypes2.default.shape({
    currentSlideId: _propTypes2.default.string,
    position: _propTypes2.default.number,
    firstSlide: _propTypes2.default.bool,
    lastSlide: _propTypes2.default.bool

  }),
  setCurrentSlide: _propTypes2.default.func,
  stepSlide: _propTypes2.default.func,
  toggleAside: _propTypes2.default.func,
  gui: _propTypes2.default.shape({
    asideVisible: _propTypes2.default.bool,
    interactionMode: _propTypes2.default.oneOf(['read', 'explore'])
  }),
  options: _propTypes2.default.shape({
    allowViewExploration: _propTypes2.default.bool
  }),
  resetView: _propTypes2.default.func,
  onUserViewChange: _propTypes2.default.func,
  toggleInteractionMode: _propTypes2.default.func,
  onExit: _propTypes2.default.func
};

exports.default = ScrollerLayout;