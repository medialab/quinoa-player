/* eslint react/no-did-mount-set-state : 0 */
/**
 * This module exports a stateful presentation player component
 * ============
 * The player wraps state and state-related functions
 * for interacting with the presentation.
 * Templates are delegated the task to render the presentation with
 * a specific layout / set of interactions.
 * @module quinoa-presentation-player/Player
 */
import React, {Component, PropTypes} from 'react';

import StepperLayout from './templates/stepper/StepperLayout';
import ScrollerLayout from './templates/scroller/ScrollerLayout';

import {
  mapMapData,
  mapTimelineData,
  mapNetworkData
} from 'quinoa-vis-modules';

require('./Player.scss');

/**
 * QuinoaPresentationPlayer class for building QuinoaPresentationPlayer react component instances
 */
class QuinoaPresentationPlayer extends Component {
  /**
   * constructor
   * @param {object} props - properties given to instance at instanciation
   */
  constructor(props) {
    super(props);
    this.initPresentation = this.initPresentation.bind(this);
    this.renderComponent = this.renderComponent.bind(this);
    this.initNavigation = this.initNavigation.bind(this);
    this.setCurrentSlide = this.setCurrentSlide.bind(this);
    this.stepSlide = this.stepSlide.bind(this);
    this.toggleAside = this.toggleAside.bind(this);
    this.resetView = this.resetView.bind(this);
    this.onUserViewChange = this.onUserViewChange.bind(this);
    this.toggleInteractionMode = this.toggleInteractionMode.bind(this);
    this.onExit = this.onExit.bind(this);

    const initialState = {
      /**
       * Status can be 'waiting' or 'loaded'
       */
      status: 'waiting',
      /**
       * here is stored the current position
       * of the player in the presentation
       * and some sugar derivated from it
       */
      navigation: {},
      /**
       * The gui state part represent user interface state
       * (menus open, interaction mode, ...)
       */
      gui: {
        asideVisible: false,
        interactionMode: 'read'
      },
      /**
       * here are stored active datasets in javascript objects form
       */
      datasets: {},
      /**
       * Active views parameters for the visualizations
       * of the presentation
       */
      activeViewsParameters: {}
    };
    // component can be directly initialized with some data
    if (props.presentation) {
        initialState.status = 'loaded';
        initialState.presentation = props.presentation;
    }

    this.state = initialState;
  }
  /**
   * Executes code on instance after the component is mounted
   */
  componentDidMount() {
    if (this.state.presentation) this.initNavigation();
  }
  /**
   * Executes code when component receives new properties
   * @param {object} nextProps - the future properties of the component
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.presentation !== nextProps.presentation) {
      this.setState({presentation: nextProps.presentation, status: 'loaded'}, this.initNavigation);
    }
  }

  /**
   * Decides whether the component should be updated
   * @return {boolean} necessaryToUpdate
   */
  shouldComponentUpdate() {
    // todo: add here appropriate tests
    // to optimize component
    return true;
  }
  /**
   * Executes code before component updates
   * @param {object} nextProps - properties component will have
   * @param {object} nextState - future state of the component
   */
  componentWillUpdate(nextProps, nextState) {
    const slide = nextState.currentSlide;
    const previousSlide = this.state.currentSlide;
    // we refactor the flattenedDataMap of all views as an array
    // to check if a data remapping is needed
    const slideParamsMark = slide && Object.keys(slide.views).map(viewKey => slide.views[viewKey] && slide.views[viewKey].viewParameters && slide.views[viewKey].viewParameters.flattenedDataMap);
    const previousSlideParamsMark = previousSlide && Object.keys(previousSlide.views).map(viewKey => previousSlide.views[viewKey] && previousSlide.views[viewKey].viewParameters && previousSlide.views[viewKey].viewParameters.flattenedDataMap);
    // we check if a remapping of data is needed
    // todo: optimize that test this is dirty, it should not be necessary to stringify params
    if (JSON.stringify(slideParamsMark) !== JSON.stringify(previousSlideParamsMark)) {
      const datasets = {};
      // if no slide we default to visualizations default viewParameters
      const views = slide ? slide.views : nextState.presentation.visualizations;
      // iterating in the views
      Object.keys(views).map(viewKey => {
        const view = views[viewKey];
        // operationalizing the view data map for each collection of data objects
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
        // now consuming dataset + operationalized view data map
        // to obtain new properly formatted data
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
        // storing the change
        datasets[viewKey] = mappedData;
      });// end iterating in the views
      this.setState({
        datasets
      });
    }
    // finally, checking if the current view
    // is different from the viewParameters inscribed
    // in the current slide.
    // todo: this is dirty we should not use a stringify
    const slideViewParamsMark = previousSlide && Object.keys(previousSlide.views).map(viewKey => previousSlide.views[viewKey]);
    const activeViewParamsMark = slide && Object.keys(slide.views).map(viewKey => this.state.activeViewsParameters[viewKey]);
    if (previousSlide && JSON.stringify(slideViewParamsMark) !== JSON.stringify(activeViewParamsMark) && !this.state.viewDifferentFromSlide) {
      this.setState({
        viewDifferentFromSlide: true
      });
    }
  }

