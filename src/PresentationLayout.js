import React from 'react';
import ReactMarkdown from 'react-markdown';

const PresentationLayout = ({
  presentation,
  navigation,
  setCurrentSlide,
  stepSlide,
  toggleAside,
  gui: {
    asideVisible
  }
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
      { navigation.currentSlideId ?
        <figure>
          <div className="views-container">
            {Object.keys(presentation.visualizations).map(viewKey => {
          const visualization = presentation.visualizations[viewKey];
          const viewState = presentation.slides[navigation.currentSlideId].views[viewKey];
          return (
            <div className="view-container" id={viewKey} key={viewKey}>
              <div className="view-header">
                <h3>{visualization.metadata.title}</h3>
              </div>
              <div className="view-body">
                {JSON.stringify(viewState.viewParameters, null, 2)}
              </div>
            </div>
          );
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
              <button onClick={next} className={presentation.lastSlide ? 'inactive' : ''}>Next slide</button>
            </div>
          </figcaption>
        </figure> : ''}
      <div className={'aside-bg' + (asideVisible ? ' active' : ' inactive')} onClick={toggleAside} />
    </div>
  );
};

export default PresentationLayout;

