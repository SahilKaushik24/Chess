document.addEventListener('DOMContentLoaded', function() {
    const chessBoard = document.getElementById('chess-board');
    const topLabels = document.getElementById('top-labels');
    const leftLabels = document.getElementById('left-labels');

    const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const rows = ['8', '7', '6', '5', '4', '3', '2', '1'];

    columns.forEach(column => {
        const topLabel = document.createElement('div')
        topLabel.textContent = column;
        topLabels.appendChild(topLabel);
    });

    rows.forEach(row => {
        const leftLabel = document.createElement('div');
        leftLabel.textContent = row;
        leftLabels.appendChild(leftLabel);
    });


    let whiteTime = 10 * 60;
    let blackTime = 10 * 60;
    let whiteTimerInterval = null;
    let blackTimerInterval = null;
    let isWhiteTurn = true;

const whiteTimerElement = document.getElementById('white-timer');
const blackTimerElement = document.getElementById('black-timer');

function startWhiteTimer() {
    if (whiteTimerInterval) clearInterval(whiteTimerInterval);
    whiteTimerInterval = setInterval(() => {
        whiteTime--;
        updateTimerDisplay(whiteTimerElement, whiteTime);
        if (whiteTime <= 0) {
            clearInterval(whiteTimerInterval);
            alert('White player ran out of time. Black wins!');
        }
    }, 1000);
}

function startBlackTimer() {
    if (blackTimerInterval) clearInterval(blackTimerInterval);
    blackTimerInterval = setInterval(() => {
        blackTime--;
        updateTimerDisplay(blackTimerElement, blackTime);
        if (blackTime <= 0) {
            clearInterval(blackTimerInterval);
            alert('Black player ran out of time. White wins!');
        }
    }, 1000);
}

function stopTimers() {
    clearInterval(whiteTimerInterval);
    clearInterval(blackTimerInterval);
}

function updateTimerDisplay(element, time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    element.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

    startWhiteTimer();

    const initialBoard = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];

    window.board = JSON.parse(JSON.stringify(initialBoard));

    const pieceImages = {
        'r': 'cimg/blackrook.png',
        'n': 'cimg/blackknight.png',
        'b': 'cimg/blackbishop.png',
        'q': 'cimg/blackqueen.png',
        'k': 'cimg/blackking.png',
        'p': 'cimg/blackpawn.png',
        'P': 'cimg/whitepawn.png',
        'R': 'cimg/whiterook.png',
        'N': 'cimg/whiteknight.png',
        'B': 'cimg/whitebishop.png',
        'Q': 'cimg/whitequeen.png',
        'K': 'cimg/whiteking.png'
    };

    let enPassantTarget = null;
    let selectedPiece = null;
    let selectedPiecePosition = null;

    function handlePieceClick(event) {
        const piece = event.target;
        const pieceColor = piece.src.includes('white') ? 'white' : 'black';

        if ((isWhiteTurn && pieceColor === 'white') || (!isWhiteTurn && pieceColor === 'black')) {
            if (selectedPiece) {
                clearHighlights();
                selectedPiece = null;
                selectedPiecePosition = null;
            }
            selectedPiece = piece;
            selectedPiecePosition = piece.parentElement.getAttribute('data-square');
            highlightValidMoves();
        }
    }

    function highlightValidMoves() {
        clearHighlights();

        if (!selectedPiece) return;

        const [startRow, startCol] = selectedPiecePosition.split('').map(Number);
        const piece = window.board[startRow][startCol];
        const validMoves = getValidMoves(window.board, piece, selectedPiecePosition, enPassantTarget);

        validMoves.forEach(square => {
            const [row, col] = square.split('').map(Number);
            const targetSquare = document.querySelector(`[data-square="${row}${col}"]`);
            if (targetSquare) {
                targetSquare.classList.add('highlight');
                targetSquare.addEventListener('click', handleMoveClick);
            }
        });
    }

    function clearHighlights() {
        const highlightedSquares = document.querySelectorAll('.highlight');
        highlightedSquares.forEach(square => {
            square.classList.remove('highlight');
            square.removeEventListener('click', handleMoveClick);
        });
    }

    function handleMoveClick(event) {
        const targetSquare = event.target.getAttribute('data-square') || event.target.parentElement.getAttribute('data-square');
        const [startRow, startCol] = selectedPiecePosition.split('').map(Number);
        const [endRow, endCol] = targetSquare.split('').map(Number);
        const piece = window.board[startRow][startCol];
        const targetPiece = window.board[endRow][endCol];
    
        if (selectedPiecePosition !== targetSquare) {
            const validMoves = getValidMoves(window.board, piece, selectedPiecePosition, enPassantTarget);
    
            if (validMoves.includes(targetSquare)) {
                const newBoard = simulateMove(window.board, selectedPiecePosition, targetSquare);
                if (!isKingInCheck(newBoard, piece === piece.toUpperCase())) {
                    movePiece(selectedPiece, selectedPiecePosition, targetSquare);
    
                    if (piece.toLowerCase() === 'p' && Math.abs(startCol - endCol) === 1 && targetPiece === '') {
                        const captureRow = piece === piece.toUpperCase() ? endRow + 1 : endRow - 1;
                        window.board[captureRow][endCol] = '';
                        const captureElement = document.querySelector(`[data-square="${captureRow}${endCol}"] img`);
                        if (captureElement) captureElement.remove();
                    }
    
                    window.board[endRow][endCol] = piece;
                    window.board[startRow][startCol] = '';
    
                    if (piece.toLowerCase() === 'p' && Math.abs(startRow - endRow) === 2) {
                        enPassantTarget = { row: (startRow + endRow) / 2, col: startCol };
                    } else {
                        enPassantTarget = null;
                    }
    
                    isWhiteTurn = !isWhiteTurn;
    
                    stopTimers();
                    if (isWhiteTurn) {
                        startWhiteTimer();
                    } else {
                        startBlackTimer();
                    }
    
                    clearHighlights();
    
                    if (isKingInCheck(window.board, !isWhiteTurn)) {
                        console.log('Check!');
                        if (isCheckmate(window.board, !isWhiteTurn)) {
                            console.log('Checkmate!');
                        }
                    }
                } else {
                    console.log('Move puts king in check, invalid move.');
                }
            } else {
                console.log('Invalid move.');
            }
        }
    }
    
    function logMove(pieceSrc, fromSquare, toSquare) {
        
        const moveHistory = document.getElementById('move-history');
        const moveElement = document.createElement('p');
        const pieceName = pieceSrc.split('/').pop().split('.')[0];

        moveElement.textContent = `${pieceName.toUpperCase()} moved from ${fromSquare} to ${toSquare}`;
        moveHistory.appendChild(moveElement);
    }

    function movePiece(piece, fromSquare, toSquare) {
        moveHistory.push(JSON.parse(JSON.stringify(window.board)));
        redoStack = [];
    
        const pieceElement = document.createElement('img');
        pieceElement.src = piece.src;
        pieceElement.classList.add('piece');
        pieceElement.addEventListener('click', handlePieceClick);
    
        const targetElement = document.querySelector(`[data-square="${toSquare}"]`);
        targetElement.innerHTML = '';
        targetElement.appendChild(pieceElement);
    
        const fromElement = document.querySelector(`[data-square="${fromSquare}"]`);
        fromElement.innerHTML = '';
    }

    let moveHistory = []
    let redoStack = []

    function undoMove() {
        if (moveHistory.length > 0) {
            redoStack.push(JSON.parse(JSON.stringify(window.board)));
            const lastState = moveHistory.pop();
            window.board = lastState;
            updateBoard();
        }
    }
    
    function redoMove() {
        if (redoStack.length > 0) {
            moveHistory.push(JSON.parse(JSON.stringify(window.board)));
            const nextState = redoStack.pop();
            window.board = nextState;
            updateBoard();
        }
    }

    function updateBoard() {
        const chessBoard = document.getElementById('chess-board');
        chessBoard.innerHTML = '';
    
        for (let row = 0; row < 8; row++) {
            for (let column = 0; column < 8; column++) {
                const piece = window.board[row][column];
                const square = createSquare(row, column, piece);
                chessBoard.appendChild(square);
            }
        }
    }

    document.getElementById('undo-button').addEventListener('click', undoMove)
    document.getElementById('redo-button').addEventListener('click', redoMove)

    function createSquare(row, column, piece) {
        const square = document.createElement('div');
        square.classList.add('square');
        square.setAttribute('data-square', `${row}${column}`);
    
        if ((row + column) % 2 === 0) {
            square.classList.add('white');
        } else {
            square.classList.add('black');
        }
    
        if (piece) {
            const pieceElement = document.createElement('img');
            pieceElement.src = pieceImages[piece];
            pieceElement.classList.add('piece');
            pieceElement.addEventListener('click', handlePieceClick);
            square.appendChild(pieceElement);
        }
        return square;
    }    

    for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
            const piece = initialBoard[row][column];
            const square = createSquare(row, column, piece);
            chessBoard.appendChild(square);
        }
    }
});