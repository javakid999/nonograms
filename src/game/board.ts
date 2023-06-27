import type { Canvas } from "../api/canvas"

export class Board {
    squares: number[][]
    ruleCols: number[][]
    ruleRows: number[][]
    width: number
    height: number
    placedTiles: number[][]
    colors: string[]
    selectedColor: number
    numPlacedTiles: number
    numTiles: number
    state: number

    constructor() {
        this.squares = []
        this.placedTiles = []
        this.colors = []
        this.height = 0
        this.width = 0
        this.numTiles = 0
        this.state = 0
        this.selectedColor = 1
    }

    generateBoard(width: number, height: number, colors: string[], tiles: number[]) {
        this.squares = Array(height).fill(0).map(_x => Array(width).fill(0))
        this.placedTiles = Array(height).fill(0).map(_x => Array(width).fill(0))
        this.colors = [...colors];
        this.numPlacedTiles = 0
        this.numTiles = 0
        this.state = 0
        this.selectedColor = 1
        tiles.forEach((cell, i) => {
                this.squares[Math.floor(i/width)][i%width] = cell
                this.numTiles += cell != 0 ? 1 : 0;
        })
        this.ruleCols = []
        this.ruleRows = []
        this.squares.forEach((row) => {
            let ruleRow = []
            let rule = []
            row.forEach((cell, i) => {
                if (cell > 0) {
                    if (rule.length == 0) {
                        rule = [1,cell]
                    } else if (rule.length != 0 && rule[1] == cell) {
                        rule[0]++
                    } else if (rule.length != 0 && rule[1] != cell) {
                        ruleRow.push(rule);
                        rule = [1,cell]
                    }
                }
                if (cell == 0) {
                    if (rule.length != 0) {
                        ruleRow.push(rule)
                        rule = []
                    }
                }
                if (i == this.squares[0].length-1 && rule.length != 0) ruleRow.push(rule)
            })
            this.ruleRows.push(ruleRow)
        })
        for (let i = 0; i < this.squares[0].length; i++) {
            let ruleCol = []
            let rule = []
            for (let j = 0; j < this.squares.length; j++) {
                let cell = this.squares[j][i]
                if (cell > 0) {
                    if (rule.length == 0) {
                        rule = [1,cell]
                    } else if (rule.length != 0 && rule[1] == cell) {
                        rule[0]++
                    } else if (rule.length != 0 && rule[1] != cell) {
                        ruleCol.push(rule);
                        rule = [1,cell]
                    }
                }
                if (cell == 0) {
                    if (rule.length != 0) {
                        ruleCol.push(rule)
                        rule = []
                    }
                }
                if (j == this.squares.length-1 && rule.length != 0) ruleCol.push(rule)
            }
            this.ruleCols.push(ruleCol)
        }
        this.width = width + Math.max(...this.ruleRows.map(rule => rule.length))
        this.height = height + Math.max(...this.ruleCols.map(rule => rule.length))
    }

