function getValidMoves(board, piece, position, enPassantTarget) {
    const pieceType = piece.toLowerCase();
    const isWhite = piece === piece.toUpperCase();

    switch (pieceType) {
        case 'p':
            return getPawnMoves(board, position, isWhite, enPassantTarget);
        case 'r':
            return getRookMoves(board, position, isWhite);
        case 'n':
            return getKnightMoves(board, position, isWhite);
        case 'b':
            return getBishopMoves(board, position, isWhite);
        case 'q':
            return getQueenMoves(board, position, isWhite);
        case 'k':
            return getKingMoves(board, position, isWhite);
        default:
            return [];
    }
}

function getPawnMoves(board, position, isWhite, enPassantTarget) {
    const moves = [];
    const [row, col] = position.split('').map(Number);
    const direction = isWhite ? -1 : 1;

    if (board[row + direction][col] === '') {
        moves.push(`${row + direction}${col}`);

        if ((isWhite && row === 6) || (!isWhite && row === 1)) {
            if (board[row + 2 * direction][col] === '') {
                moves.push(`${row + 2 * direction}${col}`);
            }
        }
    }

    if (col > 0 && board[row + direction][col - 1] !== '' && isOpponentPiece(board[row + direction][col - 1], isWhite)) {
        moves.push(`${row + direction}${col - 1}`);
    }
    if (col < 7 && board[row + direction][col + 1] !== '' && isOpponentPiece(board[row + direction][col + 1], isWhite)) {
        moves.push(`${row + direction}${col + 1}`);
    }
    if (enPassantTarget) {
        const enPassantRow = isWhite ? 3 : 4;
        if (row === enPassantRow) {
            if (Math.abs(col - enPassantTarget.col) === 1) {
                moves.push(`${row + direction}${enPassantTarget.col}`);
            }
        }
    }
    return moves;
}

function isOpponentPiece(piece, isWhite) {
    return (isWhite && piece.toLowerCase() === piece) || (!isWhite && piece.toUpperCase() === piece);
}

function getRookMoves(board, position, isWhite) {
    const moves = [];
    const [row, col] = position.split('').map(Number);

    const rookMoves = [
        [0, 1], [0, -1], [1, 0], [-1, 0]
    ];

    rookMoves.forEach(([dRow, dCol]) => {
        for (let i = 1; i < 8; i++) {
            const newRow = row + i * dRow;
            const newCol = col + i * dCol;
            if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) 
                break
            const targetPiece = board[newRow][newCol]
            if (targetPiece === '') {
                moves.push(`${newRow}${newCol}`)
            } else {
                if (isOpponentPiece(targetPiece, isWhite)) {
                    moves.push(`${newRow}${newCol}`)
                }
                break
            }
        }
    })
    return moves
}

function getKnightMoves(board, position, isWhite) {
    const moves = [];
    const [row, col] = position.split('').map(Number)
    const knightMoves = [
        [2, 1],[2, -1], [-2, 1], [-2, -1],[1, 2],[-1, 2],[1, -2],[-1, -2]
    ];

    knightMoves.forEach(([dRow, dCol]) => {
        const newRow = row + dRow;
        const newCol = col + dCol;
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const targetPiece = board[newRow][newCol];
            if (targetPiece === '' || isOpponentPiece(targetPiece, isWhite)) {
                moves.push(`${newRow}${newCol}`)
            }
        }
    })

    return moves;
}

function getBishopMoves(board, position, isWhite) {
    const moves = [];
    const [row, col] = position.split('').map(Number);

    const bishopMoves = [
        [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];

    bishopMoves.forEach(([dRow, dCol]) => {
        for (let i = 1; i < 8; i++) {
            const newRow = row + i * dRow;
            const newCol = col + i * dCol;
            if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) break;
            const targetPiece = board[newRow][newCol];
            if (targetPiece === '') {
                moves.push(`${newRow}${newCol}`);
            } else {
                if (isOpponentPiece(targetPiece, isWhite)) {
                    moves.push(`${newRow}${newCol}`);
                }
                break;
            }
        }
    });

    return moves;
}


function getQueenMoves(board, position , isWhite) {
   return [ ...getBishopMoves(board, position, isWhite),
            ...getRookMoves(board, position, isWhite)
   ]
    
}

function getKingMoves(board, position, isWhite) {
    const moves = []
    const [row, col] = position.split('').map(Number)

    const kingMoves = [
        [1, 0],[-1, 0],[0, 1],[0, -1],
        [1, 1],[1, -1],[-1, 1],[-1, -1]
    ]

    kingMoves.forEach(([drow, dcol]) => {
            const newRow = row + drow
            const newCol = col + dcol
            if (newRow >= 0 && newRow < 8 && newCol >=0 && newCol < 8) {
                const targetPiece = board[newRow][newCol]
                if (targetPiece === '' || isOpponentPiece(targetPiece, isWhite)) {
                    moves.push(`${newRow}${newCol}`)
                }
            }      
        })
    return moves
}