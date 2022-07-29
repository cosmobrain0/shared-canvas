// const http = require('http');
import * as http   from 'http';
import * as fs     from 'fs';
import * as socket from 'socket.io';
import { Vector }  from './vector.js';
import * as dotenv from 'dotenv';
import { contentType } from 'mime-types';
dotenv.config();
// require('dotenv').config();

const ALLOWED_DIRS = process.env.ALLOWED_DIRS.split(" ");
const PAGE_404 = process.env.PAGE_404.split(" ")[0];

const server = http.createServer((req, res) => {
    // let url = req.url.slice(1);
    // if (ALLOWED_DIRS.includes(url)) {
    //     let contentType = null;
    //     switch (url.split(".").pop()) {
    //         case 'html': contentType = 'text/html'; break;
    //         case 'js': contentType = 'text/javascript'; break;
    //     }
    //     res.writeHead(200, {'Content-Type': contentType});
    //     res.write(fs.readFileSync(`./website/${url}`).toString());
    //     res.end();
    // } else {
    //     res.writeHead(404, {'Content-Type': 'text/html'});
    //     res.write(fs.readFileSync(`./${PAGE_404}`).toString());
    //     res.end();
    // }
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(`<html><head><title>Hello World</title></head><body><h1>Test Webpage</h1></body></html>`);
    res.end();
}).listen(process.env.PORT ? process.env.PORT : 8080);
console.log(process.env.PORT);

const io = new socket.Server(server);

const userIDs = [];
const currentPaths = {};
/**
 * @type {Vector[][]}
 */
const paths = [];

// io.on('connection', socket => {
//     userIDs.push(socket.id);

//     socket.on('new path', (data, isRubber) => {
//         let currentPath = JSON.parse(data).map(x => new Vector(x.x, x.y));
//         if (isRubber) {
//             currentPath.forEach(point => {
//                 for (let i=paths.length-1; i>=0; i--) {
//                     if (paths[i][paths[i].length-1].to(point).sqrLength() < 40*40) {
//                         paths.splice(i, 1);
//                         continue;
//                     }
//                     for (let j=1; j<paths[i].length; j++) {
//                         if (pointLineSqrDistance(paths[i][j-1], paths[i][j], point) < 40*40) {
//                             paths.splice(i, 1);
//                             break;
//                         }
//                     }
//                 }
//             })
//         } else {
//             paths.push(currentPath);
//         }
//         io.emit('updating paths', JSON.stringify(paths));
//     })

//     socket.on('current path', (data, isRubber) => {
//         let currentPath = JSON.parse(data).map(x => x.map(x => new Vector(x.x, x.y)));
//         currentPaths[socket.id] = {
//             isRubber: isRubber,
//             paths: currentPath
//         };
//         io.emit('updating current paths', JSON.stringify(currentPaths), JSON.stringify(userIDs));
//     })

//     socket.on('clear all', () => {
//         paths.splice(0, paths.length);
//         io.emit('updating paths', JSON.stringify(paths));
//     })

//     socket.on('disconnect', function(reason) {
//         // console.log(`${this.id} disconnected because ${reason}`);
//         userIDs.splice(userIDs.indexOf(this.id), 1);
//     })

//     socket.emit('updating paths', JSON.stringify(paths));

//     console.log(`${socket.id} connected`);
// });

let clamp = (v, b1, b2) => Math.min(Math.max(v, Math.min(b1, b2)), Math.max(b1, b2));

/**
 * 
 * @param {Vector} a 
 * @param {Vector} b 
 * @param {Vector} p 
 */
let pointLineSqrDistance = (a, b, p) => {
    let m1 = (a.y-b.y)/(a.x-b.x);
    let c1 = a.y - m1*a.x;
    let m2 = -1/m1;
    let c2 = p.y - m2*p.x;
    let x = clamp((c1-c2)/(m2-m1), a.x, b.x);
    let y = m1*x + c1;
    return new Vector(x, y).to(p).sqrLength();
}