    render(canvas: Canvas) {   
        const ctx = canvas.ctx
        const position = [(800-this.width*20)/2, (600-this.height*20)/2]
        const ruleSize = [Math.max(...this.ruleRows.map(rule => rule.length)), Math.max(...this.ruleCols.map(rule => rule.length))]
        canvas.ctx.strokeStyle = 'black'
        canvas.ctx.lineWidth = 1;
        ctx.fillStyle = this.colors[0]
        ctx.fillRect(position[0],position[1],this.width*20,this.height*20)
        this.ruleCols.forEach((col, j) => {
            ctx.beginPath()
            ctx.moveTo(position[0]+j*20+ruleSize[0]*20, position[1])
            ctx.lineTo(position[0]+j*20+ruleSize[0]*20, position[1]+this.height*20)
            ctx.stroke()
            col.forEach((num, i) => {
                ctx.fillStyle = this.colors[num[1]]
                ctx.fillText(num[0].toString(), position[0]+j*20+5+ruleSize[0]*20, position[1]+i*20-col.length*20+10+ruleSize[1]*20)
            })
        })
        this.ruleRows.forEach((row, j) => {
            ctx.beginPath()
            ctx.moveTo(position[0], position[1]+j*20+ruleSize[1]*20)
            ctx.lineTo(position[0]+this.width*20, position[1]+j*20+ruleSize[1]*20)
            ctx.stroke()
            row.forEach((num, i) => {
                ctx.fillStyle = this.colors[num[1]]
                ctx.fillText(num[0].toString(), position[0]+i*20-row.length*20+5+ruleSize[0]*20, position[1]+j*20+15+ruleSize[1]*20)
            })
        })
        this.placedTiles.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell > 0) {
                    ctx.fillStyle = this.colors[cell]
                    ctx.fillRect(j*20+position[0]+ruleSize[0]*20,i*20+position[1]+ruleSize[1]*20,20,20)
                } else if (cell == -1) {
                    ctx.drawImage(canvas.assets['cross'], j*20+position[0]+ruleSize[0]*20+2,i*20+position[1]+ruleSize[1]*20+2,16,16)
                }
            })
        })
        this.colors.forEach((color, i) => {
            if (i > 0) {
                canvas.ctx.fillStyle = color
                canvas.ctx.lineWidth = 4;
                canvas.ctx.fillRect(position[0]-30,position[1]+(i-1)*this.height*20/(this.colors.length-1),30,this.height*20/(this.colors.length-1))
            }
        })
        canvas.ctx.strokeRect(position[0]-30,position[1]+(this.selectedColor-1)*this.height*20/(this.colors.length-1),30,this.height*20/(this.colors.length-1))
    }

    checkWin() {
        for (let i = 0; i < this.squares.length; i++) {
            for (let j = 0; j < this.squares[i].length; j++) {
                if ((this.squares[i][j] > 0 && this.placedTiles[i][j] == 0) || (this.squares[i][j] > 0 && this.placedTiles[i][j] == -1)) return false
            }
        }
        return true;
    }

    placeTile(mousePos: number[], click: number) {
        const position = [(800-this.width*20)/2, (600-this.height*20)/2]
        const ruleSize = [Math.max(...this.ruleRows.map(rule => rule.length)), Math.max(...this.ruleCols.map(rule => rule.length))]
        if (mousePos[0] > position[0]+ruleSize[0]*20 && mousePos[0] < position[0]+ruleSize[0]*20+this.squares[0].length*20 && mousePos[1] > position[1]+ruleSize[1]*20 && mousePos[1] < position[1]+ruleSize[1]*20+this.squares.length*20) {
            const x = Math.floor((mousePos[0]-position[0]-ruleSize[0]*20)/20)
            const y = Math.floor((mousePos[1]-position[1]-ruleSize[1]*20)/20)
            if (this.placedTiles[y][x] == 0 && click == 0) { this.placedTiles[y][x] = this.selectedColor; this.numPlacedTiles++ }
            else if (this.placedTiles[y][x] > 0 && click == 0) { this.placedTiles[y][x] = 0; this.numPlacedTiles-- } 
            else if (this.placedTiles[y][x] > 0 && click == 1) { this.placedTiles[y][x] = 0; this.numPlacedTiles-- } 
            else if (this.placedTiles[y][x] == 0 && click == 1) { this.placedTiles[y][x] = -1 }
            else if (this.placedTiles[y][x] == -1 && click == 1) { this.placedTiles[y][x] = 0 }

            if (this.numPlacedTiles == this.numTiles) {
                if (this.checkWin()) {this.state = 1}
            }
        } else if (mousePos[0] > position[0]-30 && mousePos[0] < position[0] && mousePos[1] > position[1] && mousePos[1] < position[1]+this.height*20) {
            this.selectedColor = Math.floor((mousePos[1]-position[1])/(this.height*20/(this.colors.length-1)))+1
        }
    }
}