const cameraMovementSpeed = 0.4;
calc = () => {
    if (Mouse.leftclick.down) {
        moveCamera(Mouse.position);
    }
    Mouse.touches.filter(x => x.down).forEach(x => moveCamera(x.path[x.path.length-1]));
}

let moveCamera = (mousePosition) => {
    if (Vector.inBounds(mousePosition, new Vector(0, 0), new Vector(200, 200))) {
        let direction = new Vector(200, 200).multiply(0.5).to(mousePosition).multiply(cameraMovementSpeed*cameraMovementSpeed);
        camera.add(direction);
    }
}