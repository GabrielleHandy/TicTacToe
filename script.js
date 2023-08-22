//------------------CLASSSES-------------
class Player{
    constructor(playerNum, name = ""){
        this.name =name
        this.playerNum = playerNum
        this.icon
        this.stats = {win:0, loss: 0,tie:0, gamesPlayed:0}
        this.statElements
        this.theme = "color1"
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
        this.save()

    }
    updateStats(outcome = "tie"){
        if (outcome === "W") {
            this.stats.win += 1
        } else if(outcome==="L") {
            this.stats.loss +=1 
        }else{
            this.stats.tie += 1
        }

        this.stats.gamesPlayed++
        this.save()
        this.displayStats()
        
    }
    displayStats(){
        this.statElements[0].innerText = this.name
        this.statElements[1].innerText = this.stats.win
        this.statElements[2].innerText = this.stats.loss
        this.statElements[3].innerText = this.stats.tie
        this.statElements[4].innerText = this.stats.gamesPlayed

        
    }
    save(){
        let statsArray = []
        localStorage["playerName"] = this.name
        for(let stat in Object.values(this.stats)){
            
            
            statsArray.push(stat)
        }
        localStorage["playerStats"] = statsArray
        localStorage["theme"] = this.theme
    }  
    load(){
        this.name = localStorage['playerName']
        let tempArray = localStorage.playerStats.split(",")
        this.stats = {win:parseInt(tempArray[0]), 
                        loss: parseInt(tempArray[1]),
                        tie: parseInt(tempArray[2]), 
                        gamesPlayed:parseInt(tempArray[3])}

        changeDesign(localStorage['theme'])
    }
}
class AiPlayer extends Player{
    constructor(statElements, stats){
        super(stats,statElements )
        this.name = "AI"
        this.type= "AI"
        this.playerNum = 2
        this.icon ="O"
    }
    //I let chatGpt teach me how to get a better understanding of AI: https://chat.openai.com/share/f9efa7d7-a3dd-455c-ba1d-ee6628e0ec0f
    makeMove(board){
        let emptySquares = []
        for(let i = 1 ; i< 4; i++){
            
            board[i].forEach(square =>{
                
                if(square.player === 0){
                    emptySquares.push(square)
                }
            })

        }
        
        const moveChoice = this.minimax(board, playerTwo, emptySquares).move
        
        moveChoice.element.click()
        checkForWin(moveChoice, playerTwo, board)
    }

