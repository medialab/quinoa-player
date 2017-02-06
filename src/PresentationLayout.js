import React from 'react';
import ReactMarkdown from 'react-markdown';

import {
  Timeline,
  Map,
  Network
} from 'quinoa-vis-modules';

const PresentationLayout = ({
  currentSlide,
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
    <div className="wrapper">
      { currentSlide ?
        <figure>
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
          <figcaption className="caption-container">
            <div className="legend-container">
              {
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
                                .map(category => (
                                  <li className="legend-item" key={category}>
                                    <span className="color"
                                      style={{
                                        background: presentation.slides[navigation.currentSlideId].views[viewId].viewParameters.colorsMap[collectionId][category]
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
            <div className="caption-header">
              <button onClick={prev} className={presentation.firstSlide ? 'inactive' : ''}>Previous slide</button>
            </div>
            <div className="caption-main">
              <div className="caption-header">
                <h2>{presentation.slides[navigation.currentSlideId].title}</h2>
              </div>
              <div className="caption-content">
                <ReactMarkdown source={presentation.slides[navigation.currentSlideId].markdown} />
              </div>
            </div>
            <div className="caption-footer">
              {/*viewDifferentFromSlide ? <button onClick={resetView}>Reset</button> : ''*/}
              <button onClick={next} className={presentation.lastSlide ? 'inactive' : ''}>Next slide</button>
            </div>
          </figcaption>
        </figure> : ''}
      <aside className={asideVisible ? 'visible' : 'hidden'}>
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
        <div className="summary aside-group">
          <h2>Summary</h2>
          <ul>
            {presentation.order.map((id, index) => {
            const slide = presentation.slides[id];
            const onSlideClick = () => setCurrentSlide(id);
            return (
              <li onClick={onSlideClick} key={index} className={navigation.currentSlideId === id ? 'active' : 'inactive'}>
                <h3>{slide.title}</h3>
              </li>
            );
          })}
          </ul>
        </div>
        <div className="datasets aside-group">
          <h2>About data</h2>
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
        <div onClick={toggleAside} className="aside-toggler" />
      </aside>
      <div className={'aside-bg' + (asideVisible ? ' active' : ' inactive')} onClick={toggleAside} />
    </div>
  );
};

export default PresentationLayout;

