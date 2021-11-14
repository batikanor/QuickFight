// get reference to canvas
const canvas = document.getElementsByTagName('canvas')[0]
//const canvas = document.getElementById('canvas')
//const canvas = document.querySelector("#canvas") 

// get reference to rendering context
const ctx = canvas.getContext('2d'); 

// when window is first loaded
window.addEventListener("load", () => {
    console.log("Window has been loaded.");

    // disableScroll()



    // resizing
    resizeCanvas()


    
    ctx.fillText("Hey", 100, 100)
    ctx.fillRect(20,90,40,50)

    


    ctx.translate(100,100)
    renderAvatar()
    ctx.translate(0,40)
    renderShot()

})

function renderAvatar(){ 
        
    // draw avatar shape
    ctx.beginPath()
    ctx.arc(0,0,22,0, (3/2) * Math.PI)
    ctx.closePath()
    ctx.fillStyle = 'green'
    ctx.fill()

    // draw nickname
    ctx.textAlign = 'center'
    ctx.fillStyle = 'black'
    ctx.fillText('batikanor', 0, -25)

    // this is where rotation should go

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

function renderShot(){
    // ctx.beginPath()
    // ctx.arc(0,0,5,0,2*Math.PI);
    // ctx.closePath()
    // ctx.fillStyle = 'red'
    // ctx.fill()
    drawStar(0,0,5,4,2)
}
