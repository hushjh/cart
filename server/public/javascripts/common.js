
module.exports=function(obj){
    var o,oClass=isClass(obj);
    if (oClass == "object") {
        if (oClass=== 'array') {
            o = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                o.push(arguments.callee(obj[i]));
            }
        } else {
            o = {};
            for (var j in obj) {
                o[j] = arguments.callee(obj[j]);
            }
        }
    } else {
        o = obj;
    }
    return o;
};
//返回传递给他的任意对象的类
function isClass(o){
    return Object.prototype.toString.call(o).slice(8,-1);
}