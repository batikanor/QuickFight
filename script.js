// SYSTEM DEPENDENT VARIABLES

// get reference to canvas
const canvas = document.getElementsByTagName('canvas')[0]
//const canvas = document.getElementById('canvas')
//const canvas = document.querySelector("#canvas") 

// get reference to rendering context
const ctx = canvas.getContext('2d'); 



// GAME DEPENDENT VARIABLES
const SHOT_SPEED = 5
const PLAYER_SPEED = 3
const keyboardState = {}


// when window is first loaded
window.addEventListener("load", () => {
    console.log("Window has been loaded.");

    // disableScroll()



    // resizing
    resizeCanvas()

    // game
    gameLoop()



})

function renderAvatar(player){
    ctx.save() 
    ctx.translate(player.x, player.y)
    // draw avatar shape
    ctx.beginPath()
    ctx.arc(0,0,22,0, (3/2) * Math.PI)
    ctx.closePath()
    ctx.fillStyle = player.color
    ctx.fill()

    // draw nickname
    ctx.textAlign = 'center'
    ctx.fillStyle = 'black'
    ctx.fillText(player.nickname, 0, -25)

    // rotate
    ctx.rotate(player.rotation)


    // setting location of eyes and mouth (for direction)
    ctx.beginPath()
    ctx.moveTo(-5, 5)
    ctx.lineTo(-5, 17)
    ctx.moveTo(5,5)
    ctx.lineTo(5,17)
    ctx.strokeStyle = "#FF0000"; 
    ctx.strokeRect(8, 0, 5, 5);
    ctx.strokeRect(8, 10, 5, 5);
    ctx.strokeStyle = "#FFFFFF"; 
    ctx.stroke()


    ctx.restore()
}

window.addEventListener("resize",resizeCanvas)

function resizeCanvas() {
    canvas.width = window.innerWidth * 90 / 100
    canvas.height = window.innerHeight * 90 / 100
    console.log("Resized canvas to: " + canvas.width + " x " + canvas.height)
}

// thanks geeksforgeeks
function disableScroll() {
    // Get the current page scroll position
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
  
        // if any scroll is attempted, set this to the previous value
        window.onscroll = function() {
            window.scrollTo(scrollLeft, scrollTop);
        };
}

// thanks markE and Andrei Volgin
function drawStar(cx,cy,spikes,outerRadius,innerRadius){
    var rot=Math.PI/2*3;
    var x=cx;
    var y=cy;
    var step=Math.PI/spikes;

    ctx.beginPath();
    ctx.moveTo(cx,cy-outerRadius)
    for(i=0;i<spikes;i++){
      x=cx+Math.cos(rot)*outerRadius;
      y=cy+Math.sin(rot)*outerRadius;
      ctx.lineTo(x,y)
      rot+=step

      x=cx+Math.cos(rot)*innerRadius;
      y=cy+Math.sin(rot)*innerRadius;
      ctx.lineTo(x,y)
      rot+=step
    }
    ctx.lineTo(cx,cy-outerRadius);
    ctx.closePath();
    ctx.lineWidth=5;
    ctx.strokeStyle='red';
    ctx.stroke();
    ctx.fillStyle='darkRed';
    ctx.fill();
}

function renderShot(shot){
    // ctx.beginPath()
    // ctx.arc(0,0,5,0,2*Math.PI);
    // ctx.closePath()
    // ctx.fillStyle = 'red'
    // ctx.fill()

    ctx.save()
    ctx.translate(shot.x, shot.y)

    drawStar(0,0,5,4,2)
    ctx.restore()
}


const gameState = {
    players: [
        {
            nickname: 'batikanor',
            x: 50, y: 50,
            color: '#9c9cc2',
            shots: [
                {
                    x: 50, y: 150,
                    vx: 0, vy: SHOT_SPEED
                },
                {
                    x:50, y: 300,
                    vx: SHOT_SPEED, vy: 0

                }
            ],
            rotation: Math.PI / 2,
        },
        {
            nickname: 'player1',
            x: 200, y: 100,
            color: "#92E548",
            shots: [],
            rotation: 0
        }
    ]
}

document.addEventListener('keydown', function(e) {
    keyboardState[e.key] = true
})

document.addEventListener('keyup', function(e) {
    keyboardState[e.key] = false
})



function render (state) {
    // clear canvas so that shots get cleaned after they're drawn on thier new locations
    ctx.fillStyle = 'white'
    ctx.fillRect(0,0,canvas.width, canvas.height)


    state.players.forEach(function (player) {
   
        renderAvatar(player)
        player.shots.forEach(function (shot){

            renderShot(shot)
        })
    })
}

function gameLoop () {
    requestAnimationFrame(gameLoop)
    gameLogic(gameState)
    render(gameState)

}

function gameLogic(state) {
    state.players.forEach(player => {
        player.shots.forEach(shot => {
            shot.x += shot.vx // speed of shot in dimension x
            shot.y += shot.vy
        })
    })

    // moving first player for test
    if (keyboardState.w ) {
        state.players[0].y -= PLAYER_SPEED
    }

}
