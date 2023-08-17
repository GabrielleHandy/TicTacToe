//------------------CLASSSES-------------
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
    reset(){
        this.player = 0
        this.element.innerText = ""
    }

    //Checking for wins based on this squares location
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
                winningSquares = []
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
            winningSquares = []
            return false
        }
        else{
            this.squarebyRowCol(up, column, board)
            let upPlayer = this.currentSquare.player
            
            if (upPlayer === this.player) {
                return this.checkColumn(board,up, column)
            }
            winningSquares = []
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
            winningSquares = []
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
            winningSquares = []
            return false
        }
        else{
            this.squarebyRowCol(row, left, board)
            let leftPlayer = this.currentSquare.player
            
            if (leftPlayer === this.player) {
                // recursive function to get to column 2
                return this.checkRow( board,row, left)
            }
            winningSquares = []
            return false
        }
        
    }
    checkDiagonal(board,row=this.row, column=this.column){
        this.squarebyRowCol(2, 2, board)
        let middleSquare = this.currentSquare
        
        
        //for diagonals the sum of the row and columns are even. I also immediately check if player clicked middle
        if(!((row + column) %2 === 0)||middleSquare.player != this.player){
            winningSquares = []
            return false
        }
        //left diagonal
        this.squarebyRowCol(1, 1, board)
        let upperLeftSquare = this.currentSquare
        this.squarebyRowCol(3, 3, board)
        let lowerRightSquare = this.currentSquare

        //right diagonal
        this.squarebyRowCol(1, 3, board)
        let lowerLeftSquare = this.currentSquare
        this.squarebyRowCol(3, 1, board)
        let upperRightSquare = this.currentSquare

        if( upperLeftSquare.player === this.player && lowerRightSquare.player === this.player){
                winningSquares.splice(winningSquares.indexOf(lowerLeftSquare), 1)
                winningSquares.splice(winningSquares.indexOf(upperRightSquare), 1)
                return true
            }
        else if( lowerLeftSquare.player === this.player && upperRightSquare.player === this.player) {

            winningSquares.splice(winningSquares.indexOf(upperLeftSquare), 1)
            winningSquares.splice(winningSquares.indexOf(lowerRightSquare), 1)

            return true
        }else{


            winningSquares = []
            return false


        }
                
            }   
            
        
    
        
    
        
    
    squarebyRowCol(row, column, board){
        //used to find squares on the board. uses the holder variable in Square to use throughout methods
        board[row].forEach(squareObj => { 
            if(squareObj.column === column){
                this.currentSquare =squareObj
                if(!winningSquares.includes(squareObj)){
                    winningSquares.push(squareObj)
                }
                
            }
        })
    }

    
    
    
    
}

class Board{
    constructor(){
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
                    squareHtml.innerHTML = player.icon
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
    clearBoard(){
        if(winningSquares){
            winningSquares.forEach(square=>{
                square.element.classList.remove("winningSquares")
            })
            winningSquares = []
        }
        resetBtn.innerText = "Reset Board"
        ticTacToe.classList.remove("inactive")
        for (let row in this.squares){
            this.squares[row].forEach(square =>{
                square.reset()
            })


        }
        //removes winner announcement
        winner.remove()
    }
    makeInactive(){
        ticTacToe.classList.add("inactive")
        winningSquares.forEach(square=>{
            square.element.classList.add("winningSquares")
        })
    }
}
//--------------------INITIALIZED ELEMENTS AND VARIABLE ON GAME START UP -----------
const ticTacToe = document.querySelector("#ticTacBoard")
const result = document.querySelector("#results")
const resetBtn = document.querySelector(".reset")
const winner = document.createElement("div")
const announcement = document.createElement("h2")
// Variables for menu

const optionsBtn = document.querySelector("#optionBtn")
const historyBtn = document.querySelector("#historyBtn")
const navBar = document.querySelector("nav")


const playerOne = new Player(1, "Sarah")
const playerTwo = new Player(2)
const playerTurn = document.querySelector("em")
playerTurn.innerText = playerOne.name? playerOne.name : "Player One"
!playerOne.name? playerOne.name = "Player One": playerOne.name
!playerTwo.name? playerTwo.name = "Player Two": playerTwo.name
const gameBoard= new Board()
let winningSquares = []
//------EVENT LISTENERS-------
resetBtn.addEventListener("click", ()=> {gameBoard.clearBoard()})
optionsBtn.addEventListener("click",()=>{

    
    if(historyBtn.classList.contains("mainBtn")){
        historyBtn.click()
        setTimeout(()=>{moveNav(optionsBtn)}, 50)
        return
    }
    
    moveNav(optionsBtn)
    
})
historyBtn.addEventListener("click",()=>{

    
    if(optionsBtn.classList.contains("mainBtn")){
        optionsBtn.click()
        setTimeout(()=>{moveNav(historyBtn)}, 350)
        return
    }
    
    moveNav(historyBtn)
    
} )


//-------------FUNCTIONS------------------------------
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
function announceWinner(player) {
    resetBtn.innerText = "Start New Game"
    gameBoard.makeInactive()
    announcement.innerText = `${player.name} wins!!`
    winner.appendChild(announcement)
    
    result.appendChild(winner)
    
    playerOne.stats["gamesPlayed"]++
    playerTwo.stats["gamesPlayed"]++
    player.stats["wins"]++
    if(player.playerNum === playerOne.playerNum){
        playerTwo.stats["loss"]++
        
    }else{
        playerOne.stats["loss"]++
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

function moveNav(button) {
    let optionsWindow = document.querySelector("#Options")
    if(optionsWindow.classList.contains("collapse-horizontal")){
        
        if(navBar.classList.contains("openRight")){
            navBar.classList.remove("openRight")
            navBar.classList.add("closeLeft")
            console.log(button===historyBtn)
            button===historyBtn?historyBtn.classList.remove("mainBtn"):optionsBtn.classList.remove("mainBtn")
        }else{
            
            navBar.classList.remove("closeLeft")
            navBar.classList.add("openRight")
            button===historyBtn?historyBtn.classList.add("mainBtn"):optionsBtn.classList.add("mainBtn")


        }
    }

}




