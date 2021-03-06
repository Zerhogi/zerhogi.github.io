function autoType(elementClass, typingSpeed){
    var thhis = $(elementClass);
    thhis.css({
      "position": "relative",
      "display": "inline-block"
    });
    thhis.prepend('<div class="cursor" style="right: initial; left:0;"></div>');
    thhis = thhis.find(".text-js");
    var text = thhis.text().trim().split('');
    var amntOfChars = text.length;
    var newString = "";
    thhis.text("");
    setTimeout(function(){
      thhis.css("opacity",1);
      thhis.prev().removeAttr("style");
      thhis.text("");
      for(var i = 0; i < amntOfChars; i++){
        (function(i,char){
          setTimeout(function() {        
            newString += char;
            thhis.text(newString);
          },i*typingSpeed);
        })(i+1,text[i]);
      }
    },1500);
  }
  
  $(document).ready(function(){
    // Now to start autoTyping just call the autoType function with the 
    // class of outer div
    // The second paramter is the speed between each letter is typed.   
    autoType(".type-js",300);
  }); 

  //PARTICLES
/* 'use strict'

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

//Створення частинки
class Particle {
    constructor (point, velocity, acceleration) {
        this.position = point || new Vector(0, 0);
        this.velocity = velocity || new Vector(0, 0);
        this.acceleration = acceleration || new Vector(0, 0);
    };
};

//Випромінювач частинок
class Emitter{
    constructor (point, velocity, spread){
        this.position = point; //вектор
        this.velocity = velocity; //вектор
        this.spread = spread || Math.PI / 32; //Можливий кут = швидкість +/- разброс
        this.drawColor = "#999";
    };
};

//Гравитационное поле
class Field {
    constructor(point, mass) {
        this.position = point;
        this.setMass(mass);
    };
};

function loop() {
    clear();
    update();
    draw();
    queue();
};

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

function update() {
    addNewParticles();
    plotParticles(canvas.width, canvas.height);
};

function draw() {
    drawParticles();
    fields.forEach(drawCircle);
    emitters.forEach(drawCircle);

};

function queue() {
    window.requestAnimationFrame(loop);
};

//створення вектора
class Vector {
    constructor (x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
};

//додавання векторів
Vector.prototype.add = function(vector) {
    this.x += vector.x;
    this.y += vector.y;
};

//дістати довжину вектора
Vector.prototype.getMagnitude = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

//дістати кут вектора, враховуючи квадрант
Vector.prototype.getAngel = function() {
    return Math.atan2(this.y, this.x);
};

//дістати новий вектор, маючи кут і розміри
Vector.fromAngle = function(angle, magnitude) {
    return new Vector(magnitude * Math.cos(angle), magnitude * 
    Math.sin(angle));
};



//Рух частинки
Particle.prototype.move = function() {
    
    //додаю прискорення до швидкості
    this.velocity.add(this.acceleration);
    
    //додаю швидкість до координат
    this.position.add(this.velocity);
};



//Випромінювання частинок
Emitter.prototype.emitParticle = function() {
    
    //Використовування випадкового кута для формування потоку частинок
    var angle = this.velocity.getAngel() + this.spread - (Math.random() * this.spread * 2);

    //Магнітуда швидкості випромінювача
    var magnitude = this.velocity.getMagnitude();

    //Координати випромінювача
    var position = new Vector(this.position.x, this.position.y);

    //Оновлена швидкість, отримана з вирахуваного  кута і магнітуди
    var velocity = Vector.fromAngle(angle, magnitude);

    //Повертаю частинку
    return new Particle(position, velocity);
};

var particles = [];

// Додаємо один випромінювач в координатах x,y від початку координат
// Початок випромінювання
var emitters = [
    new Emitter(new Vector(0, 0), Vector.fromAngle(0.635, 2)), 
    new Emitter(new Vector(724, 0), Vector.fromAngle(-0.635, -2)),
    new Emitter(new Vector(0, 524), Vector.fromAngle(-0.635, 2)),
    new Emitter(new Vector(724, 524), Vector.fromAngle(0.635, -2))
];

var maxParticles = 20000;
var emissionRate = 4; //кількість частинок за кадр

function addNewParticles() {
    
    //закінчити якщо досягнуто ліміту
    if (particles.length > maxParticles) return;

    //цикл для кожного випромінювача
    for (var i = 0; i < emitters.length; i++) {
        //генерація частинок згідно emissionRate
        for (var j = 0; j < emissionRate; j++ ) {
            particles.push(emitters[i].emitParticle());
        }
    }
};

function plotParticles(boundsX, boundsY) {
    //новий масив для частинок всередині холсту
    var currentParticles = [];

    for (var i = 0; i < particles.length; i++) {
        var particle = particles[i];
        var pos = particle.position;

        //якщо частинка замежами холсту, то пропускаємо її і переходим до іншої
        if (pos.x < 0 || pos.x > boundsX || pos.y < 0 || pos.y > boundsY) continue;

        //оновлення швидкості і прискорення в соответствии с гравітацією полів
        particle.submitToFields(fields);

        //рух частинки
        particle.move();

        //Додавання частинки в новий масив всередині холсту
        currentParticles.push(particle);
    }

    //Заміна глобально масиву частинок на масив без вилетівших за межі холсту
    particles = currentParticles;
};

var particleSize = 1;

function drawParticles() {
    //колір частинок
    ctx.fillStyle = 'rgb(0,255,0)';

    //цикл який відображає частинки
    for (var i = 0; i < particles.length; i++) {
        var position = particles[i].position;

        //малюємо квадрат заданих розмірів в заданих координатах
        ctx.fillRect(position.x, position.y, particleSize, particleSize);

    }
};

Field.prototype.setMass = function(mass) {
    this.mass = mass || 100;
    this.drawColor = mass < 0 ? "#f00" : "#0f0";
};

//Створюєм поле правіше випромінювача з від'ємною масою
var fields = [new Field(new Vector(363,262), -30)];

Particle.prototype.submitToFields = function (fields) {
    //початкове прискорення в кадрі
    var totalAccelerationX = 0;
    var totalAccelerationY = 0;

    //цикл по гравітаційним полям
    for (var i = 0; i < fields.length; i++) {
        var field = fields[i];

        //вираховуєм відстань між частинкою і полем
        var vectorX = field.position.x - this.position.x;
        var vectorY = field.position.y - this.position.y;

        //вираховуєм силу за допомогою МАГІЇ і НАУКИ!
        var force = field.mass / Math.pow(vectorX * vectorX + vectorY * vectorY, 1.5);

        //аккумулюєм прискорення в кадрі
        totalAccelerationX += vectorX * force;
        totalAccelerationY += vectorY * force;
    }
    //оновлюєм прискорення частинки
    this.acceleration = new Vector(totalAccelerationX, totalAccelerationY);
};
var objectSize = 4;
//`object` - поле або випромінювач(щось що має властивості drawColor і position)
function drawCircle(object) {
    ctx.fillStyle = object.drawColor;
    ctx.beginPath();
    ctx.arc(object.position.x, object.position.y, objectSize, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
};


//loop(); */
var canvas = document.querySelector("#scene"),
		ctx = canvas.getContext("2d"),
		particles = [],
        amount = 0,        
		mouse = {x:0,y:0},
		radius = 1;
        
    var colors = ["#0000ff"];
    var img = new Image();
    img.src = "/2d/img/12BytesLogo.png"

	var copy = document.querySelector("#copy");

	var ww = canvas.width = canvas.clientWidth;
	var wh = canvas.height = canvas.clientHeight;

	function Particle(x,y){
		this.x =  Math.random()*ww;
		this.y =  Math.random()*wh;
		this.dest = {
			x : x,
			y: y
		};
		this.r = 1; //Math.random()*5 + 2;
		this.vx = (Math.random()-0.5)*20;
		this.vy = (Math.random()-0.5)*20;
		this.accX = 0;
		this.accY = 0;
		this.friction = Math.random()*0.05 + 0.94;

		this.color = colors[Math.floor(Math.random()*6)];
	}

	Particle.prototype.render = function() {


		this.accX = (this.dest.x - this.x)/1000;
		this.accY = (this.dest.y - this.y)/1000;
		this.vx += this.accX;
		this.vy += this.accY;
		this.vx *= this.friction;
		this.vy *= this.friction;

		this.x += this.vx;
		this.y += this.vy;

		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
		ctx.fill();

		var a = this.x - mouse.x;
		var b = this.y - mouse.y;

		var distance = Math.sqrt( a*a + b*b );
		if(distance<(radius*40)){
			this.accX = (this.x - mouse.x)/100;
			this.accY = (this.y - mouse.y)/100;
			this.vx += this.accX;
			this.vy += this.accY;
		}

	}    
    
	/* function onMouseMove(e){        
        mouse.x = e.clientX;
		mouse.y = e.clientY;
    } */
    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }
    

	/* function onTouchMove(e){
    if(e.touches.length > 0 ){
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
	}

function onTouchEnd(e){
  mouse.x = -9999;
  mouse.y = -9999;
} */
    img.onload = function() {
        ctx.drawImage(img,ww/ww,wh/wh,canvas.width,canvas.height);
        initScene();
    };
	function initScene(){
		ww = canvas.clientWidth; //= window.innerWidth;
		wh = canvas.clientHeight; //= window.innerHeight;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		//ctx.font = "bold "+(ww/5)+"px sans-serif";
		//ctx.textAlign = "center";
		//ctx.fillText("12bytes", ww/2, wh/1.7);
        //img.onload = function() {
            ctx.drawImage(img,ww/ww,wh/wh,canvas.width,canvas.height);
        //};
		var data  = ctx.getImageData(0, 0, ww, wh).data;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.globalCompositeOperation = "screen";

		particles = [];
		for(var i=0;i<ww;i+=Math.round(ww/200)){
			for(var j=0;j<wh;j+=Math.round(ww/200)){
				if(data[ ((i + j*ww)*4) + 3] >150){
					particles.push(new Particle(i,j));
				}
			}
		}
		amount = particles.length;

	}

	function onMouseClick(){
        initScene();        
	}

	function render(a) {
		requestAnimationFrame(render);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (var i = 0; i < amount; i++) {
			particles[i].render();
		}
	};

	//copy.addEventListener("keyup", initScene);
	window.addEventListener("resize", initScene);
	canvas.addEventListener("mousemove", function(evt){
        var mousePos = getMousePos(canvas, evt);
        mouse.x = mousePos.x;
        mouse.y = mousePos.y;
    });
	//window.addEventListener("touchmove", onTouchMove);
	window.addEventListener("click", onMouseClick);
	//window.addEventListener("touchend", onTouchEnd);
	initScene();
	requestAnimationFrame(render);



//плавная прокрутка
var $page = $('html, body');
$('a[href*="#"]').click(function() {
    $page.animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 1000);
    return false;
});
