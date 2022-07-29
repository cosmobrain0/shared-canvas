
let isRubber = false;
/**
 * @type {Vector}
 */
let camera;
let currentPaths = [];
let drawUI = true;
init = () => {
    camera = new Vector(0, 0);
    RectangleButton(UI, 25, 250, 150, 40, "#555", "#0000", "Toggle Rubber", "#fff", "20px Arial", [
        () => isRubber = !isRubber,
        btn => btn.renderer.bgcolour = isRubber ? "#333" : "#555"
    ]);
    CircleButton(UI, 150, 400, 20, "#555", "#0000", "+", "#fff", "20px Arial", [
        () => zoom += 0.1
    ]);
    CircleButton(UI, 50, 400, 20, "#555", "#0000", "-", "#fff", "20px Arial", [
        () => zoom -= 0.1
    ]);
    RectangleButton(UI, 25, 450, 150, 40, "#555", "#0000", "Clear", "#fff", "20px Arial", [
        () => socket.emit('clear all')
    ]);
    RectangleButton(UI, 25, 500, 150, 40, "#555", "#0000", "Download", "#fff", "20px Arial", [
        saveDataAsImage
    ]);
    socket = io();
    events.mouseup.push(() => {
        processPathDrawing(Mouse.leftclick);
        if (Mouse.leftclick.start.x < 200 && Mouse.leftclick.start.y > CANVASHEIGHT/2) {
            drawUI = !drawUI;
        }
    })
    socket.on('updating paths', newPaths => {
        paths = JSON.parse(newPaths).map(path => path.map(point => new Vector(point.x, point.y)));
    })
    paths = [];
    socket.on('updating current paths', (newCurrentPaths, ids) => {
        let newCurrentPathData = JSON.parse(newCurrentPaths);
        let userIDs = JSON.parse(ids);
        currentPaths = [];
        for (let id of userIDs) {
            if (newCurrentPathData[id]) {
                currentPaths.push({
                    isRubber: newCurrentPathData[id].isRubber,
                    paths: newCurrentPathData[id].paths.map(x => x.map(x => new Vector(x.x, x.y)))
                });
            }
        }
    })
    zoom = 1;
}

let processPathDrawing = button => {
    if (button.start.x > 200)
        emitPath(button.path);
}

let emitPath = path => {
    socket.emit('new path', JSON.stringify(path.map(x => adjustForCamera(x))), isRubber);
}

let saveDataAsImage = () => {
    let canvas = document.createElement('canvas');
    let allPoints = paths.reduce((acc, val) => acc.concat(val), []);
    let minBounds = allPoints.reduce((acc, val) => acc == null ? val.copy() : new Vector(min(acc.x, val.x), min(acc.y, val.y)), null);
    let maxBounds = allPoints.reduce((acc, val) => acc == null ? val.copy() : new Vector(max(acc.x, val.x), max(acc.y, val.y)), null);
    let ctx = canvas.getContext('2d');
    canvas.width = maxBounds.x-minBounds.x;
    canvas.height = maxBounds.y-minBounds.y;
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#fff";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let path of paths) {
        if (path.length == 0) continue;
        ctx.beginPath();
        ctx.moveTo(path[0].x-minBounds.x, path[0].y-minBounds.y);
        for (let {x, y} of path) {
            ctx.lineTo(x-minBounds.x, y-minBounds.y);
        }
        ctx.stroke();
    }
    // console.log(canvas.toDataURL("image/png"));
    let link = document.createElement('a');
    link.href = canvas.toDataURL("image/png");
    link.download = "shared-canvas.png";
    link.click();
}
