let {
	beginPath, arc, fillRect, strokeRect, moveTo, lineTo, createLinearGradient, createRadialGradient, fill, stroke, fillText, strokeText, drawImage, save, restore, translate, rotate,
} = ctx;

let fillStyle = v => ctx.fillStyle = v;
let strokeStyle = v => ctx.strokeStyle = v;
let font = v => ctx.font = v;
let lineWidth = v => ctx.lineWidth = v;

const {
	PI, SQRT2, random, floor, ceil, round, max, min, abs, sqrt, sin, cos, tan, asin, acos, atan, atan2
} = Math;

const TWO_PI = PI*2;
const HALF_PI = PI/2;

beginPath = beginPath.bind(ctx)
arc = arc.bind(ctx)
createLinearGradient = createLinearGradient.bind(ctx)
createRadialGradient = createRadialGradient.bind(ctx)
fill = fill.bind(ctx)
stroke = stroke.bind(ctx)
save = save.bind(ctx);
restore = restore.bind(ctx);
rotate = rotate.bind(ctx);

drawImage = drawImage.bind(ctx);
translate = translate.bind(ctx);
fillRect = fillRect.bind(ctx)
strokeRect = strokeRect.bind(ctx)
moveTo = moveTo.bind(ctx)
lineTo = lineTo.bind(ctx)
strokeText = strokeText.bind(ctx);
fillText = fillText.bind(ctx);