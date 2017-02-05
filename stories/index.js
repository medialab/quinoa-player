import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import Welcome from './Welcome';
import Player from '../src/Player';

import mapPresentation from './map/map-test-from-bulgur.json';
import timelinePresentation from './timeline/timeline-test-from-bulgur.json';
import networkPresentation from './network/network-test-from-bulgur.json';

storiesOf('Quinoa timeline presentation', module)
  .add('Cartel mode, navigable', () => (
    <Player 
      presentation={timelinePresentation} 
    />
  ));

storiesOf('Quinoa network presentation', module)
  .add('Cartel mode, navigable', () => (
    <Player 
      presentation={networkPresentation} 
    />
  ));

storiesOf('Quinoa map presentation', module)
  .add('Cartel mode, navigable', () => (
    <Player 
      presentation={mapPresentation} 
    />
  ));