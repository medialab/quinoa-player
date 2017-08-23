/**
 * This module exports a stateful scroller layout component
 * ============
 * @module quinoa-presentation-player/templates/ScrollerLayout
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import KeyHandler, {KEYDOWN} from 'react-key-handler';

import {easeCubic} from 'd3-ease';
import {interpolateNumber} from 'd3-interpolate';
import {timer} from 'd3-timer';

import {
  Timeline,
  Map,
  Network,
  SVGViewer,
} from 'quinoa-vis-modules';

import './ScrollerLayout.scss';

/**
 * Retrieves a collection of dom elements by their class name
 * (this avoid to require jquery for this sole purpose)
 * (todo: this could be optimized) (todo: that could be stored separately in an utils script)
 * @param {string} className - the class name to search
 * @param {DOMElement} inputEl - the root DOM element to search into
 * @return {array<DOMElement>} elements - the elements returned by the query
 */
function getElementsByClassName(className, inputEl) {
    let el = inputEl;
    if (typeof inputEl === 'string') {
      el = document.getElementById(inputEl);
    }
    if (!inputEl) {
      el = document;
    }
    if (el.getElementsByClassName) {
      return el.getElementsByClassName(className);
    }
    const elements = [];
    const allEls = el.getElementsByTagName('*');
    for (let i = 0; i < allEls.length; i++) {
        if (allEls[i].className.split(' ').indexOf(className) > -1) {
          elements.push(allEls[i]);
        }
    }
    return elements;
}
/**
 * ScrollerLayout class for building a presentation-player react component instances
 */
