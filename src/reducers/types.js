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
      in: 'FrameBuffer',
    },
    output: {
      out: 'FrameBuffer'
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
      left: 'FrameBuffer',
      right: 'FrameBuffer',
    },
    output: {
      out: 'FrameBuffer'
    }
  },
  {
    id: 3,
    name: 'Noise',
    input: {},
    output: {
      out: 'FrameBuffer'
    }
  },
  {
    id: 4,
    name: 'Clouds',
    input: {},
    output: {
      out: 'FrameBuffer'
    }
  },
  {
    id: 5,
    name: 'Checker',
    input: {},
    output: {
      out: 'FrameBuffer'
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
      input: 'FrameBuffer'
    },
    output: {
      out: 'FrameBuffer'
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
      'This node needs input to work properly': 'FrameBuffer'
    },
    output: {
      'This is the output of the computation': 'FrameBuffer'
    }
  }
]
const types = (state = initialTypes, action) => {
  return state;
}

export default types