    evaluateBoard(board) {
        const winningCombinations = [
            [[1, 0], [1, 1], [1, 2]], // Rows
            [[2, 0], [2, 1], [2, 2]],
            [[3, 0], [3, 1], [3, 2]],
            [[1, 0], [2, 0], [3, 0]], // Columns
            [[1, 1], [2, 1], [3, 1]],
            [[1, 2], [2, 2], [3, 2]],
            [[1, 0], [2, 1], [3, 2]], // Diagonals
            [[1, 2], [2, 1], [3, 0]]
        ];
    
        let score = 0;
    
        for (const combination of winningCombinations) {
            const aiCount = combination.filter(coords => board[coords[0]][coords[1]].player === this.playerNum).length
            
            const opponentCount = combination.filter(coords => board[coords[0]][coords[1]].player !== 0 && board[coords[0]][coords[1]].player !== this.playerNum).length
            if (aiCount === 3) {
                score += 100; // AI wins
            } else if (opponentCount === 3) {
                score -= 100; // Opponent wins
            } else {
                score += aiCount; // Encourage AI to complete its own lines
                score -= opponentCount; // Discourage opponent from completing their lines
            }
        }
        return score;
    }
    
    
    minimax(board, currentPlayer, emptySquares, square = null) {
        //This step is the brain of the function. Each move is evaluated to see if it will win or not
    
        if(square){
            if (checkForWin(square, currentPlayer, board, true)) {
                let score = this.evaluateBoard(board)
                return {score: score}
                } 
                
            }else if(emptySquares.length === 0) {
            return { score: 0 }
            }

            
        let bestMove
        if (currentPlayer.playerNum === this.playerNum) {
            //sets best score to -inifinty so that any move is better than no move
            //AI wants a score as high as possible
            let bestScore = -Infinity
            for (let move of emptySquares) {
                move.claimSquare(currentPlayer.playerNum)

                let tempSquares = emptySquares.slice()
                tempSquares.splice(tempSquares.indexOf(move), 1)
                
                let score = this.minimax(board, playerOne, tempSquares, move).score
                

                move.reset()
                
                // Update alpha and bestScore
                if (score > bestScore) {
                    bestScore = score
                    bestMove = move
                }
                
                // Prune branches if beta is smaller or equal to        `
            }
            
            return {score: bestScore , move: bestMove}
        } else {
            let bestScore = Infinity
            for (let move of emptySquares) {
                
                move.claimSquare(playerOne.playerNum)
                
                
                let tempSquares = emptySquares.slice()
                tempSquares.splice(tempSquares.indexOf(move), 1)
                
                let score = this.minimax(board, playerTwo, tempSquares, move).score;
                console.log(`Opponent ${move} ${score}`)
                move.reset()
                
                if (score < bestScore) {
                    bestScore = score
                    bestMove = move
                    
                }
            }
            return { score: bestScore, move: bestMove};
        }
    }
    displayStats(){
        super.displayStats()
    }
    updateStats(outcome="tie"){
        super.updateStats(outcome)
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
                
                this.squarebyRowCol(this.row, this.column, board)
                winningSquares.push(this.currentSquare)
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
        //adds this instance to the winning array

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

                this.squarebyRowCol(this.row, this.column, board)
                winningSquares.push(this.currentSquare)
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
        this.remainingMoves = 0
        this.active = true
        this.makeBoard()
        this.clearBoard("set")
        
    }
    makeBoard(){
        // This creates the Squares for the board
        this.remainingMoves= 9
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
                    this.remainingMoves--
                    let player = changePlayer()

                    this.selectedSquare.claimSquare(player.playerNum)
                    squareHtml.innerHTML = player.icon

                    checkForWin(this.selectedSquare, player, this.squares)
                    if(this.active){

                        
                        if(player.playerNum === 1){
                            if(playerTwo.type){

                                setTimeout(()=>{playerTwo.makeMove(this.squares)}, 1000)
                                
                            }
                            
                        }
                    }
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
        this.active = true
        this.remainingMoves=9
        result.style.backgroundImage = null
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

            changePlayer("reset")
        }
        //removes winner announcement
        winner.remove()
    }
    makeInactive(){
        this.active = false
        ticTacToe.classList.add("inactive")
        if(winningSquares){

            winningSquares.forEach(square=>{
                square.element.classList.add("winningSquares")
            })
        }
    }
}
//--------------------INITIALIZED ELEMENTS AND VARIABLE ON GAME START UP -----------
const aiBtn = document.querySelector("#AI")
const bodyEl = document.querySelector("body")
const ticTacToe = document.querySelector("#ticTacBoard")
const result = document.querySelector("#results")
const resetBtn = document.querySelector(".reset")
const winner = document.createElement("div")
winner.setAttribute("id", "winner")
const announcement = document.createElement("h2")
let winningSquares = []

const player1Wins = document.querySelector("#player1Wins")
const player1loss = document.querySelector("#player1Loss")
const player1totalGames = document.querySelector("#totalGames1")
const player1ties = document.querySelector("#tie1")
const player1Name = document.querySelector("#player1Name")

const player2Wins = document.querySelector("#player2Wins")
const player2loss = document.querySelector("#player2Loss")
const player2ties = document.querySelector("#tie2")
const player2totalGames = document.querySelector("#totalGames2")
const player2Name = document.querySelector("#player2Name")

