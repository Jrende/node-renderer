import CloudRenderer from './CloudRenderer';
import SolidColorRenderer from './SolidColorRenderer';
import BlendRenderer from './BlendRenderer';

import {types} from '../../reducers/types';
let constructors = {
  [types.clouds.id]: CloudRenderer,
  [types.solidColor.id]: SolidColorRenderer,
  [types.blend.id]: BlendRenderer
}

export default function getRenderer(type) {
  return constructors[type.id];
}
