var stateIndex = 0
var message = "";
var states = ["X", "O"]
var BOARD = [" ", " ", " ", " "," " ," "," "," "," "]

var wins = [
    // horizontals
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],

    // diagonals
    [1, 5, 9],
    [3, 5, 7],

    // verticals
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
]

var boxes = [];
for(var i = 1; i < 10; i++){
    boxes.push(document.getElementById(i.toString()))
}

function placeXorO(element) {
    var response = run_game(parseInt(element.id) - 1)
    if((response !== false)){
        element.innerText = "X"
    }

    if (response === true) {
        let [max_value, position] = generator(BOARD, getArrayValueIndices(BOARD, " "), stateIndex)
        console.log(position)
        response = run_game(position); 

        setTimeout(
            function () {     
                  
                boxes[position].innerText = "O"
            },
            900
        );
    }


    if (response === -1) {
        setTimeout(
            function (){
                alert(message)
                resetGame();
            }, 
            1250
        );
    }
}

function checkWin2(board = null) {
    if (board === null) board = BOARD;
    for(var i = 0; i < wins.length; i++){
        win = wins[i]

        if (
            (board[win[0]-1] === board[win[1]-1]) && 
            (board[win[0]-1] === board[win[2]-1]) &&
            (board[win[0]-1].trim().length > 0)){
                return true;
        }
    }

    return false;
}

function checkWin(board=null) {
    if(board===null) board = BOARD;

    wins = [
        [1, 4],
        [2, 3]
    ]

    for (var i = 0; i < wins.length; i++) {
        win = wins[i]

        if ((board[win[0] - 1] === board[win[1] - 1]) && (board[win[0] - 1].trim().length > 0)) {
            return true;
        }
    }

    return false;
}

function helpInfo(){
    BOARD = ["1", "2", "3", "4"]

    console.log("These are the board positions!")
    displayBoard()
    BOARD = [" ", " ", " ", " "," " ," "," "," "," "]
}

function play(position, board=null, index=null){
    if(board === null){
        board = BOARD
    }

    if(index === null){
        index = stateIndex
    }

    board[position] = states[index]
    return board
}

function evaluateBoard(board, current_state){
    console.log(checkWin2(board))
    if(checkWin2(board)){
        if(current_state === "O"){
            return 1

        }else{
            return -1
        }
    }

    if(checkFull(board)) return 0    
}

function removeArrayValue(arr, value) {
    return arr.filter(
        function (ele) {
            return ele != value; 
        }
    ); 
}

function countArrayValue(arr, value) {
    return arr.filter(
        function (ele) {
            return ele === value;
        }
    ).length;
}

function getArrayValueIndex(array, value) {
    for (let index = 0; index < array.length; index++) {
        if(array[index] === value) return index
        
    }
    return -1;
}

function getArrayValueIndices(array, value) {
    let indices = [];
    for (let index = 0; index < array.length; index++) {
        if (array[index] === value) indices.push(index);

    }
    return indices;
}

function generator(board, available_positions, localStateIndex){
    // console.log(board)
    // console.log(evaluateBoard(board, states[(localStateIndex + 1) % 2]))
    // console.log(checkWin(board))
    // console.log(checkFull(board))
    if(checkWin2(board) || checkFull(board)){
        // displayBoard(board)
        return [evaluateBoard(board, states[(localStateIndex + 1) % 2]), null]
    }

    let board_evaluations = []

    for(var i=0;i < available_positions.length;i++){
        position = available_positions[i]

        new_available_positions = available_positions.slice(0, available_positions.length)
        new_available_positions = removeArrayValue(new_available_positions, position)

        new_board = play(position, board.slice(0, board.length), localStateIndex)
        new_iteration = generator(new_board, new_available_positions, (localStateIndex + 1) % 2)
        board_evaluations.push(new_iteration[0])
    }

    // console.log(board_evaluations);
    // console.log(available_positions);
    fun = (states[localStateIndex] === "O") ? Math.max : Math.min
    return [fun(...board_evaluations), available_positions[getArrayValueIndex(board_evaluations, fun(...board_evaluations))]]

}


function checkFull(board=null){
    if(board === null) board = BOARD
    return countArrayValue(board, " ") === 0
}

function displayBoard(board=null){
    if(board === null) board = BOARD

    // console.log()
    // console.log(` ${board[0]} | ${board[1]} | ${board[2]}`)
    // console.log("--------")
    // console.log(` ${board[3]} | ${board[4]} | ${board[5]}`)
    // console.log("--------")
    // console.log(` ${board[6]} | ${board[7]} | ${board[8]}`)
    console.log()
    console.log(` ${board[0]} | ${board[1]}| ${board[2]}`)
    console.log("--------")
    console.log(` ${board[3]} | ${board[4]} | ${board[5]}`)
    console.log("--------")
    console.log(` ${board[6]} | ${board[7]} | ${board[8]}`)
}

function resetGame(){
    stateIndex = 0
    BOARD = [" ", " ", " ", " "," " ," "," "," "," "]
    for (var i = 0; i < 9; i++) {
        boxes[i].innerText = " ";
    }
}

function run_game(position){
    console.log(position)
    if(BOARD[position] !== " "){
        console.log("Position already occupuied!")
        return false
    }

    play(position)
    // console.log(BOARD)
    stateIndex = (stateIndex === 0) ? 1 : 0;
    
    displayBoard()
    win_status = checkWin2()

    if(win_status){
        message = `${states[(stateIndex + 1)%2]} won the game`
        return -1
    }

    if(checkFull()){
        message = "No winner! it was a Tie!"
        return -1
    }

    return true
}


helpInfo();