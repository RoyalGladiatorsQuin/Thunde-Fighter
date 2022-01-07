var BGM = new Audio('./audio/bgm.mp3')
BGM.loop = true
var boom = new Audio('./audio/boom.mp3')
var bulletSound = new Audio('./audio/bullet.mp3')

// 封装一个新的声音对象 来生成更加复杂的声音播放效果 
//  构造函数
function Boom(boomList) {
    // clone 克隆 / 复制   Node节点
    this.audio = boom.cloneNode(true)
    // this.audio = new Audio('./audio/boom.mp3')

    this.play = function() {
        this.audio.play()
    }

    //  用that 把 this存储起来，在下面的事件函数中使用
    var that = this

    //  声音结束之后  会触发 onended事件 我们在事件处理函数中，把声音回收掉
    this.audio.onended = function() {
        console.log('爆炸播放结束')
        boomList.recycle(that)
    }
}