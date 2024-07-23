function isKingInCheck(board, isWhite) {
    const kingPosition = findKingPosition(board, isWhite)
    return isSquareUnderAttack(board, kingPosition, isWhite)
}

function findKingPosition(board, isWhite) {
    const king = isWhite ? K : k
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col] === king) {
                return `${row}${col}`
            }
            
        }
        
    }
    return null
}

function isSquareUnderAttack(board, isWhite) {
    const opponentMoves = []
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (piece !== '' && isOpponentPiece(piece, isWhite)) {
                const position = `${row}${col}`
                const moves = getValidMoves(board, piece, position, null)
                opponentMoves.push(...moves)
            }
            
        }

    }
    return opponentMoves
}

function isOpponentPiece(piece, isWhite) {
    return isWhite ? piece === piece.toLowerCase() : piece === piece.toUpperCase()
}

function isCheckMate(board, isWhite) {
    if(!isKingInCheck(board, isWhite)) return false
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col]
            if(piece !== "" && (isWhite ? piece === piece.toUpperCase() : piece === piece.toLowerCase())){
                const position = `${row}${col}`
                const moves = getValidMoves(board, piece, position, null)
                for(const move of moves) {
                    const [newRow, newCol] = move.split('').maop(Number)
                    const tempBoard = JSON.parse(JSON.stringify(board))
                    tempBoard[newRow][newCol] = piece
                    tempBoard[row][col] = ''
                    if(!isKingInCheck(tempBoard, isWhite)){
                        return false
                    }
                }
            }
        }
    }
    return true
}