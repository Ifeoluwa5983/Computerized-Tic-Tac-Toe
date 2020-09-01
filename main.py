
BOARD = [" "] * 4
states = ["X", "O"]
state_index = 0

def help_info():
    global BOARD
    BOARD = ["1", "2", "3", "4"]

    print("These are the board positions!")
    display_board()
    BOARD = [" "] * 4

def play(position, board=None, index=None):
    global BOARD, state_index
    if board is None:
        board = BOARD

    if index is None:
        index = state_index

    board[position] = states[index]
    return board

def evaluate_board(board, current_state):
    if check_win(board):
        if current_state == "O":
            return 1

        else:
            return -1

    if check_full(board):
        return 0
    

def generator(board, available_positions, local_state_index):
    global states

    if check_win(board) or check_full(board):
        # display_board(board)
        return evaluate_board(board, states[(local_state_index + 1) % 2]), None

    board_evaluations = []
    positions = []

    for position in available_positions:
        new_available_positions = available_positions.copy()
        new_available_positions.remove(position)

        new_board = play(position, board.copy(), local_state_index)
        new_iteration = generator(new_board, new_available_positions, (local_state_index + 1) % 2)
        board_evaluations.append(new_iteration[0])

    print(board_evaluations, available_positions)
    fun = max if states[local_state_index] == "O" else min
    return fun(board_evaluations), available_positions[board_evaluations.index(fun(board_evaluations))]

def check_win(board=None):
    if board is None:
        board = BOARD
    if board[0] == board[3] and board[0] != " ":
        return True

    elif board[1] == board[2] and board[1] != " ":
        return True

    else:
        return False

def check_full(board=None):
    if board is None:
        board = BOARD
    return board.count(" ") == 0

def display_board(board=None):
    if board is None:
        board = BOARD

    print()
    print(f" {board[0]} | {board[1]} ")
    print("--------")
    print(f" {board[2]} | {board[3]} ")

def run_game():
    global BOARD, states, state_index

    while True:
        if states[state_index] == "O":
            max_value, position = generator(BOARD, [i for i, v in enumerate(BOARD) if v == " "], state_index)

        else:
            position = input("Type your position [1-4]: ")
            try:
                position = int(position) - 1

                if position > 3 or position < 0:
                    print("bad position!")
                    raise

            except Exception as e:
                print(e)
                continue
        
        if BOARD[position] != " ":
            print("Position already occupuied!")
            continue

        play(position)

        state_index = (state_index + 1) % 2
        
        display_board()

        win_status = check_win()

        if win_status:
            print(f"{states[(state_index + 1)%2]} won the game")
            break
            
        if check_full():
            print("No winner! it was a Tie!")
            break

    else:
        print("No winner! it was a Tie!")



def main():
    help_info()
    run_game()

    # print(generator(BOARD))

if __name__ == '__main__':
    main()
