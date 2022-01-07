// utils.js 中存放一些 工具函数

  //  指定一个最大值和一个最大值， 返回 在最小值和最大值之间的随机整数 （包含最小值最大值）
function getRandomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1))
}

//  获取一个矩形的中心点的坐标
function getCenter(obj) {
  return {
    x: obj.x + obj.width/2,
    y: obj.y + obj.height/2
  }
}

//  用于检测 某个值 某个属性 是否为undefinded
function isUndefined(val) {
  return typeof val === "undefined"
}

// 碰撞检测， 检测两个对象之间是否产生了碰撞
//  objA 和 objB是两个对象  两个对象中的数据 要能够描述出一个矩形
//  objA/objB 一定要有四个属性 x,y,width,height
function isCollide(objA, objB) {
  // 如果发现 只要x,y,width,height中出现了 undefined 我们就要主动的 抛出一个异常 ，程序不再执行
  if(isUndefined(objA.x) || isUndefined(objA.y) || isUndefined(objA.width) || isUndefined(objA.height) ||
  isUndefined(objB.x) || isUndefined(objB.y) || isUndefined(objB.width) || isUndefined(objB.height) ) {
  //   主动抛出错误， 把对象的信息作为错误信息 打印出来的
  // JSON.stringify 把对象中的内容 转换成字符串
    throw new Error('参数错误！' + '   ' + JSON.stringify(objA) + '   ' + JSON.stringify(objB))
  }

  //  获取A和B 的几何中心
  var centerA = getCenter(objA)
  var centerB = getCenter(objB)

  // 2个矩形的几何中心点 在X,Y轴上的距离， 必须都小于 两个矩形的宽/高之和的1/2，这种情况下 两个就发生了碰撞， 函数输出true
  return Math.abs(centerA.x - centerB.x) < (objA.width + objB.width) / 2  &&
  Math.abs(centerA.y - centerB.y) < (objA.height + objB.height) / 2
}

// 用于检测 一个对象与一组对象之间是否发生了碰撞
// 如果发生了碰撞， 我们就返回那一组对象中 被撞到的对象
function isCollideOneAndGroup(obj, group) {
  // 第一种写法： 直接遍历数组 找到碰撞的对象
  // var result = undefined

  // group.forEach(function(item){
  //   if(isCollide(item, obj)) {
  //     result = item
  //   }
  // })

  // return result

  //  第二写法 利用find可以写得更加简洁
  return group.find(function(item) {
    return isCollide(item, obj)
  })
}


// 再写一个碰撞函数 isCollideByGroup(groupA, groupB),
//  返回值就是 groupA和groupB中发生碰撞的对象
function isCollideByGroup(groupA, groupB) {
  var objA = undefined
  var objB = undefined
  for(var i =0; i < groupA.length; i++){
    for(var j = 0; j < groupB.length; j++) {
      if(isCollide(groupA[i], groupB[j])) {
        objA = groupA[i]
        objB = groupB[j]
      }
    }
  }
  return [objA, objB]
}


// function isCollideByGroup(groupA, groupB) {
//   var objA = undefined
//   var objB = undefined
//   groupA.forEach(function(obj){
//     objB = isCollideByGroup(obj, groupB)
//     if(objB) {
//       objA = obj
//     }
//   })

//   return [objA, objB]
// }