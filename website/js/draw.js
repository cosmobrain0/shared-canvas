

let zoom;
draw = () => {
	save();
	// translate(-CANVASWIDTH/2-camera.x, -CANVASHEIGHT/2-camera.y);
	let topLeftCorner = Vector.add(Vector.multiply(camera, -1), new Vector());
	if (keymap[' ']) console.log(topLeftCorner.x);
	translate(topLeftCorner.x, topLeftCorner.y);
	ctx.scale(zoom, zoom);
	strokeStyle("#fff");
	lineWidth(5);
	for (let path of paths) {
		drawPath(path);
	}
	for (let pathGroup of currentPaths) {
		strokeStyle(pathGroup.isRubber ? "#f00" : "#fff");
		for (let path of pathGroup.paths) {
			drawPath(path);
		}
	}
	let currentPath = {
		isRubber: isRubber,
		paths: []
	};
	if (Mouse.leftclick.down) {
		currentPath.paths.push(Mouse.leftclick.path.map(x => adjustForCamera(x)));
	}
	if (Mouse.rightclick.down) {
		currentPath.paths.push(Mouse.rightclick.path.map(x => adjustNothing(x)));
	}
	Mouse.touches.forEach(touch => {
		touch.down ? currentPath.paths.push(touch.path.map(x => adjustNothing(x))) : null
	});
	restore();
	socket.emit('current path', JSON.stringify(currentPath.paths), currentPath.isRubber);

	if (drawUI) {
		strokeStyle("#fff");
		strokeRect(0, 0, 200, 200);
		beginPath();
		moveTo(0, 0);
		lineTo(200, 200);
		moveTo(200, 0);
		lineTo(0, 200);
		stroke();
	}
	fillStyle("#fff");
	font("50px Arial");
	fillText(`${floor(camera.x)} | ${floor(camera.y)}`, 50, 800);
}

let drawPath = (path) => {
	if (path.length == 0) return;
	beginPath();
	moveTo(path[0].x, path[0].y);
	for (let {x, y} of path) {
		lineTo(x, y);
	}
	stroke();
}

let adjustNothing = vector => vector;

// takes screen-space coordinates and returns world-space coordinates
let adjustForCamera = vector => {
	let position = Vector.add(vector, camera);
	return position;
}