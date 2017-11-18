/*
id: 1,
name: 'Blur',
id: 2,
name: 'Mix',
id: 3,
name: 'Noise',
id: 4,
name: 'Clouds',
id: 5,
name: 'Checker',
id: 6,
name: 'Color Mix',
id: 7,
name: 'Test node with a long name',
id: 8,
name: 'Voronoi',
*/
import CloudRenderer from './CloudRenderer';
export default function getRenderer(type) {
  switch(type.id) {
    case 1:
      return CloudRenderer;
    default:
      console.error(`Unable to find type for ${type.name}`);
      return () => {
        return {
          render: () => {
            return {
              out: {}
            };
          }
        }
      }
  }
}
