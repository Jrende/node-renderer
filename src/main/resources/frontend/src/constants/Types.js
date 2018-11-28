export default {
  finalOutput: {
    id: 0,
    name: 'Output',
    values: {
      finalResult: {
        type: 'color',
        name: 'Final result'
      },
    },
    output: {}
  },
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
        type: 'color',
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
        ]
      },
      left: {
        type: 'color',
        name: 'Left'
      },
      right: {
        type: 'color',
        name: 'Right'
      },
      factor: {
        name: 'Factor',
        type: 'number',
        default: 0.5,
        max: 1,
        min: 0
      }
    },
    output: {
      out: {
        type: 'color',
        name: 'Output'
      },
    }
  },
  solidColor: {
    id: 3,
    name: 'Solid Color',
    values: {
      color: {
        type: 'color',
        name: 'Color'
      }
    },
    output: {
      out: {
        type: 'color',
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
        name: 'Lightness',
        type: 'number',
        default: 0,
        max: 1,
        min: -1
      },
      inputTexture: {
        type: 'color',
        name: 'Input'
      }
    },
    output: {
      out: {
        type: 'color',
        name: 'Output'
      },
    }
  },
  brightnessContrast: {
    id: 5,
    name: 'Brightness/Contrast',
    values: {
      brightness: {
        name: 'Brightness',
        type: 'number',
        default: 0,
        max: 1,
        min: -1
      },
      contrast: {
        name: 'Contrast',
        type: 'number',
        default: 0,
        max: 1,
        min: -1
      },
      inputTexture: {
        type: 'color',
        name: 'Input'
      }
    },
    output: {
      out: {
        type: 'color',
        name: 'Output'
      },
    }
  },
  gradient: {
    id: 6,
    name: 'Gradient',
    values: {
      gradient: {
        name: 'Gradient',
        type: 'gradient'
      },
      repeat: {
        name: 'Repeat mode',
        type: 'enum',
        values: [
          'Repeat',
          'Mirrored repeat',
          'Clamp to edge'
        ],
      },
      vector: {
        name: 'Direction',
        type: 'vector',
        default: [[0, 0], [1.0, 0]]
      }
    },
    output: {
      out: {
        type: 'color',
        name: 'Output'
      },
    }
  },
  colorMap: {
    id: 7,
    name: 'Color Map',
    values: {
      gradient: {
        name: 'Gradient',
        type: 'gradient'
      },
      inputTexture: {
        type: 'color',
        name: 'Input'
      }
    },
    output: {
      out: {
        type: 'color',
        name: 'Output'
      },
    }
  }
};
