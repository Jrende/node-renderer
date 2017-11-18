export let types = {
  clouds: {
    id: 1,
    name: 'Clouds',
    values: {
      seed: {
        name: 'Seed',
        type: 'number',
        default: 1
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
}
  /*
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
    id: 3,
    name: 'Noise',
    values: {
      scale: {
        name: 'Scale',
        type: 'number',
        max: 200,
        min: 0
      },
      detail: {
        name: 'Detail',
        type: 'number',
        max: 200,
        min: 0
      },
      distortion: {
        name: 'Detail',
        type: 'number',
        max: 200,
        min: 0
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
    id: 5,
    name: 'Checker',
    values: {
      color1: {
        name: 'Color 1',
        type: 'color'
      },
      color2: {
        name: 'Color 2',
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
  {
    id: 6,
    name: 'Color Mix',
    values: {
      gradient: {
        name: 'Color gradient',
        type: 'gradient'
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
  },
  {
    id: 8,
    name: 'Voronoi',
    values: {
      scale: {
        name: 'Scale',
        type: 'number'
      }
    },
    input: {
    },
    output: {
      color: {
        type: 'Framebuffer',
        name: 'Color'
      },
      fac: {
        type: 'Framebuffer',
        name: 'Fac'
      }
    }
  }
  */

const typeReducer = (state = types, action) => {
  return state;
}

export default typeReducer
