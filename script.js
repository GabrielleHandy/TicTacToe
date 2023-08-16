//Tic tac toe grid
const ticTacToe = document.querySelector("#ticTacBoard")
class Player{
    constructor(name = ""){
        this.name =name
        this.icon = "image.url"
        this.stats = {win:0, loss: 0}
    }
    changeIcon(imageUrl){
        this.icon = imageUrl
    }
    changeName(newName){
        this.name = newName
    }
    updateStats(outcome){
        if (outcome === "w") {
            this.stats.win++
        } else {
            this.stats.lose++
        }
    }
    displayStats(){
        return this.stats
    }
}
class Square {
    constructor(column, row){
        //column and row will tell where location is
        this.column = column
        this.row = row
        this.player = null
        this.element
    }
    clickGrid(player){
        if(this.player){
            return
        }else(
            this.player = player
        )
    }
}
class Board{
    constructor(){
        //if active board can be clicked
        this.active = true
        this.squares = {1:[], 2:[],3:[]}
    }
    makeBoard(){
        
        for(let row = 1; row < 4; row++){
            for(let column = 1; column < 4; column++){
                let square = new Square(column, row)
                let squareHtml = document.createElement("div")
                squareHtml.className = `squareRow${row}  squareCol${column} square`
                square.element = squareHtml
                ticTacToe.appendChild(squareHtml)
                this.squares[`${row}`].push(square)


                squareHtml.addEventListener("click", ()=>{
                    squareHtml.innerText = "works!"
                })
        }
    }
}
}
const gameBoard= new Board()
gameBoard.makeBoard()
console.log(gameBoard.squares)




