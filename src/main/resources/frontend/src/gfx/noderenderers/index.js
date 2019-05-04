import CloudRenderer from './CloudRenderer';
import ColorMapRenderer from './ColorMapRenderer';
import BlendRenderer from './BlendRenderer';
import GradientRenderer from './GradientRenderer';
import HueSaturationRenderer from './HueSaturationRenderer';
import SolidColorRenderer from './SolidColorRenderer';
import Types from '../../constants/Types';

let constructors = {
  [Types.hueSaturation.id]: HueSaturationRenderer,
  [Types.clouds.id]: CloudRenderer,
  [Types.blend.id]: BlendRenderer,
  [Types.gradient.id]: GradientRenderer,
  [Types.colorMap.id]: ColorMapRenderer,
  [Types.solidColor.id]: SolidColorRenderer
};

export default function getRenderer(type) {
  return constructors[type.id];
}