// Variables for menu
const optionsBtn = document.querySelector("#optionBtn")
const historyBtn = document.querySelector("#historyBtn")
const menus = document.querySelectorAll(".collapse")
if(window.screen.width < 800){
    menus.forEach(menu => {
        menu.classList.remove("collapse-horizontal")
    })
}
const navBar = document.querySelector("nav")
const nameChange = document.querySelector(".nameChange")
const  nameChangeBtn = document.querySelector("#submitName")
const nameChangeCheckBoxs = document.querySelectorAll(".flexSwitchCheckDefault")
const nameChangeForm = document.querySelector("form")




//Color Choices
const colorChoices= {
    color1: {bodyBackground:"radial-gradient(#cdffd8, #9198e5)", bodyText:"", buttonColor:"", menuBackground:"" },
    color2: {bodyBackground:"linear-gradient(200deg,rgb(244, 226, 216), rgb(186, 83, 112))", bodyText:"rgb(186, 83, 112)", buttonColor:"rgb(186, 83, 112)", menuBackground:"" },
    color3: {bodyBackground:"radial-gradient(rgb(255, 216, 155), rgb(25, 84, 123))", bodyText:"white", buttonColor:"rgb(20, 30, 48)", menuBackground:"rgb(51 76 120)"},
    color4: {bodyBackground:"radial-gradient(rgb(51 81 116), rgb(20, 30, 48))", bodyText:"white", buttonColor:"rgb(20, 30, 48)", menuBackground:"rgb(51 76 120)"},
    color5: {bodyBackground:"linear-gradient(25deg,rgb(207, 203, 210), rgb(203, 152, 237), rgb(139, 99, 218), rgb(53 41 107))", bodyText:"white", buttonColor:"rgb(53 41 107)", menuBackground:"rgb(172 140 236)"},
    color6: {bodyBackground:"linear-gradient(163deg,rgb(215, 96, 63), rgb(111 35 25))", bodyText:"", buttonColor:"rgb(59, 30, 28)", menuBackground:"rgb(172 70 57)"},
}
const colorDivs = document.querySelectorAll(".backgroundColor")
let activeColor = colorDivs[0]
const buttons = document.querySelectorAll(".btn")
const  menuHeaders = document.querySelectorAll(".card-header")


const playerOne = new Player(1)
if(window.localStorage["playerName"]){
    playerOne.load()
}
let playerTwo = new Player(2)

const playerTurn = document.querySelector("em")

playerOne.statElements = [player1Name, player1Wins,player1loss,player1ties, player1totalGames]
playerTwo.statElements = [player2Name, player2Wins,player2loss,player2ties, player2totalGames]

!playerOne.name? playerOne.name = "Player One": playerOne.name
!playerTwo.name? playerTwo.name = "Player Two": playerTwo.name
playerOne.displayStats()
playerTwo.displayStats()





const gameBoard= new Board()



//------EVENT LISTENERS-------
resetBtn.addEventListener("click", ()=> {gameBoard.clearBoard()})
window.addEventListener("resize", ()=>{
    if(window.screen.width < 800){
        menus.forEach(menu => {
            menu.classList.remove("collapse-horizontal")
        })
    }else{
        if(!menus[0].classList.contains("collapse-horizontal")){
            menus.forEach(menu => {
                menu.classList.add("collapse-horizontal")
            })
        }
    }

})
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
        setTimeout(()=>{moveNav(historyBtn)}, 50)
        return
    }
    
    moveNav(historyBtn)
    
} )






