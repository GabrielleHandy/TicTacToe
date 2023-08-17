//Tic tac toe grid
const ticTacToe = document.querySelector("#ticTacBoard")
const winner = document.createElement("div")
const result = document.querySelector("#results")
class Player{
    constructor(playerNum, name = ""){
        this.name =name
        this.playerNum = playerNum
        this.icon
        this.stats = {win:0, loss: 0}
        this.setIcon()
        
    }
    setIcon(){
        if(this.playerNum === 1){
            this.icon =  "X"
        }else{
            this.icon = "O"
        }
        
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
        //player changes when player clicks on square
        this.player = 0
        //holds HTML element for easier DOM manipulation
        this.element
        //holder used mostly for find functions
        this.currentSquare
    }
    claimSquare(player){
        
            this.player = player
        
    }

    
    checkColumn(board,row=this.row, column=this.column){
        let up = row - 1
        let down = row + 1
        
            // Based on rows up and down
        if (row === 1) {
            this.squarebyRowCol(down, column, board)
            let downPlayer = this.currentSquare.player
            
            if (downPlayer === this.player) {
                
                return this.checkColumn(board, down, column)
            }
            else{
                return false
            }
            // This is where a match will be determined because its double checking the top and bottom squares for a match
        }else if(row===2){
            this.squarebyRowCol(up, column, board)
            let upPlayer = this.currentSquare.player
            this.squarebyRowCol(down, column, board)
            let downPlayer = this.currentSquare.player
            if(upPlayer === this.player && downPlayer === this.player){
                
                return true
            
            }
            return false
        }
        else{
            this.squarebyRowCol(up, column, board)
            let upPlayer = this.currentSquare.player
            
            if (upPlayer === this.player) {
                return this.checkColumn(board,up, column)
            }
            return false
        }
        
    

    }


    checkRow(board,row=this.row, column=this.column){
        let left = column -1
        let right = column + 1
        //checks left and right squares to see if the player clicked them or not
        
        if (column === 1) {
            
            this.squarebyRowCol(row, right, board)
            let rightPlayer = this.currentSquare.player
            
            if (rightPlayer === this.player) {
                // recursive function to get to column 2
                return this.checkRow(board, row, right)
            }
            return false

        }else if(column===2){
            //in column 2 I look to the left and right to double check

            this.squarebyRowCol(row, left, board)
            let leftPlayer = this.currentSquare.player
            this.squarebyRowCol(row, right, board)
            let rightPlayer = this.currentSquare.player
            if(leftPlayer === this.player && rightPlayer === this.player){
            return true
            }
            return false
        }
        else{
            this.squarebyRowCol(row, left, board)
            let leftPlayer = this.currentSquare.player
            
            if (leftPlayer === this.player) {
                // recursive function to get to column 2
                return this.checkRow( board,row, left)
            }
            return false
        }
        
    }
    checkDiagonal(board,row=this.row, column=this.column){
        this.squarebyRowCol(2, 2, board)
        let middleSquare = this.currentSquare
        const leftDiagonal = [[1,1],[2,2],[3,3]]
        const rightDiagonal = [[1,3],[2,2],[3,1]]

        //for diagonals the sum of the row and columns are even. I also immediately check if player clicked middle
        if(!((row + column) %2 === 0)||middleSquare.player != this.player){
            return false
        }
    
            
        if(leftDiagonal.includes([row, column])){
            this.squarebyRowCol(1, 1, board)
            let upperLeftSquare = this.currentSquare
            
            if( upperLeftSquare.player === this.player){
                this.squarebyRowCol(3, 3, board)
                let lowerRightSquare = this.currentSquare
                
                if (lowerRightSquare.player === this.player) {
                    return true
                }
                
                
            }
            }
        if(rightDiagonal.includes([row, column])){
            this.squarebyRowCol(1, 3, board)
            let lowerLeftSquare = this.currentSquare
            if (lowerLeftSquare.player === this.player) {
                this.squarebyRowCol(3, 1, board)
                let upperRightSquare = this.currentSquare
                if (upperRightSquare.player === this.player) {
                    return true
                }
                    return false
                }
            }
            
            }
            
        
        

        
        
        


    squarebyRowCol(row, column, board){
        //used to find squares on the board. uses the holder variable in Square to use throughout methods
        board[row].forEach(squareObj => { 
            if(squareObj.column === column){
            
            this.currentSquare =squareObj
            
        }
        })
    }

    



}

class Board{
    constructor(){
        //if active board can be clicked
        this.active = true
        //holds squares by row
        this.squares = {1:[], 2:[],3:[]}
        this.selectedSquare
        this.makeBoard()
        

        
    }
    makeBoard(){
        // This creates the Squares for the board
        for(let row = 1; row < 4; row++){
            for(let column = 1; column < 4; column++){
                let square = new Square(column, row)
                
                let squareHtml = document.createElement("div")
                squareHtml.className = `squareRow${row}  squareCol${column} square ${row}`
                square.element = squareHtml
                ticTacToe.appendChild(squareHtml)
                this.squares[`${row}`].push(square)
        

                //event listener for every square
                squareHtml.addEventListener("click", ()=>{
                    let squareRow= squareHtml.classList[3]
                    this.squareByHtml(squareHtml, squareRow)
                    if(this.selectedSquare.player){
                        return
                    }
                    let player = changePlayer()

                    this.selectedSquare.claimSquare(player.playerNum)
                    squareHtml.innerText = player.icon
                    checkForWin(this.selectedSquare, player, this.squares)
                })
        }
    }
}
squareByHtml(htmlEl , row){
    this.squares[row].forEach(squareObj => { 
        if(squareObj.element === htmlEl){
        
        this.selectedSquare =squareObj
        
    }
        
    })
}

}

function checkForWin(square, playerobj, squares){
    console.log(square.checkRow(squares),
    square.checkColumn(squares),
    square.checkDiagonal(squares))
    if(square.checkRow(squares)||
    square.checkColumn(squares)||
    square.checkDiagonal(squares))
    {
        console.log("here")
        gameBoard.active = false
        announceWinner(playerobj)
    }

}

const playerOne = new Player(1, "Sarah")
const playerTwo = new Player(2)
const playerTurn = document.querySelector("em")
playerTurn.innerText = playerOne.name? playerOne.name : "Player One"
!playerOne.name? playerOne.name = "Player One": playerOne.name
!playerTwo.name? playerTwo.name = "Player Two": playerTwo.name
const gameBoard= new Board()



function announceWinner(player) {
    let announcement = document.createElement("h2")
    announcement.innerText = `${player.name} wins!!`
    winner.appendChild(announcement)
    console.log(winner)
    result.appendChild(winner)
    
    player.stats["wins"]++
    if(player.playerNum === playerOne.playerNum){
        playerTwo.stats["loss"]++
    }else{
        playerOne.stats["wins"]++
    }
    
}
function changePlayer() {



    if(playerTurn.id === "playerOne"){
        
        playerTurn.innerText = playerTwo.name? playerTwo.name : "Player Two"
        playerTurn.setAttribute("id", "playerTwo")
        return playerOne
    }else{
        playerTurn.innerText = playerOne.name? playerOne.name : "Player One"
        playerTurn.setAttribute("id", "playerOne")
        return playerTwo
    }
    
}





