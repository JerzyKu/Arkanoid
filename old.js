//  width="800" height="600"
let canvas;
let canvasContext;

const FPS = 60;
let bricsList = [];

// PADDLE DIMENCTION
const PADDLE_WIDTH = 100;
const PADDLE_THIC = 10;

// PADDLE BEG POSITION
let paddlePos = {
    x: 400 - (PADDLE_WIDTH / 2),
    y: 600 - PADDLE_THIC - 1
}

let ball = {
    x: 0,
    y: 0,
    speedY: -1,
    speedX: 1,
    radius: 4,
    color: 'yellow',
    move: function(){
        this.x += this.speedX;
        this.y += this.speedY;
    },
    bounceY: function(){
        this.speedY *= -1;
    },
    bounceX: function() {
        this.speedX *= -1;
    },
    res: function() {
        this.x=499;
        this.y=322;
    }
}

class Brick {
    constructor(x,y,w,h,c='white'){
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=h;
        this.c=c;
    }

    isBallBounce(ball){
        // ⇘
        if (ball.speedX > 0 && ball.speedY > 0){
            if(ball.x == this.x && ball.y == this.y){
                return "Both";
            }
            else if (ball.x == this.x && ball.y >= this.y && ball.y <= this.y + this.w){
                return "X";
            }
            else if (ball.y == this.y && ball.x >= this.x && ball.x <= this.x + this.h){
                return "Y"
            }
        }
        // ⇖
        else if (ball.speedX < 0 && ball.speedY < 0){
            if(ball.x == this.x + this.h && ball.y == this.y + this.w){
                return "Both";
            }
            else if (ball.x == this.x + this.h && ball.y >= this.y && ball.y <= this.y + this.w){
                return "X";
            }
            else if (ball.y == this.y + this.w &&  ball.x >= this.x && ball.x <= this.x + this.h){
                return "Y";
            }
        }
        // ⇗
        else if (ball.speedX < 0 && ball.speedY > 0){
            if (ball.x == this.x + this.h && ball.y == this.y){
                return "Both";
            }
            else if(ball.x == this.x + this.h && ball.y >= this.y && ball.y <= this.y + this.w){
                return "X";
            }
            else if(ball.y == this.y && ball.x >= this.x && ball.x <= this.x + this.h){
                return "Y";
            }
        }
        // ⇙
        else if (ball.speedX > 0 && ball.speedY < 0){
            if(ball.x == this.x && ball.y == this.y + this.w){
                console.log(ball);
                console.log(this);
                return "Both";
            }
        }
        return 0;
    }
   
    
}

function generateBricsV1(){
    for(let i = 0; i < 800-1; i += 20){
        for(let j = 0; j < 500; j += 10){
            bricsList.push(new Brick(i,j,20,10,"#"+Math.floor(Math.random()*16777215).toString(16)));
        }
    }
    bricsList.reverse()
    // console.log(bricsList);
}

function generateTestBrick(){
    bricsList.push(new Brick(0,100,100,50));
    bricsList.push(new Brick(100,100,100,50,'green'));
}

// magic ?? wtf 
window.onload = function () {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    // generateBricsV1();
    generateTestBrick();
    
    setInterval(function () {
        for (let i = 0; i < 1; i++) {
            moveEverything();
        }

        drawEverything();
    }, 1000 / FPS);

    canvas.addEventListener('mousemove',
        function (evt) {
            const mousePos = calculateMousePos(evt);
            paddlePos.x = mousePos.x - (PADDLE_WIDTH / 2);
        }
    );

}

// to future understud required to mause and paddle movment 
function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {x:mouseX,y:mouseY};
}

function drawEverything() {
    // black board
    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    // brics
    for(let i = 0; i < bricsList.length; i++){
        colorRect(bricsList[i].x,bricsList[i].y,bricsList[i].w,bricsList[i].h,bricsList[i].c);
    }

    // paddle
    colorRect(paddlePos.x, paddlePos.y, PADDLE_WIDTH, PADDLE_THIC, 'white');

    // ball 
    colorCircle(ball.x,ball.y,ball.radius,ball.color);
    // alert("no to co dalej?");
}

function moveEverything() {
    
    // autoplay
    paddlePos.x = ball.y - 50;
    // bottom border
    if (ball.x > 600 - 11){
        if(ball.y > paddlePos.x && ball.y < paddlePos.x+PADDLE_WIDTH){
            ball.bounceX();
        }
        else {
            ball.res();
        }
    }
    if (ball.x < 0) {
        ball.bounceX();

    }
    if (ball.y > 800 || ball.y < 0 ){
        ball.bounceY();
    }
    // brics and ball colisions
    for(let i = 0; i < bricsList.length; i++){
        let is = bricsList[i].isBallBounce(ball);
        switch (is) {
            case "X":
                ball.bounceX();
                break;
            case "Y":
                ball.bounceY();
                break;
            case "Both":
                ball.bounceY();
                ball.bounceX();
                break;
            default:
        }
    }

    // console.log(bricsList.length);
    ball.move();
}

function colorRect(x, y, w, h, c = 'white') {
    canvasContext.fillStyle = c;
    canvasContext.fillRect(x, y, w, h);
}

function colorCircle(x,y,r,c = 'white'){
    canvasContext.fillStyle = c;
    canvasContext.beginPath();
    // ox oy radius beginRad endRad direction
    canvasContext.arc(x,y,r,0,2*Math.PI, true);
    canvasContext.fill();
}