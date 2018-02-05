import CloudRenderer from './CloudRenderer';
import SolidColorRenderer from './SolidColorRenderer';
import BlendRenderer from './BlendRenderer';
import HueSaturationRenderer from './HueSaturationRenderer';
import BrightnessContrastRenderer from './BrightnessContrastRenderer';
import { types } from '../../reducers/types';

let constructors = {
  [types.hueSaturation.id]: HueSaturationRenderer,
  [types.brightnessContrast.id]: BrightnessContrastRenderer,
  [types.clouds.id]: CloudRenderer,
  [types.solidColor.id]: SolidColorRenderer,
  [types.blend.id]: BlendRenderer
};

export default function getRenderer(type) {
  return constructors[type.id];
}
