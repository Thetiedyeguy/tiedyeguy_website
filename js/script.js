window.onload = startup;
// current mouse position variables
var mouseX = 0;
var mouseY = 0;


// circular tables (rounds & cocktail): type, radius
var rounds = {
    type : "circle",
    radius : 20
};
var cocktail = {
    type: "circle",
    radius: 10
};

// rectangular tables (MPR Tables): type, width, length
var mprRectangle = {
    type :"rectangle",
    width : 36,
    length : 18
};

// chairs (MPR chairs): type, width, length
var mprChair = {
    type : "rectangle",
    width : 2,
    length : 2
};

// list representing the current available supply types
var supply = [rounds, cocktail, mprRectangle, mprChair];

// list of all the current supply amounts. The index correlates to the above supply list to distinguish the type.
var supplyAmt = [12, 5, 10, 160]

// list of all object locations
var objectX = [0];
var objectY = [0];

// list of the object type each object is by referencing the supply list. Inititialized with a -1 to show no objects are currently selected
var objectType = [-1];

// which object is the most recent object/how many objects are there
var currentObject = 0;

function startup() {
    // get started by drawing what is available
    drawSelectionArea();
    drawAVArea();

    // set which function are called on different inputs
    document.getElementById("drawingArea").onmousemove = mouseMove;
    document.getElementById("drawingArea").onmousedown = canvasClick;
    document.getElementById("storageArea").onmousemove = mouseMove;
    document.getElementById("storageArea").onmousedown = chooseObject;
    document.getElementById("avArea").onmousemove = mouseMove;
    document.getElementById("avArea").onmousedown = updateAV;

    // make sure the webpage is constantly checking for updates
    loop();
}


function loop(){
    drawObjects(mouseX - 160, mouseY);
    requestAnimationFrame(loop);
}

// update the current mouse location variables
function mouseMove(evt) {
    mouseX = evt.clientX;
    mouseY = evt.clientY;
}

// draws all of the currently placed objects + the object currently being placed
function drawObjects(x, y) {

    // sets the current object to be on top of the mouse
    objectX[currentObject] = x;
    objectY[currentObject] = y;

    // initilizes the drawing area/canvas
    var canvas = document.getElementById("drawingArea");
    var ctx = canvas.getContext("2d");

    // clears all the previous tables to get a blank canvas
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // loops through all placed objects
    for(var i = 0; i < currentObject + 1; i++){
        // avoids drawing an object when none is selected
        if(objectType[i] != -1){
            if(supply[objectType[i]].type === "circle"){
                // draws all of the circular objects
                ctx.beginPath();
                ctx.arc(objectX[i], objectY[i], supply[objectType[i]].radius, 0, 2 * Math.PI);
                ctx.lineWidth = 3;
                ctx.strokeStyle = "black";
                ctx.stroke();
            }else{
                // draws all of the rectangular objects
                ctx.beginPath();
                ctx.rect(objectX[i] - (supply[objectType[i]].width / 2), objectY[i] - (supply[objectType[i]].length / 2), supply[objectType[i]].width, supply[objectType[i]].length);
                ctx.lineWidth = 3;
                ctx.strokeStyle = "black";
                ctx.stroke();
            }
        }
    }
}

// updates which object is selected when clicked
function chooseObject(){
    objectType[currentObject] = (mouseY - (mouseY % 160))/ 160;
    drawSelectionArea()
}

// updates the av information based on where the mouse was clicked on the screen
function updateAV(){
    objectType[currentAV] = (mouseY - (mouseY % 160))/ 160;
    drawAVArea()
}

