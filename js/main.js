'use strict';

/*****************
 * 
 *   ЗАГРУЗЧИК
 */

const SOUNDS_PATH = './src/sounds/';
const SPRITES_PATH = './src/sprites/';

const SOUNDS_DOWNLOAD_ARR = [
        'se_dices.mp3',
    ];

const SPRITES_DOWNLOAD_ARR = [
        'dices_42x42_144f.png'
    ];

let downloadDataSize = SOUNDS_DOWNLOAD_ARR.length
                     + SPRITES_DOWNLOAD_ARR.length;

let downloadDataStep = +( 100 / downloadDataSize ).toFixed(2);
let loadProgress = 0;
console.log( 'loading', loadProgress, '%');

class Sound {
    constructor (sound_name) {
        this.name = sound_name;
        this.audio = new Audio();
        this.audio.src = SOUNDS_PATH + sound_name;
        this.isLoaded = false;
        this.audio.oncanplaythrough = () => {
            this.isLoaded = true;
            SOUNDS_ARR.push(this);
            updateDownloadDataArr();
        };
        downloadDataArr.push(this);
    }
}

class Sprite {
    constructor(sprite_name) {
        let spriteData = this.getSpriteData(sprite_name);

        this.name = sprite_name;
        this.img = new Image();
        this.img.src = SPRITES_PATH + sprite_name;
        this.frames = spriteData.framesNumber;
        this.frameWidth = spriteData.framesWidth;
        this.frameHeight = spriteData.framesHeight;
        this.isLoaded = false;
        this.img.onload = () => {
            this.isLoaded = true;
            this.width = this.img.width;
            this.height = this.img.height;
            SPRITES_ARR.push(this);
            updateDownloadDataArr();
        };
        downloadDataArr.push(this);
    }

    getSpriteData(sprite_name) {
        let spriteNameDataArr = sprite_name.split('_');
        let frames = parseInt(spriteNameDataArr.pop());
        let sizes = spriteNameDataArr.pop().split('x');
        let width = +sizes[0];
        let height = +sizes[1];
        if ( !isNaN(frames) && !isNaN(width) && !isNaN(height) )
            return {framesNumber: frames, framesWidth: width,  framesHeight: height};
        console.error(`WRONG SPRITE NAME : ${sprite_name}\nsprite_name_128x64_1f`);
    }
}

function updateDownloadDataArr() {
    downloadDataArr = downloadDataArr.filter( data => !data.isLoaded );
    let load = downloadDataSize - downloadDataArr.length;
    loadProgress = +(load * downloadDataStep).toFixed();
    console.log( 'loading', loadProgress, '%');

    if (downloadDataArr.length === 0) canvasIsReady = true;
}

let downloadDataArr = [];

const SOUNDS_ARR = [];
const SPRITES_ARR = [];

SPRITES_DOWNLOAD_ARR.forEach( data => new Sprite(data) );
SOUNDS_DOWNLOAD_ARR.forEach( data => new Sound(data) );

/*************
 * 
 *   ХОЛСТ
 */

let vw, vh, vcx, vcy;
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.prepend(canvas);

document.body.addEventListener('resize', resizeWindow);

function resizeWindow() {
    canvas.width = vw = innerWidth;
    canvas.height = vh = innerHeight;
    vcx = Math.floor(vw / 2);
    vcy = Math.floor(vh / 2);
}
resizeWindow();

/***********************
 * 
 *   МУЗЫКА И ЗВУКИ
 */

const SE_PLAYER = new Audio();

function playSePlayer(sound) {
    SE_PLAYER.src = SOUNDS_PATH + sound;
    SE_PLAYER.play();
    SE_PLAYER.addEventListener('ended', () => {isAnimate = false});
}

/**********************************
 * 
 *   БАЗОВЫЕ ИГРОВЫЕ ОБЪЕКТЫ
 */

let canvasIsReady = false;
let isAnimate = false;

const labelSpan = document.getElementById('label').querySelector('span');
const rangeInput = document.getElementById('range');
rangeInput.onchange = (el) => labelSpan.innerHTML = el.target.value;

