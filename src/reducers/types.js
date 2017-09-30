let initialTypes = [
  {
    id: 1,
    name: 'Blur',
    data: {
      radius: {
        type: 'Number',
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
    data: {
      factor: {
        type: 'Number',
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
    name: 'ColorMix',
    data: {
      color: {
        type: 'Color',
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
    data: {
      color: {
        type: 'Color',
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
        name: '???'
      },
    }
  }
]
const types = (state = initialTypes, action) => {
  return state;
}

export default types
