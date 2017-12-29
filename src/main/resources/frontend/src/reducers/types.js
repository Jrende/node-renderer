export const types = {
  clouds: {
    id: 1,
    name: 'Clouds',
    values: {
      seed: {
        name: 'Seed',
        type: 'number',
        default: 1
      },
      left: {
        name: 'Left',
        type: 'number',
        default: 0,
        min: -10,
        max: 10
      },
      size: {
        name: 'Size',
        type: 'number',
        default: 1
      },
      density: {
        name: 'Density',
        type: 'number',
        min: 0,
        max: 1,
        default: 0.5
      }
    },
    output: {
      out: {
        type: 'FrameBuffer',
        name: 'Output'
      },
    }
  },
  blend: {
    id: 2,
    name: 'Blend',
    values: {
      mode: {
        name: 'Mode',
        type: 'enum',
        values: [
          'Normal',
          'Screen',
          'Multiply'
        ],
        default: 'Normal'
      },
      factor: {
        name: 'Factor',
        type: 'number',
        default: 0.5,
        max: 1,
        min: 0
      }
    },
    input: {
      left: {
        type: 'FrameBuffer',
        name: 'Left'
      },
      right: {
        type: 'FrameBuffer',
        name: 'Right'
      }
    },
    output: {
      out: {
        type: 'FrameBuffer',
        name: 'Output'
      },
    }
  },
  solidColor: {
    id: 3,
    name: 'Solid Color',
    values: {
      color: {
        name: 'Color',
        type: 'color'
      }
    },
    output: {
      out: {
        type: 'FrameBuffer',
        name: 'Output'
      },
    }
  },
  hueSaturation: {
    id: 4,
    name: 'Hue/Saturation',
    values: {
      hue: {
        name: 'Hue',
        type: 'number',
        default: 0,
        max: 1,
        min: -1
      },
      saturation: {
        name: 'Saturation',
        type: 'number',
        default: 0,
        max: 1,
        min: -1
      },
      lightness: {
        name: "Lightness",
        type: "number",
        default: 0,
        max: 1,
        min: -1
      }
    },
    input: {
      input: {
        type: 'FrameBuffer',
        name: 'Input'
      }
    },
    output: {
      out: {
        type: 'FrameBuffer',
        name: 'Output'
      },
    }
  },
};

const typeReducer = (state = types, action) => {
  return state;
};

export default typeReducer;
