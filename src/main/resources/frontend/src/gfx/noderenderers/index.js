import CloudRenderer from './CloudRenderer';
import ColorMapRenderer from './ColorMapRenderer';
import SolidColorRenderer from './SolidColorRenderer';
import BlendRenderer from './BlendRenderer';
import GradientRenderer from './GradientRenderer';
import HueSaturationRenderer from './HueSaturationRenderer';
import BrightnessContrastRenderer from './BrightnessContrastRenderer';
import Types from '../../constants/Types';

let constructors = {
  [Types.hueSaturation.id]: HueSaturationRenderer,
  [Types.brightnessContrast.id]: BrightnessContrastRenderer,
  [Types.clouds.id]: CloudRenderer,
  [Types.solidColor.id]: SolidColorRenderer,
  [Types.blend.id]: BlendRenderer,
  [Types.gradient.id]: GradientRenderer,
  [Types.colorMap.id]: ColorMapRenderer
};

export default function getRenderer(type) {
  return constructors[type.id];
}
