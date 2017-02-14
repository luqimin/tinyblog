const CONFIG = {
    APPNAME: 'tiny',
    keywords: 'tinyblog,xiaozhuye,小主页,luqimin,个人主页,网址导航,个性主页,vuejs,thinkjs',
    description: 'tinyblog',
    developmentDir: 'src',
    productionDir: 'app',
    modelFile: 'model.js',
    viewFile: 'index.ejs',
    controllerFile: 'controller.js',
    homeDir: 'module/home',
    staticDir: 'www',
    moduleDir: 'module',
    templateDir: 'src/template',
    articleDir: '__article',
    serverPort: '8666',
    database: {
        mysql: {
            host: '139.129.207.160',
            port: '',
            database: 'xiaozhuye',
            user: 'xiaozhuye',
            password: 'nW3bWUjuYc9sF54Q',
            prefix: '',
            encoding: 'UTF8MB4_GENERAL_CI'
        },
    }
};

export default CONFIG;