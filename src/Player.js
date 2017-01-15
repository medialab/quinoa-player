import React, {Component, PropTypes} from 'react';

import validate from './presentationValidator';

require('./Player.scss');

import PresentationLayout from './PresentationLayout';

class QuinoaPresentationPlayer extends Component {
  constructor(props) {
    super(props);
    this.initPresentation = this.initPresentation.bind(this);
    this.renderComponent = this.renderComponent.bind(this);

    this.setCurrentSlide = this.setCurrentSlide.bind(this);
    this.stepSlide = this.stepSlide.bind(this);
    this.toggleAside = this.toggleAside.bind(this);

    const initialState = {
      status: 'waiting',
      navigation: {},
      gui: {
        asideVisible: false
      }
    };

    if (props.presentation) {
      const valid = validate(props.presentation);
      if (valid) {
        initialState.status = 'loaded';
        initialState.presentation = props.presentation;
      }
   else {
        initialState.status = 'error';
      }
    }

    this.state = initialState;
  }

  componentDidMount() {
    if (this.state.presentation) {
      this.setCurrentSlide(this.state.presentation.order[0]);
    }
  }

  shouldComponentUpdate() {
    return true;
  }

  initPresentation(presentation) {
    const valid = validate(presentation);
    if (valid) {
      this.setState({
        status: 'loaded',
        presentation
      });
    }
 else {
      this.setState({
        status: 'error'
      });
    }
  }

  renderComponent () {
    if (this.state.presentation && this.state.status === 'loaded') {
      return (
        <PresentationLayout
          presentation={this.state.presentation}
          navigation={this.state.navigation}
          setCurrentSlide={this.setCurrentSlide}
          stepSlide={this.stepSlide}
          toggleAside={this.toggleAside}
          gui={this.state.gui} />

      // PresentationLayout({
      //   presentation: this.state.presentation,
      //   navigation: this.state.navigation,
      //   setCurrentSlide: this.setCurrentSlide,
      //   stepSlide: this.stepSlide,
      //   toggleAside: this.toggleAside,
      //   gui: this.state.gui
      // })
      );
    }
    else if (this.status === 'error') {
      return (<div>Oups</div>);
    }
 else {
      return (<div>No data yet</div>);
    }
  }

  setCurrentSlide (id) {
    if (this.state.presentation.slides[id]) {
      this.setState({
        navigation: {
          ...this.state.navigation,
          currentSlideId: id,
          position: this.state.presentation.order.indexOf(id),
          firstSlide: this.state.navigation.position === 0,
          lastSlide: this.state.navigation.position === this.state.presentation.order.length - 1
        }
      });
      if (this.props.onSlideChange) {
        this.props.onSlideChange(id);
      }
    }
  }

  stepSlide (forward) {
    let newSlidePosition;
    if (forward) {
      newSlidePosition = this.state.navigation.position < this.state.presentation.order.length - 1 ? this.state.navigation.position + 1 : 0;
    }
    else {
      newSlidePosition = this.state.navigation.position > 0 ? this.state.navigation.position - 1 : this.state.presentation.order.length - 1;
    }
    this.setCurrentSlide(this.state.presentation.order[newSlidePosition]);
  }

  toggleAside () {
    this.setState({
      gui: {
        ...this.state.gui,
        asideVisible: !this.state.gui.asideVisible
      }
    });
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
  allowDataExploration: PropTypes.bool, // whether users can pan/zoom/navigate inside view
  onSlideChange: PropTypes.func, // callback when navigation is changed
};

export default QuinoaPresentationPlayer;
