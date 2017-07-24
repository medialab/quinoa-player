Quinoa-presentation-player - *data presentations player component*
===

`Quinoa-presentation-player` is a module that provides a react component for displaying quinoa's data presentations in read-only mode.

It is part of the ``quinoa`` project family, a suite of digital storytelling tools tailored for the [FORCCAST](http://controverses.org/) pedagogical program and [médialab sciences po](http://www.medialab.sciences-po.fr/) scientific activities.

An example of editing apps for making data presentations is [bulgur](https://github.com/medialab/bulgur).

# Requirements

* [git](https://git-scm.com/)
* [node](https://nodejs.org/en/)

# npm scripts

```
npm run build # builds component to ./build dir
npm run lint # lints code (auto fix on) according to linting settings in package.json
npm run comb # prettifies scss code
npm run test # run mocha testing on each *.spec.js files in ./src dir
npm run storybook # starts a storybook instance to live test the component in several implementation scenarii (see ./stories folder)
npm run build-storybook # initializes storybook
npm run git-add-build # adds build to the current git record
```

# Installing the module as a dependency

```
npm install --save https://github.com/medialab/quinoa-presentation-player
```

# Installing the module as a project

```
git clone https://github.com/medialab/quinoa-presentation-player
cd quinoa-presentation-player
npm install
npm run build-storybook
```

# Development

The project uses [storybook](https://storybook.js.org/) to visually test the possible implementations of the component.

```
npm run storybook
```

# Module API

The module exports by default a react component.
It also exports a `templates` object which exposes metadata about available templates to display presentations.

```js
import PresentationPlayer from 'quinoa-presentation-player'; // provides usable react component

import {templates} from 'quinoa-presentation-player'; // provide metadata about available templates
```

# Presentation component API

```js
QuinoaPresentationPlayer.propTypes = {
  /**
   * component must be given a presentation as prop
   * (see ./src/presentationModel.json and ./quinoa-presentation-document-model-description.md)
   */
  presentation: PropTypes.object.isRequired,
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
```

# Templating

The component wraps a display-related component which corresponds to a specific templates.

Current templates are :

* `stepper` : slides are displayed on a pannel on the left of the view, navigation is handled through buttons
* `scroller` : slides are displayed as blocks, navigation is handled through scrolling

## Creating new templates

Creating a new template supposes to create a new folder within `src/templates/` folder, and fill it with at least three files:

* an `info.json` file describing the metadata of the template
* a scss file describing component default style
* a js script exposing a react component

Example of an `info.json`:

```
{
  "id": "scroller",
  "name": "Scroller",
  "description": "Slides are browsed through scrolling on the presentation"
}
```

The react component of the template must comply to the following API :

```js
MyTemplate.propTypes = {
  /**
   * The presentation to display
   */
  presentation: PropTypes.object.isRequired,
  /**
   * The current slide being displayed by the component
   */
  currentSlide: PropTypes.object,
  /**
   * Parameters describing current view's state
   */
  activeViewsParameters: PropTypes.object,
  /**
   * Whether the current view parameters match with current slide's view parameters
   */
  viewDifferentFromSlide: PropTypes.bool,
  /**
   * The transformed datasets to use for displaying visualizations
   */
  datasets: PropTypes.object,
  /**
   * Navigation state description
   */
  navigation: PropTypes.shape({
    /**
     * What is the active slide's id
     */
    currentSlideId: PropTypes.string,
    /**
     * What is the active slide's rank in slides list
     */
    position: PropTypes.number,
    /**
     * Whether active slide is the first
     */
    firstSlide: PropTypes.bool,
    /**
     * Whether active slide is the last
     */
    lastSlide: PropTypes.bool
        
  }),
  /**
   * Callbacks when user asks to jump to a specific slide
   */
  setCurrentSlide: PropTypes.func,
  /**
   * Callbacks when user asks to step forward or backward in slides order
   */
  stepSlide: PropTypes.func,
  /**
   * Callbacks to change the display of presentation's metadata/details in aside
   */
  toggleAside: PropTypes.func,
  /**
   * Interface state description
   */
  gui: PropTypes.shape({
    /**
     * Whether aside displays list of slides or presentation's metadata/details
     */
    asideVisible: PropType.bool,
    /**
     * Whether user is allowed to explore the view or can just navigate into slides' views
     */
    interactionMode: PropType.oneOf(["read", "explore"])
  }),
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
   * Callbacks when user tries to reset view to current slide's view parameters
   */
  resetView: PropTypes.func,
  /**
   * Callbacks when user changes view manually
   */
  onUserViewChange: PropTypes.func,
  /**
   * Hook to switch between "read" and "explore" interaction modes
   */
  toggleInteractionMode: PropTypes.func,
  /**
   * Trigger to call when user interacts to exit the presentation
   */
  onExit: PropTypes.func
}
```

# Pre-commit hook

The project uses a precommit hook before each commit to ensure the code remains clean at all times. Check out the `package.json` to learn more about it.

