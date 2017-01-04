import React, {Component, PropTypes} from 'react';
import ReactMarkdown from 'react-markdown';

import validate from './presentationValidator';

require('./Player.scss');

const renderPresentation = ({
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
            {Object.keys(presentation.views).map(viewKey => {
          const view = presentation.views[viewKey];
          const viewState = presentation.slides[navigation.currentSlideId].views[viewKey];
          return (
            <div className="view-container" id={viewKey} key={viewKey}>
              <div className="view-header">
                <h3>{view.metadata.title}</h3>
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

class QuinoaPresentationPlayer extends Component {
  constructor(props) {
    super(props);
    this.initPresentation = this.initPresentation.bind(this);
    this.renderComponent = this.renderComponent.bind(this);

    this.setCurrentSlide = this.setCurrentSlide.bind(this);
    this.stepSlide = this.stepSlide.bind(this);

    this.toggleAside = this.toggleAside.bind(this);

    this.status = 'waiting';
    this.navigation = {};
    this.gui = {
      asideVisible: false
    };

    if (props.presentation) {
      this.initPresentation(props.presentation);
    }
  }

  componentDidMount() {
    if (this.presentation) {
      this.setCurrentSlide(this.presentation.order[0]);
    }
  }

  shouldComponentUpdate() {
    return true;
  }

  initPresentation(presentation) {
    const valid = validate(presentation);
    if (valid) {
      this.status = 'loaded';
      this.presentation = presentation;
    }
 else {
      this.status = 'error';
    }
  }

  renderComponent () {
    if (this.presentation && this.status === 'loaded') {
      return renderPresentation({
        presentation: this.presentation,
        navigation: this.navigation,
        setCurrentSlide: this.setCurrentSlide,
        stepSlide: this.stepSlide,
        toggleAside: this.toggleAside,
        gui: this.gui
      });
    }
    else if (this.status === 'error') {
      return (<div>Oups</div>);
    }
 else {
      return (<div>No data yet</div>);
    }
  }

  setCurrentSlide (id) {
    if (this.presentation.slides[id]) {
      this.navigation.currentSlideId = id;
      this.navigation.position = this.presentation.order.indexOf(id);
      this.navigation.firstSlide = this.navigation.position === 0;
      this.navigation.lastSlide = this.navigation.position === this.presentation.order.length - 1;
      if (this.props.onSlideChange) {
        this.props.onSlideChange(id);
      }
      this.forceUpdate();
    }
  }

  stepSlide (forward) {
    if (forward) {
      this.navigation.position = this.navigation.position < this.presentation.order.length - 1 ? this.navigation.position + 1 : 0;
    }
 else {
      this.navigation.position = this.navigation.position > 0 ? this.navigation.position - 1 : this.presentation.order.length - 1;
    }
    this.setCurrentSlide(this.presentation.order[this.navigation.position]);
  }

  toggleAside () {
    this.gui.asideVisible = !this.gui.asideVisible;
    this.forceUpdate();
  }
  render() {
    return (
      <div className="quinoa-presentation-player">
        {this.renderComponent()}
      </div>
    );
  }
}

QuinoaPresentationPlayer.propTypes = {
  // presentation: PropTypes.Object,
  allowDataExploration: PropTypes.bool // whether users can pan/zoom/navigate inside view
};

export default QuinoaPresentationPlayer;
