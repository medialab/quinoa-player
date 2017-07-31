/**
 * quinoa-presentation-player entry point
 * ============
 * exports a component + templates metadata of the lib
 */

import Player from './Player';

// informations about the templates that the module is able to provide
const templateInfo = [
  require('./templates/scroller/info'),
  require('./templates/stepper/info')
];
// templates info are accessible as an array of objects
export const templates = templateInfo;

/**
 * Default export is a react component
**/
export default Player;
