// 获取图片对象
var bg = new Image();
bg.src = "./images/bg.jpg";

var playerImg = new Image();
playerImg.src = "./images/hero.png";

var background = {
	x: 0,
	y: 0,
	img: bg,
	speed: 2,
	// move移动方法， 专门存放和 background 坐标改变 相关的代码
	move: function() {
		this.y += this.speed;
		// 随着画布不断往下移动，当背景图即将要离开画布时， 则重置背景图位置
		if (this.y > HEIGHT) {
			this.y = 0;
		}
	},
	//  draw绘制方法， 把背景绘制到画布上的一些代码
	draw: function(ctx) {
		// 绘制背景, 第一张，刚好和画布一样大小
		ctx.drawImage(this.img, this.x, this.y, WIDTH, HEIGHT);
		// 第二张初始位置是在第一张的正上方，画布之外
		ctx.drawImage(this.img, this.x, this.y - HEIGHT, WIDTH, HEIGHT);
	},
};

//  player玩家
var player = {
	x: 225,
	y: 650,
	width: PLAYER_WIDTH,
	height: PLAYER_HEIGHT,
	img: playerImg,
	isLiving: false,
	draw: function(ctx) {
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
	},
	//  初始化， 通常只被执行一次
	init: function(canvas) {
		canvas.onmousemove = function(evt) {
			// 事件处理函数 this指向是 事件源
			// console.log(this)
			player.x = evt.offsetX - player.width / 2;
			player.y = evt.offsetY - player.height / 2;

			//  边缘检测
			if (player.x < 0) {
				player.x = 0;
			}
			if (player.x > WIDTH - player.width) {
				player.x = WIDTH - player.width;
			}
		};
	},
};

var enemyImg = new Image();
enemyImg.src = "./images/enemy.png";

// 单架敌机的对象的写法
// var enemy = {
//   x: 0,
//   y: 0,
//   width: ENEMY_WIDTH,
//   height: ENEMY_HEIGHT,
//   speed: ENEMY_SPEED,
//   img:  enemyImg,
//   move: function() {
//     this.y += this.speed
//   },
//   draw: function(ctx) {
//     ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
//   }
// }

//  敌机构造函数
function Enemy(x, y, speed) {
	this.x = x;
	this.y = y;
	this.width = ENEMY_WIDTH;
	this.height = ENEMY_HEIGHT;
	this.speed = speed;
	this.img = enemyImg;
	// 敌机移动
	this.move = function(enemyList) {
		this.y += this.speed;
		//  如果发现 当前敌机对象的y坐标超过了画布，就把当前的敌机对象回收
		if (this.y > HEIGHT + 100) {
			// 敌机数组回收
			enemyList.recycle(this);
		}
	};
	// 敌机绘制
	this.draw = function(ctx) {
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
	};

	// 能够让敌机在生成之后 随机的1-3秒钟之间， 速度变成初始速度的1-3倍
	//  用到延时定时器 Timeout
	this.timer = setTimeout(() => {
		this.speed = this.speed * getRandomInt(1, 3);
	}, 1000 * getRandomInt(0, 2));
}

var bulletImg = new Image();
bulletImg.src = "./images/bullet.png";

var bulletImg1 = new Image();
bulletImg1.src = "./images/bullet1.png";

// 构造函数生成子弹对象
function Bullet(x, y, width, height, img, speed) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.img = img;
	this.speed = speed;

	this.move = function(bulletList) {
		this.y -= this.speed;

		if (this.y < -this.height) {
			// 回收玩家发射的子弹
			bulletList.recycle(this);
		}
	};

	this.draw = function(ctx) {
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
	};
}

// 用来生成 管理对象的容器的构造函数
function ObjList() {
	this.data = [];
	this.recycle = function(obj) {
		//  从 data数组中 查找 看传进来的对象是不是在data数组中的  如果在就返回索引值
		var index = this.data.findIndex(function(item) {
			return item === obj;
		});

		if (index !== -1) {
			this.data.splice(index, 1);
		}
	};

	//  清空数组
	this.clear = function() {
		this.data = [];
	};
}

//  创建一个爆炸图片数组， 把19张图片放进去
var explosionImg = [];

for (var i = 1; i <= 19; i++) {
	var img = new Image();
	img.src = `./images/explosion${i}.png`;
	explosionImg.push(img);
}