function throwDices() {
    if (canvasIsReady && !isAnimate) {
        dicesArr = [];
        let coordinatesList = {
            1 : [{x: vcx, y: vcy}],
            2 : [{x: vcx - 25, y: vcy}, {x: vcx + 25, y: vcy}],
            3 : [{x: vcx - 50, y: vcy}, {x: vcx, y: vcy}, {x: vcx + 50, y: vcy}],
            4 : [{x: vcx - 25, y: vcy - 25}, {x: vcx + 25, y: vcy - 25},
                {x: vcx - 25, y: vcy + 25}, {x: vcx + 25, y: vcy + 25}],
            5 : [{x: vcx - 25, y: vcy - 25}, {x: vcx + 25, y: vcy - 25},
                {x: vcx - 50, y: vcy + 25}, {x: vcx, y: vcy + 25}, {x: vcx + 50, y: vcy + 25}],
            6 : [{x: vcx - 50, y: vcy - 25}, {x: vcx, y: vcy - 25}, {x: vcx + 50, y: vcy - 25},
                {x: vcx - 50, y: vcy + 25}, {x: vcx, y: vcy + 25}, {x: vcx + 50, y: vcy + 25}],
            7 : [{x: vcx - 25, y: vcy - 50}, {x: vcx + 25, y: vcy - 50},
                {x: vcx - 50, y: vcy}, {x: vcx, y: vcy}, {x: vcx + 50, y: vcy},
                {x: vcx - 25, y: vcy + 50}, {x: vcx + 25, y: vcy + 50}],
            8 : [{x: vcx - 25, y: vcy - 50}, {x: vcx + 25, y: vcy - 50},
                {x: vcx - 75, y: vcy}, {x: vcx - 25, y: vcy}, {x: vcx + 25, y: vcy}, {x: vcx + 75, y: vcy},
                {x: vcx - 25, y: vcy + 50}, {x: vcx + 25, y: vcy + 50}],
            9 : [{x: vcx - 50, y: vcy - 50}, {x: vcx, y: vcy - 50}, {x: vcx + 50, y: vcy - 50},
                {x: vcx - 50, y: vcy}, {x: vcx, y: vcy}, {x: vcx + 50, y: vcy},
                {x: vcx - 50, y: vcy + 50}, {x: vcx, y: vcy + 50}, {x: vcx + 50, y: vcy + 50}],
            10: [{x: vcx - 50, y: vcy - 50}, {x: vcx, y: vcy - 50}, {x: vcx + 50, y: vcy - 50},
                {x: vcx - 75, y: vcy}, {x: vcx - 25, y: vcy}, {x: vcx + 25, y: vcy}, {x: vcx + 75, y: vcy},
                {x: vcx - 50, y: vcy + 50}, {x: vcx, y: vcy + 50}, {x: vcx + 50, y: vcy + 50}],
            11: [{x: vcx - 75, y: vcy - 50}, {x: vcx - 25, y: vcy - 50}, {x: vcx + 25, y: vcy - 50}, {x: vcx + 75, y: vcy - 50},
                {x: vcx - 75, y: vcy}, {x: vcx - 25, y: vcy}, {x: vcx + 25, y: vcy}, {x: vcx + 75, y: vcy},
                {x: vcx - 50, y: vcy + 50}, {x: vcx, y: vcy + 50}, {x: vcx + 50, y: vcy + 50}],
            12: [{x: vcx - 75, y: vcy - 50}, {x: vcx - 25, y: vcy - 50}, {x: vcx + 25, y: vcy - 50}, {x: vcx + 75, y: vcy - 50},
                {x: vcx - 75, y: vcy}, {x: vcx - 25, y: vcy}, {x: vcx + 25, y: vcy}, {x: vcx + 75, y: vcy},
                {x: vcx - 75, y: vcy + 50}, {x: vcx - 25, y: vcy + 50}, {x: vcx + 25, y: vcy + 50}, {x: vcx + 75, y: vcy + 50}],
            13: [{x: vcx - 50, y: vcy - 75}, {x: vcx, y: vcy - 75}, {x: vcx + 50, y: vcy - 75},
                {x: vcx - 75, y: vcy - 25}, {x: vcx - 25, y: vcy - 25}, {x: vcx + 25, y: vcy - 25}, {x: vcx + 75, y: vcy - 25},
                {x: vcx - 75, y: vcy + 25}, {x: vcx - 25, y: vcy + 25}, {x: vcx + 25, y: vcy + 25}, {x: vcx + 75, y: vcy + 25},
                {x: vcx - 25, y: vcy + 75}, {x: vcx + 25, y: vcy + 75}],
            14: [{x: vcx - 50, y: vcy - 75}, {x: vcx, y: vcy - 75}, {x: vcx + 50, y: vcy - 75},
                {x: vcx - 75, y: vcy - 25}, {x: vcx - 25, y: vcy - 25}, {x: vcx + 25, y: vcy - 25}, {x: vcx + 75, y: vcy - 25},
                {x: vcx - 75, y: vcy + 25}, {x: vcx - 25, y: vcy + 25}, {x: vcx + 25, y: vcy + 25}, {x: vcx + 75, y: vcy + 25},
                {x: vcx - 50, y: vcy + 75}, {x: vcx, y: vcy + 75}, {x: vcx + 50, y: vcy + 75}],
            15: [{x: vcx - 75, y: vcy - 75}, {x: vcx - 25, y: vcy - 75}, {x: vcx + 25, y: vcy - 75}, {x: vcx + 75, y: vcy - 75},
                {x: vcx - 75, y: vcy - 25}, {x: vcx - 25, y: vcy - 25}, {x: vcx + 25, y: vcy - 25}, {x: vcx + 75, y: vcy - 25},
                {x: vcx - 75, y: vcy + 25}, {x: vcx - 25, y: vcy + 25}, {x: vcx + 25, y: vcy + 25}, {x: vcx + 75, y: vcy + 25},
                {x: vcx - 50, y: vcy + 75}, {x: vcx, y: vcy + 75}, {x: vcx + 50, y: vcy + 75}],
            16: [{x: vcx - 75, y: vcy - 75}, {x: vcx - 25, y: vcy - 75}, {x: vcx + 25, y: vcy - 75}, {x: vcx + 75, y: vcy - 75},
                {x: vcx - 75, y: vcy - 25}, {x: vcx - 25, y: vcy - 25}, {x: vcx + 25, y: vcy - 25}, {x: vcx + 75, y: vcy - 25},
                {x: vcx - 75, y: vcy + 25}, {x: vcx - 25, y: vcy + 25}, {x: vcx + 25, y: vcy + 25}, {x: vcx + 75, y: vcy + 25},
                {x: vcx - 75, y: vcy + 75}, {x: vcx - 25, y: vcy + 75}, {x: vcx + 25, y: vcy + 75}, {x: vcx + 75, y: vcy + 75}],
        };
        let coordinatesArr = coordinatesList[rangeInput.value];
        for (let i = 0; i < coordinatesArr.length; i++) {
            let coordinate = coordinatesArr[i];
            dicesArr.push( new Dice(coordinate.x, coordinate.y) );
        }
        requestAnimationFrame( animation );

        playSePlayer('se_dices.mp3');
        isAnimate = true;
    }
}



