module.exports = {
  configureWebpack:{
    devtool: 'source-map',
    devServer: {
      proxy: {
        '/gbf/uploads': {
          target: 'https://huiji-public.huijistatic.com/',
          changeOrigin: true,
          secure: false,
          bypass: (req, res) => {
            req.headers.referer = 'https://gbf.huijiwiki.com/';
          },
        },
      },
    },
    output: {
      filename: 'Calendar.js',
      chunkFilename: 'Calendar-chunk.js',
    },
  },
  css:{
    extract: {
      filename: 'Calendar.css',
    },
  },
  productionSourceMap: false,
  filenameHashing: false,
};