class ScrollerLayout extends Component {
  /**
   * constructor
   * @param {object} props - properties given to instance at instanciation
   */
  constructor(props) {
    super(props);
    // the transition property shall be a timer function provided by d3-timer
    this.transition = null;
    /**
     * Initial state
     */
    this.state = {
      /**
       * Scroll position within the presentation
       */
      scrollTop: 0,
      /**
       * Whether component's caption container position has been initiated
       */
      initiated: false
    };
    this.scrollToSlide = this.scrollToSlide.bind(this);
  }
  /**
   * Executes code before component updates
   */
  componentWillUpdate() {
    // if the component is not initiated
    // we set the position of the scroll so
    // that the first slide comment is on center
    // of the screen
    if (this.captionContainer && !this.state.initiated) {
      this.setState({
        scrollTop: this.captionContainer.offsetHeight / 2,
        initiated: true
      });
    }
  }
  /**
   * Programmatically scrolls the component to a specific slide position
   * @param {string} id - id of the slide to scroll to
   */
  scrollToSlide(id) {
    this.props.setCurrentSlide(id);
    const targetEl = document.getElementById(id);
    // target is set so that the target slide will be on center of the screen
    const target = this.captionContainer.offsetHeight / 2 - targetEl.offsetTop;
    // prepare a transition to the new position
    const transitionsDuration = 500;// todo: parametrize that
    const interpTop = interpolateNumber(this.state.scrollTop, target);
    // timer fires onTick callbacks until it is told to stop
    const onTick = elapsed => {
      const t = elapsed < transitionsDuration ? easeCubic(elapsed / transitionsDuration) : 1;
      const scrollTop = interpTop(t);
      this.setState({
        scrollTop
      });
      // when elapsed time is greater to transition duration
      // stop the timer and unload it
      if (t >= 1 && this.transition) {
        this.transition.stop();
        this.transition = null;
      }
    };
    // this is a security to avoid creating several timers
    // (leak risk)
    if (this.transition === null) {
      this.transition = timer(onTick);
    }
  }
  /**
   * Renders the component
   * @return {ReactElement} component - the component react representation
   */
  render () {
    const {
      activeViewsParameters,
      datasets,
      presentation,
      navigation,
      setCurrentSlide,
      stepSlide,
      toggleAside,
      gui: {
        asideVisible,
        interactionMode = 'read'
      },
      options: {
        allowViewExploration = true
      },
      toggleInteractionMode,
      onUserViewChange,
      onExit,
      // resetView
    } = this.props;

    /**
     * Callbacks
     */
    const next = () => !presentation.lastSlide && stepSlide(true);
    const prev = () => !presentation.firstSlide && stepSlide(false);
    const onClickExplore = () => toggleInteractionMode('explore');
    const onClickRead = () => toggleInteractionMode('read');

    const onWheel = e => {
      if (!this.captionContainer) {
        return;
      }
      const scrollTop = this.state.scrollTop - e.deltaY;
      const relScrollTop = this.captionContainer.offsetHeight * 0.6 - scrollTop;
      const anchorsEls = getElementsByClassName('slide-content', this.captionContainer); // $(this.captionContainer).find('.slide-content') // document.getElementsByClassName('slide-content');
      const anchors = [];
      let activeId;
      let totalHeight = 0;
      for (let i = 0; i < anchorsEls.length; i++) {
        const anchor = anchorsEls[i];
        const top = anchor.offsetTop;
        const id = anchor.getAttribute('id');
        totalHeight += anchor.offsetHeight;
        if (relScrollTop > top) {
          activeId = id;
        }
        anchors.push({
          id,
          top
        });
      }
      if (scrollTop > this.captionContainer.offsetHeight / 2) {
        if (typeof onExit === 'function') {
          onExit('top');
        }
      }
      else if (-scrollTop > totalHeight) {
        if (typeof onExit === 'function') {
          onExit('bottom');
        }
      }
      else {
        if (activeId && navigation.currentSideId !== activeId) {
          setCurrentSlide(activeId);
        }
        this.setState({
          scrollTop
        });
      }
    };

    const onLegendWheel = e => {
      e.stopPropagation();
    };

    /**
     * References binding
     */
    const bindRef = component => {
      this.component = component;
    };
    const bindCaptionContainer = captionContainer => {
      this.captionContainer = captionContainer;
    };

    const css = presentation.settings && presentation.settings.css || '';
    return (
      <figure className="wrapper" onWheel={onWheel} ref={bindRef}>
        <figcaption className={'caption-container' + ' ' + interactionMode}>
          <h1 onClick={toggleAside} className={'caption-header ' + (asideVisible ? 'active' : '')}>
            <span className="presentation-title">{presentation.metadata.title || 'Quinoa'}</span>
          </h1>
          { // content of the aside can be the slides+ caption
            // or metadata about the presentation
            asideVisible ?
              <div className="caption-body-info">
                {/* todo: the metadata pannel should be refactored
                    as a separate component for better legibility
                 */}
                <div className="metadata aside-group">
                  <h1>{presentation.metadata.title || 'Quinoa'}</h1>
                  {
                  presentation.metadata.authors && presentation.metadata.authors.length ?
                    <p className="authors-container">
                      By {presentation.metadata.authors.join(', ')}
                    </p>
                  : null
                }
                  {
                  presentation.metadata.description ?
                    <p className="description-container">
                      {presentation.metadata.description}
                    </p>
                  : null
                }
                </div>
                <div className="datasets aside-group">
                  <h2>About the data</h2>
                  {
                  Object.keys(presentation.datasets)
                  .map(dataKey => (
                    <div key={dataKey}>
                      <h3>{presentation.datasets[dataKey].metadata.title}</h3>
                      {presentation.datasets[dataKey].metadata.description ? <p className="dataset-description">{presentation.datasets[dataKey].metadata.description}</p> : null}
                      {presentation.datasets[dataKey].metadata.license ? <p className="dataset-license">License : {presentation.datasets[dataKey].metadata.license}</p> : null}
                    </div>
                  ))
                }
                </div>
              </div>
            :
              <div className="caption-body-slide">
                {presentation.order.length > 0 &&
                <ul className="read-mode-toggler">
                  <li
                    className={interactionMode === 'read' ? 'active' : ''}
                    onClick={onClickRead}>
                    <button>Read</button>
                  </li>
                  <li
                    className={interactionMode === 'explore' ? 'active' : ''}
                    onClick={onClickExplore}>
                    <button>Explore</button>
                  </li>
                </ul>}
                {
                  // slide captions container
                  // todo: refactor it as a separated component
                  navigation.currentSlideId && interactionMode === 'read' ?
                    <div className="slide-caption-container" ref={bindCaptionContainer}>
                      {presentation.order.length > 1 ? <nav className="nav-container">
                        <button className="nav-arrow" onClick={prev}>▲</button>
                        <ul className="quick-nav">
                          {presentation.order.map((id, index) => {
                        const slide = presentation.slides[id];
                        const onSlideClick = () => this.scrollToSlide(id);
                        return (
                          <li onClick={onSlideClick} key={index} className={navigation.currentSlideId === id ? 'active' : 'inactive'}>
                            <h3><span className="tooltip-container">
                              <span className="tooltip-content">
                                {
                                  slide.title.length ?/* eslint no-nested-ternary:0 */
                                    slide.title
                                    :
                                      slide.markdown ?
                                        <ReactMarkdown source={slide.markdown.split(' ').slice(0, 3).join(' ') + '...'} />
                                        :
                                        '...'
                                }
                              </span>
                            </span></h3>
                          </li>
                        );
                      })}
                        </ul>
                        <button className="nav-arrow" onClick={next}>▼</button>
                      </nav> : null}
                      {/* todo: refactor slidecaption as a component */}
                      <article
                        className="slide-caption"
                        style={{
                        top: this.state.scrollTop + 'px'
                      }}>
                        {
                        presentation.order.map(id => {
                          const slide = presentation.slides[id];
                          const onSlideClick = () => this.scrollToSlide(id);
                          return (
                            <div
                              key={id}
                              className={'slide-content ' + (id === navigation.currentSlideId ? 'active' : '')}
                              id={id}
                              onClick={onSlideClick}>
                              <h2 className="slide-title">{slide.title}</h2>
                              {
                              slide.markdown.length ?
                                <ReactMarkdown source={slide.markdown} />
                              : <p className="placeholder-text">No comments</p>
                            }
                            </div>
                          );
                        })
                      }
                      </article>
                    </div> :
                    <p className="no-slide">
                      {!navigation.currentSlideId && 'No slide to display'}
                    </p>
                }
                <div className="slide-legend-container" onWheel={onLegendWheel}>
                  <h4>Legend</h4>
                  {
                    // legend
                    // todo: refactor that as a component
                    navigation.currentSlideId &&
                    Object.keys(presentation.slides[navigation.currentSlideId].views)
                    .map(viewId => (
                      <div key={viewId} className="view-legend">
                        {
                            Object.keys(presentation.slides[navigation.currentSlideId].views[viewId].viewParameters.colorsMap)
                            .filter(collectionId => collectionId !== 'default')
                            .map(collectionId => (
                              <div className="collection-legend" key={collectionId}>
                                {
                                  Object.keys(presentation.slides[navigation.currentSlideId].views[viewId].viewParameters.colorsMap).length > 2 ?
                                    <h4>{collectionId}</h4> : null
                                }
                                <ul className="legend-group">
                                  {
                                    Object.keys(presentation.slides[navigation.currentSlideId].views[viewId].viewParameters.colorsMap[collectionId])
                                    .filter(category => category !== 'default')
                                    .map(category => (
                                      <li className="legend-item" key={category}>
                                        <span
                                          className="color"
                                          style={{
                                            background: presentation
                                                          .slides[navigation.currentSlideId]
                                                          .views[viewId]
                                                          .viewParameters
                                                          .colorsMap[collectionId][category],
                                            opacity: presentation
                                                          .slides[navigation.currentSlideId]
                                                          .views[viewId]
                                                          .viewParameters
                                                          .shownCategories
                                                      && presentation
                                                          .slides[navigation.currentSlideId]
                                                          .views[viewId]
                                                          .viewParameters
                                                          .shownCategories[collectionId]
                                                          .indexOf(category) === -1 ? 0.3 : 1
                                          }} />
                                        <span className="category">
                                          {category}
                                        </span>
                                      </li>
                                    ))
                                  }
                                </ul>
                              </div>
                            ))
                          }
                      </div>
                    ))
                  }
                </div>
              </div>
          }
        </figcaption>
        { activeViewsParameters ?
          <div className="views-container">
            {Object.keys(presentation.visualizations).map(viewKey => {
                // todo: this could be wrapped in a separate component
                const visualization = presentation.visualizations[viewKey];
                const visType = visualization.metadata.visualizationType;
                const dataset = datasets[viewKey];
                let VisComponent = (<span />);
                switch (visType) {
                  case 'timeline':
                    VisComponent = Timeline;
                    break;
                  case 'map':
                    VisComponent = Map;
                    break;
                  case 'network':
                    VisComponent = Network;
                    break;
                  case 'svg':
                    VisComponent = SVGViewer;
                    break;
                  default:
                    break;
                }
                if (dataset) {
                  const onViewChange = e => {
                    onUserViewChange(viewKey, e.viewParameters);
                  };
                  return (
                    <div className={'view-container ' + visType} id={viewKey} key={viewKey}>
                      <div className="view-header">
                        <h3>{visualization.metadata.title}</h3>
                      </div>
                      <div className="view-body">
                        <VisComponent
                          data={dataset}
                          viewParameters={activeViewsParameters[viewKey].viewParameters}
                          allowUserViewChange={allowViewExploration && interactionMode === 'explore'}
                          onUserViewChange={onViewChange} />
                      </div>
                    </div>
                  );
                }
              })}
          </div>
          : null}
        <div className={'aside-bg' + (asideVisible ? ' active' : ' inactive')} onClick={toggleAside} />
        <KeyHandler keyEventName={KEYDOWN} keyValue="ArrowUp" onKeyHandle={prev} />
        <KeyHandler keyEventName={KEYDOWN} keyValue="ArrowDown" onKeyHandle={next} />
        <KeyHandler keyEventName={KEYDOWN} keyValue="ArrowRight" onKeyHandle={toggleAside} />
        <KeyHandler keyEventName={KEYDOWN} keyValue="ArrowLeft" onKeyHandle={toggleAside} />
        <style>
          {css}
        </style>
      </figure>
    );
  }
}

