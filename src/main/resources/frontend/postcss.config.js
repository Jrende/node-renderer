module.exports = {
  parser: 'postcss-less',
  plugins: {
    'postcss-import': {},
    'postcss-preset-env': {
      browsers: 'last 2 versions',
    },
    cssnano: {
      autoprefixer: false
    }
  }
};
