let initialTypes = [
  {
    id: 1,
    name: 'Blur',
    values: {
      radius: {
        name: 'Radius',
        type: 'number',
        max: 10,
        min: 0
      }
    },
    input: {
      in: {
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
  {
    id: 2,
    name: 'Mix',
    values: {
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
      },
    },
    output: {
      out: {
        type: 'FrameBuffer',
        name: 'Output'
      },
    }
  },
  {
    id: 3,
    name: 'Noise',
    input: {},
    output: {
      out: {
        type: 'FrameBuffer',
        name: 'Output'
      },
    }
  },
  {
    id: 4,
    name: 'Clouds',
    input: {},
    output: {
      out: {
        type: 'FrameBuffer',
        name: 'Output'
      },
    }
  },
  {
    id: 5,
    name: 'Checker',
    input: {},
    output: {
      out: {
        type: 'FrameBuffer',
        name: 'Output'
      },
    }
  },
  {
    id: 6,
    name: 'colorMix',
    values: {
      color: {
        name: 'Color',
        type: 'color'
      }
    },
    input: {
      input: {
        type: 'FrameBuffer',
        name: 'Input'
      },
    },
    output: {
      out: {
        type: 'FrameBuffer',
        name: 'Output'
      },
    }
  },
  {
    id: 7,
    name: 'Test node with a long name',
    values: {
      color: {
        name: 'Color',
        type: 'color'
      }
    },
    input: {
      in: {
        type: 'FrameBuffer',
        name: 'Input'
      },
    },
    output: {
      out: {
        type: 'FrameBuffer',
        name: '﷽'
      },
    }
  }
]
const types = (state = initialTypes, action) => {
  return state;
}

export default types
