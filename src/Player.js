import React, {Component, PropTypes} from 'react';

import {
  mapMapData,
  mapTimelineData,
  mapNetworkData
} from 'quinoa-vis-modules';

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
    this.resetView = this.resetView.bind(this);
    this.onUserViewChange = this.onUserViewChange.bind(this);

    const initialState = {
      status: 'waiting',
      navigation: {},
      gui: {
        asideVisible: false
      },
      datasets: {},
      activeViewsParameters: {}
    };

    if (props.presentation) {
        initialState.status = 'loaded';
        initialState.presentation = props.presentation;
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

  componentWillUpdate(nextProps, nextState) {
    const slide = nextState.currentSlide;
    const previousSlide = this.state.currentSlide;

    const slideParamsMark = slide && Object.keys(slide.views).map(viewKey => slide.views[viewKey] && slide.views[viewKey].viewParameters && slide.views[viewKey].viewParameters.viewDataMap);
    const previousSlideParamsMark = previousSlide && Object.keys(previousSlide.views).map(viewKey => previousSlide.views[viewKey] && previousSlide.views[viewKey].viewParameters && previousSlide.views[viewKey].viewParameters.viewDataMap);
    if (JSON.stringify(slideParamsMark) !== JSON.stringify(previousSlideParamsMark)) {
      const datasets = {};
      Object.keys(slide.views).map(viewKey => {
        const view = slide.views[viewKey];
        const viewDataMap = Object.keys(view.dataMap).reduce((result, collectionId) => ({
          ...result,
          [collectionId]: Object.keys(view.dataMap[collectionId]).reduce((propsMap, parameterId) => {
            const parameter = view.dataMap[collectionId][parameterId];
            if (parameter.mappedField) {
              return {
                ...propsMap,
                [parameterId]: parameter.mappedField
              };
            }
            return propsMap;
          }, {})
        }), {});
        const visualization = this.state.presentation.visualizations[viewKey];
        const visType = visualization.metadata.visualizationType;
        const dataset = visualization.data;
        let mappedData;
        switch (visType) {
          case 'map':
            mappedData = mapMapData(dataset, viewDataMap);
            break;
          case 'timeline':
            mappedData = mapTimelineData(dataset, viewDataMap);
            break;
          case 'network':
            mappedData = mapNetworkData(dataset, viewDataMap);
            break;
          default:
            break;
        }
        datasets[viewKey] = mappedData;
      });
      this.setState({
        datasets
      });
    }
    const slideViewParamsMark = previousSlide && Object.keys(previousSlide.views).map(viewKey => previousSlide.views[viewKey]);
    const activeViewParamsMark = Object.keys(slide.views).map(viewKey => this.state.activeViewsParameters[viewKey]);
    if (previousSlide && JSON.stringify(slideViewParamsMark) !== JSON.stringify(activeViewParamsMark) && !this.state.viewDifferentFromSlide) {
      this.setState({
        viewDifferentFromSlide: true
      });
    }
  }

  onUserViewChange (viewKey, viewParameters) {
    this.setState({
      activeViewsParameters: {
        ...this.state.activeViews,
        [viewKey]: {viewParameters}
      }
    });
  }

  resetView() {
    const slide = this.state.currentSlide;
    if (slide) {
      const activeViewsParameters = Object.keys(slide.views).reduce((result, viewKey) => {
          return {
            ...result,
            [viewKey]: {viewParameters: slide.views[viewKey].viewParameters}
          };
        }, {});
      this.setState({
        activeViewsParameters,
        viewDifferentFromSlide: false
      });
    }
  }

  initPresentation(presentation) {
    // const valid = validate(presentation);
    // if (valid) {
      this.setState({
        status: 'loaded',
        presentation
      });
 //    }
 // else {
 //      this.setState({
 //        status: 'error'
 //      });
 //    }
  }

  renderComponent () {
    const {
      options = {}
    } = this.props;
    if (this.state.presentation && this.state.status === 'loaded') {
      return (
        <PresentationLayout
          currentSlide={this.state.currentSlide}
          activeViewsParameters={this.state.activeViewsParameters}
          viewDifferentFromSlide={this.state.viewDifferentFromSlide}
          datasets={this.state.datasets}
          presentation={this.state.presentation}
          navigation={this.state.navigation}
          setCurrentSlide={this.setCurrentSlide}
          stepSlide={this.stepSlide}
          toggleAside={this.toggleAside}
          gui={this.state.gui}
          options={options}
          resetView={this.resetView}
          onUserViewChange={this.onUserViewChange} />
      );
    }
    else if (this.status === 'error') {
      return (<div>Oups, that looks like an error</div>);
    }
 else {
      return (<div>No data yet</div>);
    }
  }

  setCurrentSlide (id) {
    const slide = this.state.presentation.slides[id];
    if (slide) {
      const activeViewsParameters = Object.keys(slide.views).reduce((result, viewKey) => {
          return {
            ...result,
            [viewKey]: {viewParameters: slide.views[viewKey].viewParameters}
          };
        }, {});
      this.setState({
        currentSlide: slide,
        viewDifferentFromSlide: false,
        activeViewsParameters,
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
  options: PropTypes.shape({
    allowViewExploration: PropTypes.bool // whether users can pan/zoom/navigate inside view
  }),
  onSlideChange: PropTypes.func, // callback when navigation is changed
};


export default QuinoaPresentationPlayer;
