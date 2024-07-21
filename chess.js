document.addEventListener('DOMContentLoaded', function() {
    const chessBoard = document.getElementById('chess-board');
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
    let isWhiteTurn = true;
    let enPassantTarget = null;
    let selectedPiece = null;
    let selectedPiecePosition = null;

    function handlePieceClick(event) {
        const piece = event.target;
        const pieceColor = piece.src.includes('white') ? 'white' : 'black';

        if ((isWhiteTurn && pieceColor === 'white') || (!isWhiteTurn && pieceColor === 'black')) {
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
            }
        });
    }

    function clearHighlights() {
        const highlightedSquares = document.querySelectorAll('.highlight');
        highlightedSquares.forEach(square => {
            square.classList.remove('highlight');
        });
    }

    function handleDragStart(event) {
        const piece = event.target;
        const pieceColor = piece.src.includes('white') ? 'white' : 'black';

        if ((isWhiteTurn && pieceColor === 'white') || (!isWhiteTurn && pieceColor === 'black')) {
            event.dataTransfer.setData('text/plain', event.target.src);
            event.dataTransfer.setData('parent', event.target.parentElement.getAttribute('data-square'));
            event.target.style.opacity = '0.4';
        } else {
            event.preventDefault();
        }
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnd(event) {
        event.target.style.opacity = '';
        clearHighlights();
    }

    function handleDrop(event) {
        event.preventDefault();

        const imgSrc = event.dataTransfer.getData('text/plain');
        const parentSquare = event.dataTransfer.getData('parent');
        const targetSquare = event.target.getAttribute('data-square') || event.target.parentElement.getAttribute('data-square');
        const [startRow, startCol] = parentSquare.split('').map(Number);
        const [endRow, endCol] = targetSquare.split('').map(Number);
        const piece = window.board[startRow][startCol];
        const targetPiece = window.board[endRow][endCol];

        if (parentSquare !== targetSquare) {
            const validMoves = getValidMoves(window.board, piece, parentSquare, enPassantTarget);

            if (validMoves.includes(targetSquare)) {
                const pieceElement = document.createElement('img');
                pieceElement.src = imgSrc;
                pieceElement.classList.add('piece');
                pieceElement.setAttribute('draggable', 'true');
                pieceElement.addEventListener('dragstart', handleDragStart);
                pieceElement.addEventListener('click', handlePieceClick);
                pieceElement.addEventListener('dragend', handleDragEnd);

                const targetElement = event.target.getAttribute('data-square') ? event.target : event.target.parentElement;
                targetElement.innerHTML = '';
                targetElement.appendChild(pieceElement);

                const parentElement = document.querySelector(`[data-square="${parentSquare}"]`);
                parentElement.innerHTML = '';

                if (piece.toLowerCase() === 'p' && endCol !== startCol && targetPiece === '') {
                    const captureRow = isWhiteTurn ? endRow + 1 : endRow - 1;
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
                clearHighlights();
            }
        }
    }

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
            pieceElement.setAttribute('draggable', 'true');
            pieceElement.addEventListener('dragstart', handleDragStart);
            pieceElement.addEventListener('click', handlePieceClick);
            pieceElement.addEventListener('dragend', handleDragEnd);
            square.appendChild(pieceElement);
        }

        square.addEventListener('dragover', handleDragOver);
        square.addEventListener('drop', handleDrop);
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