var cells = []

function createTable(cell_count) {
    const body = document.getElementsByTagName('body')[0]
    const table = document.createElement('table')
    const tbody = document.createElement('tbody')
    cells = new Array(cell_count * cell_count).fill(0);

    for (let i = 1; i <= cell_count; i++) {
        const tr = document.createElement("tr")
        for (let j = 0; j < cell_count; j++) {
            const idx = i * cell_count + j + 1
            const td = document.createElement("td")
            td.setAttribute("data-tag",idx)
            tr.appendChild(td)
        }
        tbody.appendChild(tr)
    }

    table.appendChild(tbody)
    body.appendChild(table)
    return cells
}

function init(initial_cells) {
    initial_cells.forEach(cell => {
        cells[cell] = 1
    })
}

function getNeighbors(cell, cell_count) {
    const neighbors = []

    const isLeftEdge = cell % cell_count === 1
    const isRightEdge = cell % cell_count === 0

    if (cell > cell_count) {
        neighbors.push(cell - cell_count)
        if (!isLeftEdge) {
            neighbors.push(cell - cell_count - 1)
        }
        if (!isRightEdge) {
            neighbors.push(cell - cell_count + 1)
        }
    }

    if (!isLeftEdge) {
        neighbors.push(cell - 1)
    }
    if (!isRightEdge) {
        neighbors.push(cell + 1)
    }

    if (cell <= cell_count * (cell_count - 1)) {
        neighbors.push(cell + cell_count)
        if (!isLeftEdge) {
            neighbors.push(cell + cell_count - 1)
        }
        if (!isRightEdge) {
            neighbors.push(cell + cell_count + 1)
        }
    }

    return neighbors;
}

function getStatus(singleCell, cell_count) {
    const neighbors = getNeighbors(singleCell, cell_count)
    const aliveNeighbors = neighbors.reduce((acc, neighbor_id) => {
        const neighbor_element = cells[neighbor_id]
        if (neighbor_element === 1) {
            acc++
        }
        return acc
    }, [0])

    /*
    * 1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
    * 2. Any live cell with two or three live neighbours lives on to the next generation.
    * 3. Any live cell with more than three live neighbours dies, as if by overpopulation.
    * 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    */
    if (aliveNeighbors === 3) return 1
    if (aliveNeighbors === 2 && cells[singleCell] === 1) return 1
    return 0
}

function applyRules(cell_count) {
    const cell_snapshot = []
    Object.keys(cells).forEach(key => {
        cell_snapshot[parseInt(key)] = getStatus(parseInt(key), cell_count)
    })
    cells = cell_snapshot
}

function init_square(id,cell_count) {
    return [
        id, id+1, id-1,
        id+cell_count, id+cell_count+1, id+cell_count-1,
        id-cell_count, id-cell_count+1, id-cell_count-1
    ]
}

function init_pulsar(id, cell_count) {
    return [
        id+2, id+3, id+4, id+8, id+9, id+10,
        id+cell_count*2, id+5+cell_count*2, id+7+cell_count*2, id+12+cell_count*2,
        id+cell_count*3, id+5+cell_count*3, id+7+cell_count*3, id+12+cell_count*3,
        id+cell_count*4, id+5+cell_count*4, id+7+cell_count*4, id+12+cell_count*4,
        id+2+cell_count*5, id+3+cell_count*5, id+4+cell_count*5, id+8+cell_count*5, id+9+cell_count*5, id+10+cell_count*5,

        id+2+cell_count*7, id+3+cell_count*7, id+4+cell_count*7, id+8+cell_count*7, id+9+cell_count*7, id+10+cell_count*7,
        id+cell_count*8, id+5+cell_count*8, id+7+cell_count*8, id+12+cell_count*8,
        id+cell_count*9, id+5+cell_count*9, id+7+cell_count*9, id+12+cell_count*9,
        id+cell_count*10, id+5+cell_count*10, id+7+cell_count*10, id+12+cell_count*10,
        id+2+cell_count*12, id+3+cell_count*12, id+4+cell_count*12, id+8+cell_count*12, id+9+cell_count*12, id+10+cell_count*12
    ]
}

function main() {
    cell_count = 250
    refresh_rate = 50
    initial_cells = []
    initial_cells = init_pulsar(4520, cell_count)

    for (let index = 1; index < cell_count*cell_count; index++) {
        if (Math.random() < 0.4) {
            initial_cells.push(index)
        }
    }

    createTable(cell_count)
    init(initial_cells)
    
    const elements = document.querySelectorAll(`td`)
    drawTable()

    function drawTable() {
        const previousCells = [...cells]

        applyRules(cell_count)

        elements.forEach(element => {
            const elementId = parseInt(element.getAttribute(`data-tag`))
            if (previousCells[elementId] !== cells[elementId]) {
                cells[elementId] === 1 ? element.classList.add(`alive`) : element.classList.remove(`alive`)
            }
        })
    }
    
    function gameloop() {
        drawTable()
        setTimeout(() => {
            requestAnimationFrame(gameloop)
        }, refresh_rate)
    }
    
    gameloop()
}

main()