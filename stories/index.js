/**
 * quinoa-presentation-player stories definition
 * ============
 * each story allows to visually assess the lib's component in the browser
 * run `npm storybook` to see them in action
 */
import React from 'react';
import { storiesOf } from '@kadira/storybook';
import Player from '../src/Player';

import mapPresentation from './map/map-test-from-bulgur.json';
import timelinePresentation from './timeline/timeline-test-from-bulgur.json';
import networkPresentation from './network/network-test-from-bulgur.json';
import svgPresentation from './svg/svg-presentation-example.json';

const timelineZeroSlides = {
  ...timelinePresentation,
  order: []
}

// import networkPresentation from './network/network-test-from-bulgur.json';

storiesOf('Quinoa timeline presentation', module)
  .add('Cartel mode, navigable (stepper)', () => (
    <Player 
      presentation={timelinePresentation} 
    />
  ))
  .add('Cartel mode, navigable (scroller given as prop)', () => (
    <Player 
      presentation={timelinePresentation} 
      template="scroller"
    />
  ))
  .add('Imposing the scroller mode throught the presentation', () => (
    <Player 
      presentation={{
        ...timelinePresentation,
        settings: {
          ...timelinePresentation.settings,
          template: 'scroller'
        }
      }} 
    />
  ))
  .add('Presentation with no slides', () => (
    <Player 
      presentation={timelineZeroSlides} 
    />
  ))
  ;

// storiesOf('Quinoa network presentation', module)
//   .add('Cartel mode, navigable', () => (
//     <Player 
//       presentation={networkPresentation} 
//     />
//   ));

storiesOf('Quinoa map presentation', module)
  .add('Cartel mode, navigable, stepper', () => (
    <Player 
      presentation={mapPresentation} 
    />
  ))
  .add('Cartel mode, navigable, scroller', () => (
    <Player 
      presentation={mapPresentation} 
      template='scroller'
      onExit={(direction) => console.info('on exit', direction)}
    />
  ));

storiesOf('Quinoa network presentation', module)
  .add('Cartel mode, navigable, stepper', () => (
    <Player 
      presentation={networkPresentation} 
    />
  ))
  .add('Cartel mode, navigable, scroller', () => (
    <Player 
      presentation={networkPresentation} 
      template='scroller'
      onExit={(direction) => console.info('on exit', direction)}
    />
  ));

storiesOf('Quinoa svg presentation', module)
  .add('Cartel mode, navigable, stepper', () => (
    <Player 
      presentation={svgPresentation} 
    />
  ))
  .add('Cartel mode, navigable, scroller', () => (
    <Player 
      presentation={svgPresentation} 
      template='scroller'
      onExit={(direction) => console.info('on exit', direction)}
    />
  ));
