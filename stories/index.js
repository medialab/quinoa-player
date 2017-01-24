import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import Welcome from './Welcome';
import Player from '../src/Player';

import mapPresentation from './map/simple-map-presentation.json';
storiesOf('Quinoa map presentation', module)
  .add('Cartel mode, navigable', () => (
    <Player 
      presentation={mapPresentation} 
    />
  ))
  .add('Cartel mode, not navigable', () => (
    <span>Todo</span>
  ))
  .add('Scroll mode', () => (
    <span>Todo</span>
  ))