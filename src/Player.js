/* eslint react/no-did-mount-set-state : 0 */
import React, {Component, PropTypes} from 'react';

import StepperLayout from './templates/stepper/StepperLayout';
import ScrollerLayout from './templates/scroller/ScrollerLayout';

import {
  mapMapData,
  mapTimelineData,
  mapNetworkData
} from 'quinoa-vis-modules';

require('./Player.scss');

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
    this.toggleInteractionMode = this.toggleInteractionMode.bind(this);

    const initialState = {
      status: 'waiting',
      navigation: {},
      gui: {
        asideVisible: false,
        interactionMode: 'read'
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
      if (this.state.presentation.order && this.state.presentation.order.length) {
        const beginAt = this.props.beginAt && this.props.beginAt < this.state.presentation.order.length ? this.props.beginAt : 0;
        this.setCurrentSlide(this.state.presentation.order[beginAt]);
      }
      else {
        const datasets = {};
        const views = this.state.presentation.visualizations;
        Object.keys(views).map(viewKey => {
          const view = views[viewKey];
          const visualization = this.state.presentation.visualizations[viewKey];
          const visType = visualization.metadata.visualizationType;
          const dataset = visualization.data;
          let mappedData;
          switch (visType) {
            case 'map':
              mappedData = mapMapData(dataset, view.flattenedDataMap);
              break;
            case 'timeline':
              mappedData = mapTimelineData(dataset, view.flattenedDataMap);
              break;
            case 'network':
              mappedData = mapNetworkData(dataset, view.flattenedDataMap);
              break;
            default:
              break;
          }
          datasets[viewKey] = mappedData;
        });
        this.setState({
          activeViewsParameters: {...this.state.presentation.visualizations},
          datasets
        });
      }
    }
  }

  shouldComponentUpdate() {
    return true;
  }

  componentWillUpdate(nextProps, nextState) {
    const slide = nextState.currentSlide;
    const previousSlide = this.state.currentSlide;
    const slideParamsMark = slide && Object.keys(slide.views).map(viewKey => slide.views[viewKey] && slide.views[viewKey].viewParameters && slide.views[viewKey].viewParameters.flattenedDataMap);
    const previousSlideParamsMark = previousSlide && Object.keys(previousSlide.views).map(viewKey => previousSlide.views[viewKey] && previousSlide.views[viewKey].viewParameters && previousSlide.views[viewKey].viewParameters.flattenedDataMap);
    if (JSON.stringify(slideParamsMark) !== JSON.stringify(previousSlideParamsMark)) {
      const datasets = {};
      const views = slide ? slide.views : nextState.presentation.visualizations;
      Object.keys(views).map(viewKey => {
        const view = views[viewKey];
        const viewDataMap = Object.keys(view.viewParameters.dataMap).reduce((result, collectionId) => ({
          ...result,
          [collectionId]: Object.keys(view.viewParameters.dataMap[collectionId]).reduce((propsMap, parameterId) => {
            const parameter = view.viewParameters.dataMap[collectionId][parameterId];
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
          case 'svg':
            mappedData = dataset;
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
    const activeViewParamsMark = slide && Object.keys(slide.views).map(viewKey => this.state.activeViewsParameters[viewKey]);
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
 else {
      const visualizations = this.state.presentation.visualizations;
      const activeViewsParameters = Object.keys(visualizations).reduce((result, viewKey) => {
          return {
            ...result,
            [viewKey]: {viewParameters: visualizations[viewKey].viewParameters}
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

  toggleInteractionMode (to) {
    this.setState({
      gui: {
        ...this.state.gui,
        interactionMode: to
      }
    });
  }

  renderComponent () {
    const {
      options = {},
      template = 'stepper'
    } = this.props;
    if (this.state.presentation && this.state.status === 'loaded') {
      switch (template) {
        case 'scroller':
          return (
            <ScrollerLayout
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
              onUserViewChange={this.onUserViewChange}
              toggleInteractionMode={this.toggleInteractionMode}
              onExit={this.props.onExit} />
        );
        case 'stepper':
        default:
          return (
            <StepperLayout
              activeViewsParameters={this.state.activeViewsParameters}
              currentSlide={this.state.currentSlide}
              datasets={this.state.datasets}
              gui={this.state.gui}
              navigation={this.state.navigation}
              onExit={this.props.onExit}
              onUserViewChange={this.onUserViewChange}
              options={options}
              presentation={this.state.presentation}
              resetView={this.resetView}
              setCurrentSlide={this.setCurrentSlide}
              stepSlide={this.stepSlide}
              toggleAside={this.toggleAside}
              toggleInteractionMode={this.toggleInteractionMode}
              viewDifferentFromSlide={this.state.viewDifferentFromSlide} />
        );
      }
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
      newSlidePosition = this.state.navigation.position < this.state.presentation.order.length - 1 ? this.state.navigation.position + 1 : this.state.navigation.position; // 0;
    }
    else {
      newSlidePosition = this.state.navigation.position > 0 ? this.state.navigation.position - 1 : this.state.navigation.position; // this.state.presentation.order.length - 1;
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
    const {
      template = 'stepper'
    } = this.props;
    const onWheel = (e) => {
      if (typeof this.props.onWheel === 'function') {
        this.props.onWheel(e);
      }
    };
    return (
      <div
        onWheel={onWheel}
        className={'quinoa-presentation-player ' + template + ' ' + (this.props.className ? this.props.className : '')}
        style={this.props.style}>
        {this.renderComponent()}
      </div>
    );
  }
}

QuinoaPresentationPlayer.propTypes = {
  // presentation: PropTypes.object,
  options: PropTypes.shape({
    allowViewExploration: PropTypes.bool // whether users can pan/zoom/navigate inside view
  }),
  onSlideChange: PropTypes.func, // callback when navigation is changed
};


export default QuinoaPresentationPlayer;