/**
 * Component's properties types
 */
ScrollerLayout.propTypes = {
  /**
   * The presentation to display
   */
  presentation: PropTypes.object.isRequired,
  /**
   * The current slide being displayed by the component
   */
  currentSlide: PropTypes.object,
  /**
   * Parameters describing current view's state
   */
  activeViewsParameters: PropTypes.object,
  /**
   * Whether the current view parameters match with current slide's view parameters
   */
  viewDifferentFromSlide: PropTypes.bool,
  /**
   * The transformed datasets to use for displaying visualizations
   */
  datasets: PropTypes.object,
  /**
   * Navigation state description
   */
  navigation: PropTypes.shape({
    /**
     * What is the active slide's id
     */
    currentSlideId: PropTypes.string,
    /**
     * What is the active slide's rank in slides list
     */
    position: PropTypes.number,
    /**
     * Whether active slide is the first
     */
    firstSlide: PropTypes.bool,
    /**
     * Whether active slide is the last
     */
    lastSlide: PropTypes.bool

  }),
  /**
   * Callbacks when user asks to jump to a specific slide
   */
  setCurrentSlide: PropTypes.func,
  /**
   * Callbacks when user asks to step forward or backward in slides order
   */
  stepSlide: PropTypes.func,
  /**
   * Callbacks to change the display of presentation's metadata/details in aside
   */
  toggleAside: PropTypes.func,
  /**
   * Interface state description
   */
  gui: PropTypes.shape({
    /**
     * Whether aside displays list of slides or presentation's metadata/details
     */
    asideVisible: PropTypes.bool,
    /**
     * Whether user is allowed to explore the view or can just navigate into slides' views
     */
    interactionMode: PropTypes.oneOf(['read', 'explore'])
  }),
  /**
   * Component global options
   */
  options: PropTypes.shape({
    /**
     * declares whether users can pan/zoom/navigate inside the view
     * or if the view is strictly controlled by current slide's parameters
     */
    allowViewExploration: PropTypes.bool
  }),
  /**
   * Callbacks when user tries to reset view to current slide's view parameters
   */
  resetView: PropTypes.func,
  /**
   * Callbacks when user changes view manually
   */
  onUserViewChange: PropTypes.func,
  /**
   * Hook to switch between "read" and "explore" interaction modes
   */
  toggleInteractionMode: PropTypes.func,
  /**
   * Trigger to call when user interacts to exit the presentation
   */
  onExit: PropTypes.func
};

export default ScrollerLayout;

