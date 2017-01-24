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
  viewDifferentFromSlide,
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
  resetView
}) => {
  const next = () => !presentation.lastSlide && stepSlide(true);
  const prev = () => !presentation.firstSlide && stepSlide(false);
  return (
    <div className="wrapper">
      <aside className={asideVisible ? 'visible' : 'hidden'}>
        <div className="metadata">
          <h1>{presentation.metadata.title || 'Quinoa'}</h1>
        </div>
        <div className="summary">
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
        <div onClick={toggleAside} className="aside-toggler" />
      </aside>
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
              {viewDifferentFromSlide ? <button onClick={resetView}>Reset</button> : ''}
              <button onClick={next} className={presentation.lastSlide ? 'inactive' : ''}>Next slide</button>
            </div>
          </figcaption>
        </figure> : ''}
      <div className={'aside-bg' + (asideVisible ? ' active' : ' inactive')} onClick={toggleAside} />
    </div>
  );
};

export default PresentationLayout;

