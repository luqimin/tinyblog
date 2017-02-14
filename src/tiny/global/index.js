/**
 * Created by lqm on 12/02/2017.
 * @description 注册全局变量tiny/TINY
 */
import CONFIG from '../config'

class model {

}

class controller {

}

let _tiny = Object.assign({}, CONFIG, {
    model,
    controller,
});

global.tiny = global.TINY = Object.create(_tiny);