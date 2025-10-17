const path = require('path')
const { whenProd, getPlugin, pluginByName } = require('@craco/craco')

module.exports = {
  // webpack 配置
  webpack: {
    // 配置别名
    alias: {
      // 约定：使用 @ 表示 src 文件所在路径
      '@': path.resolve(__dirname, 'src')
    },
    // 配置webpack
    // 配置CDN
    configure: (webpackConfig) => {
      // 配置source map生成方式为更兼容的格式
      webpackConfig.devtool = 'source-map'
      // 确保在所有环境中cdn对象都被正确初始化
      const cdn = {
        js: []
      }
      
      whenProd(() => {
        // 只在生产环境中设置externals和CDN
        // key: 不参与打包的包(由dependencies依赖项中的key决定)
        // value: cdn文件中 挂载于全局的变量名称
        webpackConfig.externals = {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
        // 配置现成的cdn资源地址
        cdn.js = [
          'https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js',
          'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js'
        ]
      })

      // 通过 htmlWebpackPlugin插件 在public/index.html注入cdn资源url
      const { isFound, match } = getPlugin(
        webpackConfig,
        pluginByName('HtmlWebpackPlugin')
      )

      if (isFound) {
        // 找到了HtmlWebpackPlugin的插件，确保files属性存在
        if (!match.userOptions.files) {
          match.userOptions.files = {}
        }
        match.userOptions.files = cdn
      }

      return webpackConfig
    }
  }
}