// draws the equitment selction area (only triggered when an update to the area is needed to avoid redundancy)
function drawSelectionArea(){
    // initilize and clear drawing area
    var canvas = document.getElementById("storageArea");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // highlights the currently selected object
    ctx.fillStyle = "cyan";
    ctx.fillRect(5, 5 + (objectType[currentObject] * 160), 150, 150);

    // draws all of the supply
    for(var i = 0; i < supply.length; i++){
        ctx.fillStyle = "black";    
        // shows the amount left of each object
        ctx.fillText(supplyAmt[i], 130, 130 + (160 * i));
        if(supply[i].type === "circle"){
            // draws the circular objects
            ctx.beginPath();
            ctx.arc(80, (i * 160) + 80, supply[i].radius, 0, 2 * Math.PI);
            ctx.lineWidth = 3;
            ctx.strokeStyle = "black";
            ctx.stroke();
        }else{
            // draws the rectangular objects
            ctx.beginPath();
            ctx.rect(80 - (supply[i].width / 2), (i * 160) + 80 - (supply[i].length / 2), supply[i].width, supply[i].length);
            ctx.lineWidth = 3;
            ctx.strokeStyle = "black";
            ctx.stroke();
        }
    }
}

function drawAVArea(){
    var canvas = document.getElementById("storageArea");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "cyan";
    ctx.fillRect(5, 5 + (objectType[currentObject] * 160), 150, 150);

    for(var i = 0; i < supply.length; i++){
        ctx.fillStyle = "black";
        ctx.fillText(supplyAmt[i], 130, 130 + (160 * i));
        if(supply[i].type === "circle"){
            ctx.beginPath();
            ctx.arc(80, (i * 160) + 80, supply[i].radius, 0, 2 * Math.PI);
            ctx.lineWidth = 3;
            ctx.strokeStyle = "black";
            ctx.stroke();
        }else{
            ctx.beginPath();
            ctx.rect(80 - (supply[i].width / 2), (i * 160) + 80 - (supply[i].length / 2), supply[i].width, supply[i].length);
            ctx.lineWidth = 3;
            ctx.strokeStyle = "black";
            ctx.stroke();
        }
    }
}

// detects which object is being hovered over for the purpose of deletion and collision detection (collision detection not yet working)
function detectHoveredObject(){
    var x = mouseX
    var y = mouseY
    if(objectType[0] == -1){
        return -1;
    }
    for(var i = objectType.length - 2; i >=0 ; i--){
        var iObject = supply[objectType[i]];
        if(iObject.type === "circle"){
            var deltaX = objectX[i] + 160 - x;
            var deltaY = objectY[i] - y;
            var distance = Math.sqrt(deltaX*deltaX + deltaY*deltaY)
            if(distance <= iObject.radius + 5){
                return i;
            }
        }else if(iObject.type === "rectangle"){
            var deltaX = Math.abs(objectX[i] + 160 - x);
            var deltaY = Math.abs(objectY[i] - y);
            if(deltaX <= (iObject.width / 2) + 5 && deltaY <= (iObject.length / 2) + 5){
                return i;
            }
        }
    }
    return -1;
}

// deletes the currently hovered object
function deleteObject(number){
    // does nothing if not currently hovering an object
    if(number == -1){
        return false;
    }
    // replenishes the stock of the deleted item
    supplyAmt[objectType[number]] = supplyAmt[objectType[number]] + 1;

    // removes the object information from all the relevant lists
    objectType.splice(number, 1);
    objectX.splice(number, 1);
    objectY.splice(number, 1);

    // reduces the object count
    currentObject = currentObject - 1;
}

// executes the appropriate function based on the click type
function canvasClick(evt){
    // deletes an object on a right click
    if(evt.button == 2){
        deleteObject(detectHoveredObject());
    }

    // places a new object if there is enough of said object, there is space, and the left mouse button was clicked.
    if(supplyAmt[objectType[currentObject]] > 0 && evt.button == 0 && detectHoveredObject() == -1){
        objectX.push(0);
        objectY.push(0);
        objectType.push(objectType[currentObject]);
        supplyAmt[objectType[currentObject]] = supplyAmt[objectType[currentObject]] - 1;
        currentObject = currentObject + 1;
    }
    drawSelectionArea()
}

download.addEventListener("click", function() {
    // only jpeg is supported by jsPDF
    var canvas = document.getElementById("drawingArea");
    var ctx = canvas.getContext("2d");

    var imgData = canvas.toDataURL("image/jpeg", 1.0);
    var pdf = new jsPDF();
  
    pdf.addImage(imgData, 'JPEG', 0, 0);
    pdf.save("download.pdf");
  }, false);

