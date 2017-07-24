'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactMarkdown = require('react-markdown');

var _reactMarkdown2 = _interopRequireDefault(_reactMarkdown);

var _reactKeyHandler = require('react-key-handler');

var _reactKeyHandler2 = _interopRequireDefault(_reactKeyHandler);

var _quinoaVisModules = require('quinoa-vis-modules');

require('./StepperLayout.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StepperLayout = function StepperLayout(_ref) {
  var activeViewsParameters = _ref.activeViewsParameters,
      datasets = _ref.datasets,
      presentation = _ref.presentation,
      navigation = _ref.navigation,
      setCurrentSlide = _ref.setCurrentSlide,
      stepSlide = _ref.stepSlide,
      toggleAside = _ref.toggleAside,
      asideVisible = _ref.gui.asideVisible,
      _ref$options$allowVie = _ref.options.allowViewExploration,
      allowViewExploration = _ref$options$allowVie === undefined ? true : _ref$options$allowVie,
      onUserViewChange = _ref.onUserViewChange;

  var next = function next() {
    return !presentation.lastSlide && stepSlide(true);
  };
  var prev = function prev() {
    return !presentation.firstSlide && stepSlide(false);
  };
  var css = presentation.settings && presentation.settings.css || '';
  return _react2.default.createElement(
    'figure',
    { className: 'wrapper' },
    _react2.default.createElement(
      'figcaption',
      { className: 'caption-container' },
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
        navigation.currentSlideId ? _react2.default.createElement(
          'div',
          { className: 'slide-caption-container' },
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
                  return setCurrentSlide(id);
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
                        slide.title
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
            { className: 'slide-caption' },
            _react2.default.createElement(
              'h2',
              { className: 'slide-title' },
              presentation.slides[navigation.currentSlideId].title
            ),
            _react2.default.createElement(
              'section',
              { className: 'slide-content' },
              presentation.slides[navigation.currentSlideId].markdown.length ? _react2.default.createElement(_reactMarkdown2.default, { source: presentation.slides[navigation.currentSlideId].markdown }) : _react2.default.createElement(
                'p',
                { className: 'placeholder-text' },
                'No comments'
              )
            ),
            presentation.order.indexOf(navigation.currentSlideId) < presentation.order.length - 1 ? _react2.default.createElement(
              'button',
              { className: 'next-slide-btn', onClick: next },
              'Next slide (\u2193)'
            ) : null
          )
        ) : _react2.default.createElement(
          'p',
          null,
          'No slide to display'
        ),
        _react2.default.createElement(
          'div',
          { className: 'slide-legend-container' },

          // legend
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
                        _react2.default.createElement('span', { className: 'color',
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
          case 'svg':
            Component = _quinoaVisModules.SVGViewer;
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
                data: dataset || visualization.data,
                viewParameters: activeViewsParameters[viewKey].viewParameters,
                allowUserViewChange: allowViewExploration,
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
};

StepperLayout.propTypes = {
  /**
   * The presentation to display
   */
  presentation: _propTypes2.default.object.isRequired,
  /**
   * The current slide being displayed by the component
   */
  currentSlide: _propTypes2.default.object,
  /**
   * Parameters describing current view's state
   */
  activeViewsParameters: _propTypes2.default.object,
  /**
   * Whether the current view parameters match with current slide's view parameters
   */
  viewDifferentFromSlide: _propTypes2.default.bool,
  /**
   * The transformed datasets to use for displaying visualizations
   */
  datasets: _propTypes2.default.object,
  /**
   * Navigation state description
   */
  navigation: _propTypes2.default.shape({
    /**
     * What is the active slide's id
     */
    currentSlideId: _propTypes2.default.string,
    /**
     * What is the active slide's rank in slides list
     */
    position: _propTypes2.default.number,
    /**
     * Whether active slide is the first
     */
    firstSlide: _propTypes2.default.bool,
    /**
     * Whether active slide is the last
     */
    lastSlide: _propTypes2.default.bool

  }),
  /**
   * Callbacks when user asks to jump to a specific slide
   */
  setCurrentSlide: _propTypes2.default.func,
  /**
   * Callbacks when user asks to step forward or backward in slides order
   */
  stepSlide: _propTypes2.default.func,
  /**
   * Callbacks to change the display of presentation's metadata/details in aside
   */
  toggleAside: _propTypes2.default.func,
  /**
   * Interface state description
   */
  gui: _propTypes2.default.shape({
    /**
     * Whether aside displays list of slides or presentation's metadata/details
     */
    asideVisible: _propTypes2.default.bool,
    /**
     * Whether user is allowed to explore the view or can just navigate into slides' views
     */
    interactionMode: _propTypes2.default.oneOf(['read', 'explore'])
  }),
  /**
   * Component global options
   */
  options: _propTypes2.default.shape({
    /**
     * declares whether users can pan/zoom/navigate inside the view
     * or if the view is strictly controlled by current slide's parameters
     */
    allowViewExploration: _propTypes2.default.bool
  }),
  /**
   * Callbacks when user tries to reset view to current slide's view parameters
   */
  resetView: _propTypes2.default.func,
  /**
   * Callbacks when user changes view manually
   */
  onUserViewChange: _propTypes2.default.func,
  /**
   * Hook to switch between "read" and "explore" interaction modes
   */
  toggleInteractionMode: _propTypes2.default.func,
  /**
   * Trigger to call when user interacts to exit the presentation
   */
  onExit: _propTypes2.default.func
};

exports.default = StepperLayout;