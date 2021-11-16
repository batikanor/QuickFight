// SYSTEM DEPENDENT VARIABLES

// get reference to canvas
const canvas = document.getElementsByTagName('canvas')[0]
//const canvas = document.getElementById('canvas')
//const canvas = document.querySelector("#canvas") 

// get reference to rendering context
const ctx = canvas.getContext('2d'); 

const socket = io();


// GAME DEPENDENT VARIABLES
const SHOT_SPEED = 5
const PLAYER_SPEED = 3
const AVATAR_RADIUS = 20
const SHOT_RADIUS = 8
const keyboardState = {}
const DIRECTION = {
	UP: 0,
	DOWN: 1,
	LEFT: 2,
	RIGHT: 3
}


// when window is first loaded
window.addEventListener("load", () => {
    console.log("Window has been loaded.");

    disableScroll()



    // resizing
    resizeCanvas()

    // game
    gameLoop()



})

function renderAvatar(player){
    
    if (player.eliminated) return

    ctx.save() 
    ctx.translate(player.x, player.y)
    
    // draw avatar shape


    ctx.beginPath()
    ctx.arc(0,0,AVATAR_RADIUS,0, 2 * Math.PI)
    ctx.closePath()
    var my_gradient = ctx.createLinearGradient(0, 0, 0, 170);
    my_gradient.addColorStop(0, "black");
    my_gradient.addColorStop(1, "white");
    ctx.fillStyle = my_gradient
    ctx.fill()

    ctx.beginPath()
    var my_gradient = ctx.createLinearGradient(0, 0, 0, 170);
    ctx.arc(0,0,AVATAR_RADIUS,0, (3/2) * Math.PI)
    ctx.closePath()

    my_gradient = ctx.createLinearGradient(100, 0, 0, 170);
    my_gradient.addColorStop(0, player.color);
    my_gradient.addColorStop(1, "black");
    ctx.fillStyle = my_gradient
    // ctx.fillStyle = player.color
    ctx.fill()

 
    // draw nickname
    ctx.textAlign = 'center'
    ctx.fillStyle = 'black'
    ctx.fillText(player.nickname, 0, -25)

    // rotate
    switch (player.direction){
        case DIRECTION.UP:
            ctx.rotate(Math.PI)
            break
        case DIRECTION.DOWN: 
            ctx.rotate(0)
            break
        case DIRECTION.LEFT:
            ctx.rotate(Math.PI / 2)
            break
        case DIRECTION.RIGHT:
            ctx.rotate(Math.PI * 1.5)
            break

    }


    drawMouth()



    ctx.restore()
}

function drawMouth(){
    ctx.beginPath()
    ctx.moveTo(-5, 5)
    ctx.lineTo(-5, 17)
    ctx.moveTo(5,5)
    ctx.lineTo(5,17)
    ctx.stroke()
}
function drawEyes(){
    ctx.strokeStyle = "#FF0000"; 
    ctx.strokeRect(8, 0, 5, 5);
    ctx.strokeRect(8, 10, 5, 5);
    ctx.strokeStyle = "#FFFFFF"; 
    ctx.stroke() 
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

function drawCircle(color){
    ctx.beginPath()
    ctx.arc(0,0,SHOT_RADIUS,0,2*Math.PI);
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
}
// thanks markE and Andrei Volgin
function drawStar(cx,cy,spikes,outerRadius,innerRadius, outerColor, innerColor){
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
    ctx.strokeStyle = outerColor;
    ctx.stroke();
    ctx.fillStyle = innerColor;
    ctx.fill();
}

function renderShot(shot){
 

    ctx.save()
    ctx.translate(shot.x, shot.y)

    var my_gradient = ctx.createLinearGradient(100, 0, 0, 170);
    my_gradient.addColorStop(0, "black");
    my_gradient.addColorStop(1, "darkred");
    
    drawCircle(my_gradient)
    // drawStar(0,0,2,4,2, "green", "darkRed")

    ctx.restore()
}


const gameState = {
    players: [
        {
            nickname: prompt('Type in your nickname (max 20 chars)').substring(0,20),
            playerId: Math.floor(Math.random() * 100000000),
            x: Math.random() * (canvas.width), y: Math.random() * canvas.height,
            // color: '#9c9cc2',
            color: 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)',
            shots: [
                // {
                //     x: 50, y: 150,
                //     vx: 0, vy: SHOT_SPEED
                // },
                // {
                //     x:50, y: 300,
                //     vx: SHOT_SPEED, vy: 0

                // }
            ],
            direction: DIRECTION.RIGHT
        },
        // {
        //     nickname: 'player1',
        //     x: 200, y: 100,
        //     color: "#92E548",
        //     shots: [],
        //     direction: DIRECTION.RIGHT
        // }
    ]
}

