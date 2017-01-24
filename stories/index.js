import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import Welcome from './Welcome';
import Player from '../src/Player';


import ultrasimple from './mocks/ultrasimple_presentation.json';

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome showApp={linkTo('Button')}/>
  ));

storiesOf('Quinoa presentation player', module)
  .add('with very simple presentation', () => (
    <Player presentation={ultrasimple} />
  ))
  .add('empty', () => (
    <Player />
  ))
  .add('with invalid data', () => (
    <Player presentation={{}} />
  ));


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