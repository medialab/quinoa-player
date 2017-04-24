import React, {Component} from 'react';
import ReactMarkdown from 'react-markdown';
import KeyHandler, {KEYDOWN} from 'react-key-handler';

import {easeCubic} from 'd3-ease';
import {interpolateNumber} from 'd3-interpolate';
import {timer} from 'd3-timer';

import {
  Timeline,
  Map,
  Network
} from 'quinoa-vis-modules';

import './ScrollerLayout.scss';

class ScrollerLayout extends Component {

  constructor(props) {
    super(props);

    this.transition = null;

    this.state = {
      scrollTop: 0,
      initiated: false
    };
    this.scrollToSlide = this.scrollToSlide.bind(this);
  }

  componentWillUpdate() {
    if (this.captionContainer && !this.state.initiated) {
      this.setState({
        scrollTop: this.captionContainer.offsetHeight / 2,
        initiated: true
      });
    }
  }

  scrollToSlide(id) {
    this.props.setCurrentSlide(id);
    const targetEl = document.getElementById(id);
    const target = this.captionContainer.offsetHeight / 2 - targetEl.offsetTop;
    const transitionsDuration = 500;
    const interpTop = interpolateNumber(this.state.scrollTop, target);
    const onTick = elapsed => {
      const t = elapsed < transitionsDuration ? easeCubic(elapsed / transitionsDuration) : 1;
      const scrollTop = interpTop(t);
      this.setState({
        scrollTop
      });
      if (t >= 1 && this.transition) {
        this.transition.stop();
        this.transition = null;
      }
    };
    if (this.transition === null) {
      this.transition = timer(onTick);
    }
  }

  render () {
    const {
      // currentSlide,
      activeViewsParameters,
      // viewDifferentFromSlide,
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
      const anchorsEls = document.getElementsByClassName('slide-content');
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
    const bindRef = component => {
      this.component = component;
    };
    const bindCaptionContainer = captionContainer => {
      this.captionContainer = captionContainer;
    };
    return (
      <figure className="wrapper" onWheel={onWheel} ref={bindRef}>
        <figcaption className={'caption-container' + ' ' + interactionMode}>
          <h1 onClick={toggleAside} className={'caption-header ' + (asideVisible ? 'active' : '')}>
            <span className="presentation-title">{presentation.metadata.title || 'Quinoa'}</span>
          </h1>
          {
            asideVisible ?
              <div className="caption-body-info">
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
                {navigation.currentSlideId && interactionMode === 'read' ?
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
                              <span className="tooltip-content">{slide.title}</span>
                            </span></h3>
                          </li>
                        );
                      })}
                      </ul>
                      <button className="nav-arrow" onClick={next}>▼</button>
                    </nav> : null}
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
                            <section
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
                            </section>
                          );
                        })
                      }
                      {/*<section className="slide-content">
                        <h2 className="slide-title">{presentation.slides[navigation.currentSlideId].title}</h2>
                        {
                          presentation.slides[navigation.currentSlideId].markdown.length ?
                            <ReactMarkdown source={presentation.slides[navigation.currentSlideId].markdown} />
                          : <p className="placeholder-text">No comments</p>
                        }
                      </section>*/}
                    </article>
                  </div> :
                  <p>
                    {!navigation.currentSlideId && 'No slide to display'}
                  </p>
                }
                <div className="slide-legend-container" onWheel={onLegendWheel}>
                  <h4>Legend</h4>
                  {
                    // legend
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
                                        <span className="color"
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
      </figure>
    );
  }
}

export default ScrollerLayout;

