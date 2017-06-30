import Player from './Player';

// informations about the templates that the module is able to provide
const templateInfo = [
  require('./templates/scroller/info'),
  require('./templates/stepper/info')
];
export const templates = templateInfo;

/**
 * Default template is a react component
**/
export default Player;
