let isSessionActive = false

const Gameboard = (() => {
    let gameboard = ["","","","","","","","",""]

    const renderSquares = () => {

        let boardHTML = ""
        let turn = "X"
        gameboard.forEach((square, i) => {
            boardHTML += `<div class="square align" id=square-${i}>${square}</div>`
        })
        document.querySelector('#gameboard').innerHTML = boardHTML;
        const allSquares = document.querySelectorAll('.square');
        allSquares.forEach((square) => {
            square.addEventListener('click', Game.handleClick)
        })
    }

    const checkSquares = () => {
        const checkIndexes = (array) =>{
            const firstEl = array[0]
            if(!firstEl) return false
        
            var result = true;
        
            array.forEach(elem => {
                if(elem != firstEl){
                    result = false
                }   
            });
            return result
        }
    
        const winningCombos = {
            "horizontals":[[0,1,2],
                           [3,4,5],
                           [6,7,8]
            ],
            "verticals":[[0,3,6],
                        [1,4,7],
                        [2,5,8]
            ],
            "diags":[[0,4,8],
                    [6,4,2],
            ],
        }
    
        for (let type in winningCombos) {
            for (let combo of winningCombos[type]) {
                let gbChunck = combo.map(index => gameboard[index]);
                if(checkIndexes(gbChunck)){
                    console.log(`Found winning combo: ${gbChunck}`)
                    return true
                }
            }
        }
        return false
    }

    checkTie = () => {
        if(!gameboard.includes("")){
            return true
        }
        return false   
    }


    const update = (index, value) => {
        gameboard[index] = value;
        renderSquares();
    }

    const changeSymbol = (currPlayerIndex) => {
        if(currPlayerIndex === 1){
            document.querySelector(".turn-bg").style.left = "85px"
        }
        else{
            document.querySelector(".turn-bg").style.left = "0"
        }
    }

    const checkPlayerName = (name, symbol) => {
        if(symbol === "X"){
            name = document.querySelector('#player-1').value
        }
        else if(symbol === "O"){
            name = document.querySelector('#player-2').value
        }
        return { name, symbol }
    }

    return { renderSquares, update, checkSquares, checkTie, changeSymbol, checkPlayerName }

})();

const createPlayer = (name, symbol) => {
    if(name === "" && symbol === "X"){
        name = "Player X"
    }
    else if(name === "" && symbol === "O"){
        name = "Player O"
    }
    return { name, symbol }
}



const Game = (() => {
    let players = [];
    let currPlayerIndex;
    let isGameOver;

    const start = () => {
        if(isSessionActive === false){
            players = [
                createPlayer(document.querySelector('#player-1').value, "X"),
                createPlayer(document.querySelector('#player-2').value, "O")
            ];
            currPlayerIndex = 0;
            isGameOver = false;
            Gameboard.renderSquares()
            isSessionActive = true
        }
    }
    const restart = () => {
        isSessionActive = true
        for (let i = 0; i < 9; i++){
            Gameboard.update(i,"");
        }
        Gameboard.renderSquares()
        isGameOver = false;
        // displayController.printMessage(messageDiv, "")
        document.querySelector(".turn-bg").style.left = "0"
        messageDiv.style.color = '#011627'
        players = [
            createPlayer(document.querySelector('#player-1').value, "X"),
            createPlayer(document.querySelector('#player-2').value, "O")
        ];
        // messageDiv.innerText = "Hidden Message"
    }

    const handleClick = (event) => {
        if(isGameOver){
            return
        }
        else if (event.target.innerHTML == "") {
            let squareId = event.target.id
            let squareIdArr = squareId.split('-');
            const squareIndex = parseInt(squareIdArr[1]);
            Gameboard.update(squareIndex, players[currPlayerIndex].symbol)

            checkForWin = Gameboard.checkSquares();
            checkForTie = Gameboard.checkTie();
            // let adjustedNames = Gameboard.checkPlayerName(players[currPlayerIndex].name, players[currPlayerIndex].symbol);
            // if (players[currPlayerIndex].name !== "Player X" || players[currPlayerIndex].name !== "Player O"){
            //        players[currPlayerIndex].name = adjustedNames.name;
            //     }
            // else if(players[currPlayerIndex].name === "" && symbol === "X"){
            //     players[currPlayerIndex].name = "Player X"
            // }
            // else if(players[currPlayerIndex].name === "" && symbol === "O"){
            //     players[currPlayerIndex].name= "Player O"
            // }

            if (checkForWin == true){
                Gameboard.update(squareIndex, players[currPlayerIndex].symbol)
                console.log(`${players[currPlayerIndex].name} vince sta mazza!`)
                displayController.printMessage(messageDiv, `${players[currPlayerIndex].name} WINS !`)
                isGameOver = true
            }
            else if (checkForTie == true){
                Gameboard.update(squareIndex, players[currPlayerIndex].symbol)
                console.log(`Si apereggia e si spereggia`)
                displayController.printMessage(messageDiv, `It's a tie !`)
                isGameOver = true
            }

            currPlayerIndex = currPlayerIndex === 0 ? 1 : 0;
            Gameboard.changeSymbol(currPlayerIndex)

        }


        // return console.log(squareIndex)
    }

    return { start, restart, handleClick, }

})();

const displayController = (() => {

    const printMessage = (selector, message) => {
        selector.innerText = message
        if (selector.style.color === 'rgb(1, 22, 39)' || selector.style.color === '#011627') {
            selector.style.color = '#fdfffc';
        }
    }

    return { printMessage }

})();

const startBtn = document.querySelector('#start-btn');
startBtn.addEventListener('click', () => {
    Game.start()    
})

const restartBtn = document.querySelector('#restart-btn');
restartBtn.addEventListener('click', () => {
    Game.restart()    
})

const messageDiv = document.querySelector('#message');



