import React from 'react';
import ReactMarkdown from 'react-markdown';
import KeyHandler, {KEYDOWN} from 'react-key-handler';

import {
  Timeline,
  Map,
  Network
} from 'quinoa-vis-modules';

import './StepperLayout.scss';

const PresentationLayout = ({
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
    asideVisible
  },
  options: {
    allowViewExploration = true
  },
  onUserViewChange,
  // resetView
}) => {
  const next = () => !presentation.lastSlide && stepSlide(true);
  const prev = () => !presentation.firstSlide && stepSlide(false);
  return (
    <figure className="wrapper">
      <figcaption className="caption-container">
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
              {navigation.currentSlideId ?
                <div className="slide-caption-container">
                  {presentation.order.length > 1 ? <nav className="nav-container">
                    <button className="nav-arrow" onClick={prev}>▲</button>
                    <ul className="quick-nav">
                      {presentation.order.map((id, index) => {
                      const slide = presentation.slides[id];
                      const onSlideClick = () => setCurrentSlide(id);
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
                  <article className="slide-caption">
                    <h2 className="slide-title">
                      {presentation.slides[navigation.currentSlideId].title}</h2>
                    <section className="slide-content">
                      {
                        presentation.slides[navigation.currentSlideId].markdown.length ?
                          <ReactMarkdown source={presentation.slides[navigation.currentSlideId].markdown} />
                        : <p className="placeholder-text">No comments</p>
                      }
                    </section>
                    {presentation.order.indexOf(navigation.currentSlideId) < presentation.order.length - 1 ? <button className="next-slide-btn" onClick={next}>Next slide (↓)</button> : null}
                  </article>
                </div> :
                <p>
                  No slide to display
                </p>
              }
              <div className="slide-legend-container">
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
              let Component = (<span />);
              switch (visType) {
                case 'timeline':
                  Component = Timeline;
                  break;
                case 'map':
                  Component = Map;
                  break;
                case 'network':
                  Component = Network;
                  break;
                default:
                  break;
              }
              if (dataset) {
                const onViewChange = e => {
                  onUserViewChange(viewKey, e.viewParameters);
                };
                return (
                  <div className="view-container" id={viewKey} key={viewKey}>
                    <div className="view-header">
                      <h3>{visualization.metadata.title}</h3>
                    </div>
                    <div className="view-body">
                      <Component
                        data={dataset}
                        viewParameters={activeViewsParameters[viewKey].viewParameters}
                        allowUserViewChange={allowViewExploration}
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
};

export default PresentationLayout;

