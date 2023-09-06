const CELL_SIZE = 5
const CELL_COUNT = 200
const REFRESH_RATE = 50
const RANDOM_CELL_THRESHOLD = 0.4;

const canvas = document.createElement('canvas')
canvas.id = 'world'
canvas.width = canvas.height = CELL_COUNT * CELL_SIZE
const ctx = canvas.getContext('2d')

const cells = new Array(CELL_COUNT * CELL_COUNT).fill(0)

function init(initial_cells) {
    initial_cells.forEach(cell => cells[cell] = 1)
}

function getNeighbors(cell) {
    const neighbors = [];
    const isLeftEdge = cell % CELL_COUNT === 1;
    const isRightEdge = cell % CELL_COUNT === 0;

    // Calculate relative positions for neighbors
    const positions = [
        -CELL_COUNT, -CELL_COUNT - 1, -CELL_COUNT + 1,
        -1, 1,
        CELL_COUNT, CELL_COUNT - 1, CELL_COUNT + 1
    ];

    positions.forEach(position => {
        const potentialNeighbor = cell + position;
        if (isLeftEdge && [1, CELL_COUNT + 1, -CELL_COUNT + 1].includes(position)) return;
        if (isRightEdge && [-1, CELL_COUNT - 1, -CELL_COUNT - 1].includes(position)) return;
        neighbors.push(potentialNeighbor);
    });

    return neighbors;
}

function getStatus(cell) {
    /*
    * 1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
    * 2. Any live cell with two or three live neighbours lives on to the next generation.
    * 3. Any live cell with more than three live neighbours dies, as if by overpopulation.
    * 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    */
    const aliveNeighbors = getNeighbors(cell).filter(neighbor => cells[neighbor] === 1).length;
    return aliveNeighbors === 3 || (aliveNeighbors === 2 && cells[cell] === 1) ? 1 : 0;

}

function applyRules() {
    const nextGeneration = cells.map((_, index) => getStatus(index));
    cells.splice(0, cells.length, ...nextGeneration);
}

function init_square(id) {
    return [
        id, id+1, id-1,
        id+CELL_COUNT, id+CELL_COUNT+1, id+CELL_COUNT-1,
        id-CELL_COUNT, id-CELL_COUNT+1, id-CELL_COUNT-1
    ]
}

function init_pulsar(id) {
    return [
        id+2, id+3, id+4, id+8, id+9, id+10,
        id+CELL_COUNT*2, id+5+CELL_COUNT*2, id+7+CELL_COUNT*2, id+12+CELL_COUNT*2,
        id+CELL_COUNT*3, id+5+CELL_COUNT*3, id+7+CELL_COUNT*3, id+12+CELL_COUNT*3,
        id+CELL_COUNT*4, id+5+CELL_COUNT*4, id+7+CELL_COUNT*4, id+12+CELL_COUNT*4,
        id+2+CELL_COUNT*5, id+3+CELL_COUNT*5, id+4+CELL_COUNT*5, id+8+CELL_COUNT*5, id+9+CELL_COUNT*5, id+10+CELL_COUNT*5,

        id+2+CELL_COUNT*7, id+3+CELL_COUNT*7, id+4+CELL_COUNT*7, id+8+CELL_COUNT*7, id+9+CELL_COUNT*7, id+10+CELL_COUNT*7,
        id+CELL_COUNT*8, id+5+CELL_COUNT*8, id+7+CELL_COUNT*8, id+12+CELL_COUNT*8,
        id+CELL_COUNT*9, id+5+CELL_COUNT*9, id+7+CELL_COUNT*9, id+12+CELL_COUNT*9,
        id+CELL_COUNT*10, id+5+CELL_COUNT*10, id+7+CELL_COUNT*10, id+12+CELL_COUNT*10,
        id+2+CELL_COUNT*12, id+3+CELL_COUNT*12, id+4+CELL_COUNT*12, id+8+CELL_COUNT*12, id+9+CELL_COUNT*12, id+10+CELL_COUNT*12
    ]
}

function drawTable() {
    applyRules()
    for(let y = 0; y < CELL_COUNT; y++) {
        for(let x = 0; x < CELL_COUNT; x++) {
            const cellIndex = y * CELL_COUNT + x + 1;
            if(cells[cellIndex] === 1) {
                ctx.fillStyle = '#b8b8b8';
                ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            } else {
                ctx.clearRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }
}

function gameloop() {
    drawTable()
    setTimeout(() => {
        requestAnimationFrame(gameloop)
    }, REFRESH_RATE)
}

function main() {
    document.body.appendChild(canvas)

    let initial_cells = []
    //initial_cells = init_pulsar(4520, CELL_COUNT)

    for (let index = 1; index < CELL_COUNT*CELL_COUNT; index++) {
        if (Math.random() < RANDOM_CELL_THRESHOLD) {
            initial_cells.push(index)
        }
    }

    init(initial_cells)
    gameloop()
}

main()