class Dice {
    constructor(x, y) {
        let sprite = SPRITES_ARR.find(sprite => sprite.name === 'dices_42x42_144f.png');

        this.x = x;
        this.y = y;

        this.img = sprite.img;
        this.fw = sprite.frameWidth;
        this.fh = sprite.frameHeight;

        this.pointsList = this.getPointsList();
        this.point = this.pointsList.pop(); 
    }

    getPointsList() {
        // let chances = [6,5,4,3,2,1,6,5,4,3,2,6,5,4,3,6,5,4,6,5,6] // 21 -> 6(6) 5(5) 4321(10)
        // let value = chances[ Math.floor(Math.random() * chances.length) ];
        let value = Math.ceil(Math.random() * 6);
        let pointsList = [];
        let results = {
            1 : {x:  0, y: 4},
            2 : {x:  4, y: 4},
            3 : {x:  0, y: 8},
            4 : {x:  0, y: 0},
            5 : {x: 12, y: 4},
            6 : {x:  8, y: 4}
        };
        let lastPoint = {x: results[value].x, y: results[value].y};
        pointsList.push({x: lastPoint.x * this.fw, y: lastPoint.y * this.fw});
        pointsList.push({x: lastPoint.x * this.fw, y: lastPoint.y * this.fw});

        let isLeftTurn = (Math.random() < 0.5) ? true : false;

        // start direction
        let direction = Math.random();
        if (direction < 0.25) direction = 0;
        else if (direction < 0.5) direction = 1;
        else if (direction < 0.75) direction = 2;
        else direction = 3;
        
        // generate path as numbers
        let size = 38;
        let path = ('' + Math.random()).slice(2);
        while (path.length < size) path += ('' + Math.random()).slice(2);

        // generate path as coordinates on sprite image
        for(let i = 0; i < size; i++) {
            // test turn
            if (+path[i] < 3) {
                if (isLeftTurn) direction = (direction === 0) ? 3 : direction - 1;
                else direction = (direction === 3) ? 0 : direction + 1;
            }

            // forward
            if (direction === 0 || direction === 2){
                // up or down
                lastPoint.y += (direction === 0) ? -1 : 1;
                if (lastPoint.y < 0 || lastPoint.y > 8) {
                    lastPoint.y = lastPoint.y < 0 ? 1 : 7;
                    lastPoint.x += (lastPoint.x < 8) ? 8 : -8;
                    direction = (direction === 0) ? 2 : 0;
                }
            } else {
                // left or right
                lastPoint.x += (direction === 3) ? -1 : 1;
                if (lastPoint.x < 0 || lastPoint.x > 15) {
                    lastPoint.x = lastPoint.x < 0 ? 15 : 0;
                }
            }
            pointsList.push({x: lastPoint.x * this.fw, y: lastPoint.y * this.fw});
            pointsList.push({x: lastPoint.x * this.fw, y: lastPoint.y * this.fw});
        }
        return pointsList;
    }

    draw() {
        if (this.pointsList.length) this.point = this.pointsList.pop();

        // DRAW
        ctx.drawImage(
            this.img, // image
            this.point.x, this.point.y, // frame [x, y] on sprite image
            this.fw, this.fh, // frame width and height
            this.x - 21, this.y - 21, // start point[x, y] to draw on canvas
            this.fw, this.fh // frame width and height to draw on canvas
        );
    }
}

//////////////////////////////////////////

let dicesArr = [];

function loadingDone() {
    canvasIsReady = true;
}

/**************
 * 
 *  АНИМАЦИЯ
 */

function animation() {
    ctx.clearRect(0, 0, vw, vh);
    dicesArr.forEach( sprite => sprite.draw() );
    if (isAnimate) requestAnimationFrame( animation );
}