  /**
   * Wraps the init Navigation process of the presentation data
   */
  initNavigation() {
        // initializing the navigation state
    if (this.state.presentation.order && this.state.presentation.order.length) {
      const beginAt = this.props.beginAt && this.props.beginAt < this.state.presentation.order.length ? this.props.beginAt : 0;
      this.setCurrentSlide(this.state.presentation.order[beginAt]);
    }
    const datasets = {};
    const views = this.state.presentation.visualizations;
    // for each visualization of the presentation
    // (reminder: presentation data model allows several visualizations)
    // we format the data according viewParamaters's data map.
    // this will have to be done each time data map changes
    Object.keys(views).map(viewKey => {
      const view = views[viewKey];
      const visualization = this.state.presentation.visualizations[viewKey];
      const visType = visualization.metadata.visualizationType;
      const dataset = visualization.data;
      let mappedData;
      // we rely on the quinoa-vis-modules util modules
      // todo: (question) should we change quinoa-vis-modules utils api
      // to be lighter and not having to use that switch
      // (example of alternative api : mapVisData(visualizationType, dataset, dataMap)) ?
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
  /**
   * Handles user events on a specific presentation's view
   * @param {string} viewKey - the id of the presentation's view that is changed
   * @param {object} viewParameters - new parameters
   */
  onUserViewChange (viewKey, viewParameters) {
    this.setState({
      activeViewsParameters: {
        ...this.state.activeViews,
        [viewKey]: {viewParameters}
      }
    });
  }
  /**
   * Resets current views to the viewParameters stored in current
   * slide's viewParameters
   */
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
  /**
   * Wraps the initialization process of the presentation data
   * @param {object} presentation - the presentation to init with
   */
  initPresentation(presentation) {
    // todo: put a presentation validation test here
    // in order to prevent badly formatted presentations
    // if(valid) --> load
    this.setState({
      status: 'loaded',
      presentation
    });
    // else --> display error message
  }
  /**
   * Sets the interaction mode of the component
   * (read --> just go throught the slides without navigating the vis)
   * (explore --> navigate in the vis)
   * @param {string} - 'read' or 'explore'
   */
  toggleInteractionMode (to) {
    this.setState({
      gui: {
        ...this.state.gui,
        interactionMode: to
      }
    });
  }
  /**
   * Triggers when user tries to exit the presentation
   * @param {string} side - either "top" or "bottom"
   */
  onExit(side) {
    if (typeof this.props.onExit === 'function') {
      this.props.onExit(side);
    }
  }
  /**
   * Renders proper template component
   * @return {ReactElement} - renders the proper layout
   */
  renderComponent () {
    const {
      options = {},
      template
    } = this.props;
    if (this.state.presentation && this.state.status === 'loaded') {
      const activeTemplate = (
        this.state.presentation &&
        this.state.presentation.settings &&
        this.state.presentation.settings.template
      ) || template || 'stepper';
      switch (activeTemplate) {
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
              onExit={this.onExit} />
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
              onExit={this.onExit}
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
  /**
   * Sets the slide to display as current slide
   * @param {string} id - the id of the slide to set as active
   */
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
  /**
   * Moves forward or backward in slides order
   * @param {boolean} forward - whether to step one slide forward or backward
   */
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
  /**
   * Toggles the state of the "aside" (displays metadata about the presentation)
   */
  toggleAside () {
    this.setState({
      gui: {
        ...this.state.gui,
        asideVisible: !this.state.gui.asideVisible
      }
    });
  }
  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
    const {
      template
    } = this.props;
    const activeTemplate = (
        this.state.presentation &&
        this.state.presentation.settings &&
        this.state.presentation.settings.template
      ) || template || 'stepper';
    // we need that when embedding the player
    // in a scroll-aware webpage (see the quinoa-story-player project)
    const onWheel = (e) => {
      if (typeof this.props.onWheel === 'function') {
        this.props.onWheel(e);
      }
    };
    return (
      <div
        onWheel={onWheel}
        className={'quinoa-presentation-player ' + activeTemplate + ' ' + (this.props.className ? this.props.className : '')}
        style={this.props.style}>
        {this.renderComponent()}
      </div>
    );
  }
}

/**
 * Component's properties types
 */
QuinoaPresentationPlayer.propTypes = {
  /**
   * component must be given a presentation prop as argument
   * (see ./src/presentationModel.json and ./quinoa-presentation-document-model-description.md)
   */
  presentation: PropTypes.object.isRequired,
  /**
   * Optional rank of the slides list to begin at (0 corresponds to the first slide)
   */
  beginAt: PropTypes.number,
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
   * callback when navigation is changed
   */
  onSlideChange: PropTypes.func,
  /**
   * callback when user triggers an exit event on the component
   * (e.g. for scroller template : scroll down on last slide, scroll up on first slide)
   */
  onExit: PropTypes.func,
  /**
   * callback transmitting wheel events upstream
   */
  onWheel: PropTypes.func,
};


export default QuinoaPresentationPlayer;
