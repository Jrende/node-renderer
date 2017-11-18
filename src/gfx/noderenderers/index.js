import CloudRenderer from './CloudRenderer';
import SolidColorRenderer from './SolidColorRenderer';

import {types} from '../../reducers/types';
let constructors = {
  [types.clouds.id]: CloudRenderer,
  [types.solidColor.id]: SolidColorRenderer
}

export default function getRenderer(type) {
  return constructors[type.id];
}