colorDivs.forEach(button =>{

    button.addEventListener("click",()=>{
        changeDesign(button.classList[1])
        
        button.classList.add("chosen")
        activeColor.classList.remove("chosen")
        activeColor = button
        
    })





})
nameChangeCheckBoxs.forEach(box=>{
    box.addEventListener("change", ()=>{
        if(box.checked){
            if(box.getAttribute("value")==="1"){
                nameChangeCheckBoxs[1].setAttribute("disabled", true)
            }
            else{
                nameChangeCheckBoxs[0].setAttribute("disabled", true)
            }
        }else{
            if(box.getAttribute("value")==="1"){
                nameChangeCheckBoxs[1].removeAttribute("disabled")
            }
            else{
                nameChangeCheckBoxs[0].removeAttribute("disabled")
            }
        }
    })

})
nameChangeForm.addEventListener("submit", (e)=>{
    e.preventDefault()

    
    let name = nameChange.value
    
    if(nameChangeCheckBoxs[0].checked){
        playerOne.changeName(name)
        playerOne.statElements[0] = playerOne.name
        playerTurn.id === "playerOne"?playerTurn.innerText=playerOne.name:playerTurn.id = playerTurn.id
    }else if(nameChangeCheckBoxs[1].checked){
        playerTwo.changeName(name)
        playerTwo.statElements[0] = playerTwo.name
        playerTurn.id === "playerTwo"?playerTurn.innerText=playerTwo.name:playerTurn.id = playerTurn.id
    }else(
        alert("Please Chose a player")
    )


})
aiBtn.addEventListener("click", ()=>{

    
    playerTwo = new AiPlayer()
    playerTwo.statElements = [player2Name, player2Wins,player2loss,player2ties, player2totalGames]
    playerTwo.displayStats()
})



//-------------FUNCTIONS------------------------------
function checkForWin(square, playerobj, squares, Ai=null){
    if(square.checkRow(squares)||
    square.checkColumn(squares)||
    square.checkDiagonal(squares))
    {
        if(Ai){
            winningSquares = []
            return true
        }
        announceWinner(playerobj)
    }else if(gameBoard.remainingMoves <= 0){
        announceWinner(null, tie="tie")
    }
    else{
        if(Ai){
            return false
        }
    }
    
}
function announceWinner(player,tie="") {
    resetBtn.innerText = "Start New Game"
    gameBoard.makeInactive()
    
    if(tie){
        announcement.innerText = `It's a draw!!`
        playerOne.updateStats()
        playerTwo.updateStats()
    }else{

        announcement.innerText = `${player.name} wins!!`
        player.updateStats("W")
        if(player.playerNum === playerOne.playerNum){
            playerTwo.updateStats("L")
        }else{
            playerOne.updateStats("L")
        }
    }
    
    winner.appendChild(announcement)
    result.style.backgroundImage = `url(https://media.giphy.com/media/n8DNCT49yl1keRq8p5/giphy.gif)`
    result.appendChild(winner)

    playerOne.displayStats()
    playerTwo.displayStats()
}
function changePlayer(reset="") {
    
    if(reset){
        playerTurn.innerText = playerOne.name? playerOne.name : "Player One"
        playerTurn.setAttribute("id", "playerOne")
        return
    }

    if(playerTurn.id === "playerOne"){
        if(playerTwo.type){
            playerTurn.innerText = "AI"
            playerTurn.setAttribute("id", "playerTwo")
            return playerOne
        }
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
    
        
        if(navBar.classList.contains("moveOpen")){
            ticTacToe.classList.remove("inactive")
            navBar.classList.remove("moveOpen")
            navBar.classList.add("moveClose")
            button===historyBtn?historyBtn.classList.remove("mainBtn"):optionsBtn.classList.remove("mainBtn")
        }else{
            ticTacToe.classList.add("inactive")
            navBar.classList.remove("moveClose")
            navBar.classList.add("moveOpen")
            button===historyBtn?historyBtn.classList.add("mainBtn"):optionsBtn.classList.add("mainBtn")


        }
    

}

function changeDesign(colorNum){
    
    let newStyles = colorChoices[colorNum]
    bodyEl.style.background = newStyles.bodyBackground
    bodyEl.style.color = newStyles.bodyText
    buttons.forEach(button =>{
        button.style.background = newStyles.buttonColor
        
    })
    menuHeaders.forEach(header =>{
        header.style.background = newStyles.menuBackground
    })
    playerOne.theme = colorNum
    playerOne.save()
}