function Explosion(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.imgList = explosionImg; // 爆炸对象的图片数组
	this.count = 0; // 计数 计算当前应该绘制 哪一张爆炸的图片
	this.num = 0; // 总计数

	//  绘制爆炸
	this.draw = function(ctx) {
		//  把this.count中的数 作为 图片数组的索引 来决定在画布上绘制哪一张图
		ctx.drawImage(
			this.imgList[this.count],
			this.x,
			this.y,
			this.width,
			this.height
		);
	};
	//  在move方法中  我们改变 count从而来控制  画布上绘制出动态的爆炸效果
	this.move = function(explosionList) {
		this.num++; // 每次调用move方法  就让num 增长
		//  我们要实现一个效果： 爆炸开始时 先依次从0-18绘制爆炸的图像， 到18之后 再从18-0反着绘制一遍图像
		// 所以就可以利用 this.num这个属性 ，它小于18时  this.count ++， 大于等于18时  this.count --
		if (this.num < 18) {
			//
			this.count++;
		} else {
			this.count > 0 && this.count--;
		}

		// 最后当this.num 大于37时， 相当于  所有的爆炸图片  正着画了一遍 再反着画了一遍 ，爆炸的绘制结束
		if (this.num > 37) {
			// this.num = 0
			// this.count = 0
			//  当 this.num 大于37 就认定爆炸已经 已经绘制完成， 就把爆炸对象回收掉
			explosionList.recycle(this);
		}
	};
}

var lightImg = new Image();
lightImg.src = "./images/light.png";

// 激光子弹的构造函数
function LightBullet(x, y) {
	this.x = x;
	this.y = y;
	this.width = 20;
	this.height = 100;
	this.img = lightImg;
	this.speed = 20;
	this.isPersist = true; 

	this.move = function(bulletList, player) {
		this.y -= this.speed;

		// 玩家移动的时候，子弹的x坐标跟着玩家的x坐标同步移动
		this.x = player.x + player.width / 2 - BULLET_WIDTH / 2;

		if (this.y < -this.height) {
			bulletList.recycle(this);
		}
	};

	this.draw = function(ctx) {
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
	};
}

//  boss的构造函数
var bossImg = new Image();
bossImg.src = "./images/boss.png";

function Boss() {
	this.x = WIDTH / 2 - 125;
	this.y = -250;
	this.width = 250;
	this.height = 250;
	this.img = bossImg;
	this.HP = 2000
	this.show = false
	this.movingRight = true; // 决定boss是左移还是右移的一个参数

	this.move = function() {
		// boss出场后 先向下移动
		if (this.y < 50) {
			this.y += 1;
		} else {
			// 然后再左右移动
			if (this.movingRight) {
				this.x += 3;
				//  右边到头了就左移
				if (this.x >= WIDTH - this.width) {
					this.movingRight = false;
				}
			} else {
				this.x -= 3;
				// 左边到头了就右移
				if (this.x <= 0) {
					this.movingRight = true;
				}
			}
		}
	};
	this.draw = function(ctx) {
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
	};

	//  boss发射子弹的方法
	this.fire = function(enemyBulletList) {
		//  一次发射3颗子弹 向玩家散射
		enemyBulletList.data.push(new EnemyBullet(this.x + this.width / 2 - 7, this.y + this.height, DOWN))
		enemyBulletList.data.push(new EnemyBullet(this.x + this.width / 2 - 7, this.y + this.height, LEFT))
		enemyBulletList.data.push(new EnemyBullet(this.x + this.width / 2 - 7, this.y + this.height, RIGHT))
	}

	// boss 在快挂的时候的效果
	this.dying = function(explosionList) {
		for (var i = 0; i < 5; i++) {
			explosionList.data.push(new Explosion(getRandomInt(this.x, this.x + this.width),
				getRandomInt(this.y, this.y + this.height), 100, 100))
		}
	}
}



var enemeyBulletImg = new Image()
enemeyBulletImg.src = './images/noodle.png'

//  建议这几个表示方向的常量 放到setting.js里
// var DOWN = 0
// var LEFT = 1
// var RIGHT = 2
// 敌机子弹的构造函数
function EnemyBullet(x, y, direction) {
	this.x = x
	this.y = y
	this.width = 15
	this.height = 15
	this.img = enemeyBulletImg
	this.direction = direction // 子弹飞行的方向
	this.speed = 5

	this.move = function(enemyBulletList) {
		if (this.direction === DOWN) {
			this.y += this.speed
		}
		if (this.direction === LEFT) {
			this.y += this.speed / 1.2
			this.x -= this.speed / 1.5
		}
		if (this.direction === RIGHT) {
			this.y += this.speed / 1.2
			this.x += this.speed / 1.5
		}

		//  飞出画布  回收子弹
		if (this.y > HEIGHT || this.x < -this.width || this.x > WIDTH) {
			enemyBulletList.recycle(this)
		}
	}


	this.draw = function(ctx) {
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
	};

}
