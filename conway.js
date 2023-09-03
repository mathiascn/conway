function createTable(cell_count) {
    const body = document.getElementsByTagName('body')[0]
    const table = document.createElement('table')
    const tbody = document.createElement('tbody')

    idx = 0
    for (let i = 1; i <= cell_count; i++) {
        const tr = document.createElement("tr")
        for (let j = 0; j < cell_count; j++) {
            idx++
            const td = document.createElement("td")
            td.setAttribute("data-tag",idx)
            tr.appendChild(td)
        }
        tbody.appendChild(tr)
    }

    table.appendChild(tbody)
    body.appendChild(table)
}

function init(initial_cells) {
    const tds = document.querySelectorAll("td")
    tds.forEach(td => {
        const dataTag = parseInt(td.getAttribute('data-tag'))
        if (initial_cells.includes(dataTag)) {
            td.classList.add("alive")
        }
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

function get_cell_to_kill(element, cell_count) {
    const cell_id = parseInt(element.getAttribute('data-tag'))
    const neighbors = getNeighbors(cell_id, cell_count)

    const aliveNeighbors = neighbors.reduce((acc, neighbor_id) => {
        const neighbor_element = document.querySelector(`td[data-tag="${neighbor_id}"]`)
        if (neighbor_element.classList.contains('alive')) {
            acc++
        }
        return acc
    }, [0])

    if (aliveNeighbors < 2 || aliveNeighbors > 3) {
        return element
    }
    return null
}

function ruleOne(elements, cell_count) {
    const elements_to_kill = []
    elements.forEach(element => {
        const cell_to_kill = get_cell_to_kill(element, cell_count)
        if (cell_to_kill !== null) {
            elements_to_kill.push(cell_to_kill)
        }
    })

    elements_to_kill.forEach(element => {
        element.classList.remove('alive')
    })
}

function get_cell_to_alive(element, cell_count) {
    const cell_id = parseInt(element.getAttribute('data-tag'))
    const neighbors = getNeighbors(cell_id, cell_count)

    const aliveNeighbors = neighbors.reduce((acc, neighbor_id) => {
        const neighbor_element = document.querySelector(`td[data-tag="${neighbor_id}"]`)
        if (neighbor_element.classList.contains('alive')) {
            acc++
        }
        return acc
    }, [0])

    if (aliveNeighbors===3) {
        return element
    }
    return null
}

function ruleFour(elements, cell_count) {
    const cells_to_alive = []
    elements.forEach(element => {
        const cell_to_alive = get_cell_to_alive(element, cell_count)
        if (cell_to_alive !== null) {
            cells_to_alive.push(cell_to_alive)
        }
    })

    cells_to_alive.forEach(element => {
        element.classList.add('alive')
    })
}

function gameloop(cell_count) {
    const alive_cells = document.querySelectorAll("td.alive")
    ruleOne(alive_cells, cell_count)
    const dead_cells = document.querySelectorAll("td:not(.alive)")
    ruleFour(dead_cells, cell_count)
}

function main() {
    cell_count = 50
    refresh_rate = 250
    initial_cells = []

    for (let index = 1; index < cell_count*cell_count; index++) {
        if (Math.random() < 0.4) {
            initial_cells.push(index)
        }
    }

    createTable(cell_count)
    init(initial_cells)
    setInterval(() => gameloop(cell_count),refresh_rate)
}

main()