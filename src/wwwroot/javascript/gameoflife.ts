import { protoCore } from "../javascript/protoCore/protoCore.js";
import { ArrayUtil } from "../javascript/protoCore/arrays/arrayUtil.js";
import { GamePad } from "../javascript/protoCore/input/gamepad.js";

let grid: number[][];
let resolution: number;
let resolutionOptions: number[];
let columns: number;
let rows: number;
let currentIndex: number;

let options = {
    width: 800,
    height: 500,
    setup: setup,
    update: update,
    draw: draw,
    framerate: 10,
};

let p = new protoCore(options);

function setup(this: protoCore, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    //set resolution
    resolution = 5;
    currentIndex = 0;
    resolutionOptions = [1, 2, 5, 10, 20, 50, 100];

    //Calculate the columns
    columns = this.canvasWidth / resolution;
    rows = this.canvasHeight / resolution;

    //populate grid
    grid = ArrayUtil.randomArray2D(this.canvasWidth / resolution, this.canvasHeight / resolution, 1);
}

function update(this: protoCore) {
    let next = ArrayUtil.randomArray2D(this.canvasWidth / resolution, this.canvasHeight / resolution, 1);
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            let state = grid[r][c];
            let neighbors = countNeighbors(grid, r, c);

            if (state == 0 && neighbors == 3) {
                next[r][c] = 1;
            } else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
                next[r][c] = 0;
            } else {
                next[r][c] = state;
            }
        }
    }

    grid = next;

    pollGamepads();
}

function pollGamepads() {
    if (GamePad.controllerConnected()) {
        let buttons = GamePad.getButtons().map(buttons => buttons.value);

        if (buttons[0]) {
            //set resolution
            currentIndex = Math.floor(Math.random() * 10);
            changeResolution(resolutionOptions[currentIndex]);
        }

        let axes = GamePad.getAxes();

        if (Math.abs(axes[1]) > 0.1) {
            if (axes[1] > 0) {
                currentIndex++;
                if (currentIndex > resolutionOptions.length) {
                    currentIndex = resolutionOptions.length;
                }
            } else {
                currentIndex--;
                if (currentIndex < 0) {
                    currentIndex = 0;
                }
            }
            changeResolution(resolutionOptions[currentIndex]);
        }
    }
}

function draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    //clear canvas
    ctx.fillStyle = "white";
    //trails
    ctx.globalAlpha = 0.5;
    ctx.fillRect(0, 0, p.canvasWidth, p.canvasHeight);

    ctx.fillStyle = "black";
    ctx.globalAlpha = 1.0;
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            if (grid[r][c]) {
                ctx.fillRect(r * resolution, c * resolution, resolution, resolution);
            }
        }
    }
}

function changeResolution(givenResolution: number) {
    if (typeof givenResolution === "undefined") {
        givenResolution = resolutionOptions[resolutionOptions.length - 1];
    }

    resolution = givenResolution;
    console.log(resolution);

    columns = p.canvasWidth / resolution;
    rows = p.canvasHeight / resolution;

    //populate grid
    grid = ArrayUtil.randomArray2D(p.canvasWidth / resolution, p.canvasHeight / resolution, 1);
}

function countNeighbors(givenGrid: number[][], x: number, y: number) {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            let col = (x + i + columns) % columns;
            let row = (y + j + rows) % rows;
            sum += grid[col][row];
        }
    }
    sum -= grid[x][y];
    return sum;
}
