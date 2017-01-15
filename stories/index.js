import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import Welcome from './Welcome';
import Player from '../src/Player';


import ultrasimple from './mocks/ultrasimple_presentation.json';

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome showApp={linkTo('Button')}/>
  ));

/*
storiesOf('Button', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
  ));
*/

storiesOf('Quinoa presentation player', module)
  .add('with very simple presentation', () => (
    <Player presentation={ultrasimple} />
  ))
  .add('empty', () => (
    <Player />
  ))
  .add('with invalid data', () => (
    <Player presentation={{}} />
  ))

storiesOf('Quinoa timeline presentation', module)
  .add('Cartel mode, navigable', () => (
    <span>Todo</span>
  ))
  .add('Cartel mode, not navigable', () => (
    <span>Todo</span>
  ))
  .add('Scroll mode', () => (
    <span>Todo</span>
  ))