const myPlayerId = gameState.players[0].playerId 

document.addEventListener('keydown', function(e) {
    keyboardState[e.key] = true
    
    if (e. key === ' ') {
        const myPlayer = gameState.players[0] // for now
        const shot = {
            x: myPlayer.x, y: myPlayer.y,
            vx: 0, vy: 0
        }
        switch(myPlayer.direction){
            case DIRECTION.UP:
                shot.vy = -SHOT_SPEED
                break
            case DIRECTION.DOWN:
                shot.vy = SHOT_SPEED
                break
            case DIRECTION.LEFT:
                shot.vx = -SHOT_SPEED
                break
            case DIRECTION.RIGHT:
                shot.vx = SHOT_SPEED
                break
        }
        myPlayer.shots.push(shot)

    }
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
function hitTestPlayerVsShot(player, shot) {
    // hipotenus
    return Math.sqrt(Math.pow(player.x - shot.x, 2) + Math.pow(player.y - shot.y, 2)) < (SHOT_RADIUS + AVATAR_RADIUS)
}
function hitTestPlayerVsPlayer(playerA, playerB) {
    // hipotenus
    return Math.sqrt(Math.pow(playerA.x - playerB.x, 2) + Math.pow(playerA.y - playerB.y, 2)) < (AVATAR_RADIUS * 2)
}

function gameLogic(state) {
    state.players.forEach(player => {
        player.shots.forEach(shot => {
            shot.x += shot.vx // speed of shot in dimension x
            shot.y += shot.vy

            if (shot.x < 0 || shot.y < 0 || shot.x > canvas.width || shot.y > canvas.height) {
                shot.remove = true
            }
        })
        player.shots = player.shots.filter(shot => {
            return shot.remove !== true
        })


    })





    // moving first player for test
    const myPlayer = state.players[0]

    if (!myPlayer.eliminated){

        if (keyboardState.w ) {
            myPlayer.y -= PLAYER_SPEED
            myPlayer.direction = DIRECTION.UP
        }
        if (keyboardState.s ) {
            myPlayer.y += PLAYER_SPEED
            myPlayer.direction = DIRECTION.DOWN
        }
        if (keyboardState.d ) {
            myPlayer.x += PLAYER_SPEED
            myPlayer.direction = DIRECTION.RIGHT
        }
        if (keyboardState.a ) {
            myPlayer.x -= PLAYER_SPEED
            myPlayer.direction = DIRECTION.LEFT
        }
    
    }

    // collision algorithm here
    state.players.forEach(playerA => {
        playerA.shots.forEach(shot =>{
            state.players.forEach(playerB =>{
                if (playerA === playerB) {
                    // shouldn't detect self hit
                    return
                }
                if (hitTestPlayerVsShot(playerB, shot)){
                    shot.remove = true
                    if (playerB.playerId === myPlayerId){
                        // others must remove themselves
                        playerB.eliminated = true
                    }

                }

            })

        })
        state.players.forEach(player => {

        })
    })
    // remove elimnated players
    // state.players = state.players.filter(player => !player.eliminated);
    socket.emit('stateUpdate', state.players[0])
}

socket.on('stateUpdateForwardedByServer', function(player){
    if (player.playerId === myPlayerId){
        // ignore own update
        return
    }

    let playerWasFound = false
    for (let i = 0; i < gameState.players.length; ++i){
        if (gameState.players[i].playerId === player.playerId){
            gameState.players[i] = player
            playerWasFound = true
            break // loop done, no need to continue
        }
    }
    // gameState.players.forEach 

    if (!playerWasFound) {
        // player that is newly introduced
        gameState.players.push(player)
    }
})