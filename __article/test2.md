#TINY#
{
    "title": "文章发布测试",
    "url": "test2",
    "tags": "javascript",
    "brief": "这是文章发布测试的简介"
}
#TINY#

## 测试文章

### 这是一个测试文章

### 测试代码高亮

```javascript
let once = function(fn) {
    var res;
    return function() {
        if(res) return res;
        res = fn();
        return res;
    }
}

let fuckOnce = once(fn);

fuckOnce();
fuckOnce();
fuckOnce();
fuckOnce();
```