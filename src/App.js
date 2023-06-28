import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares, i);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  /*
   * 3 개선사항
   * - 사각형들을 만들 때 하드코딩 대신에 두 개의 반복문을 사용하도록 Board를 다시 작성해주세요.
   */
  const boardRow = [];
  for (let i = 0; i < Math.sqrt(squares.length); i++) {
    const boardCol = [];
    for (let j = 0; j < Math.sqrt(squares.length); j++) {
      boardCol.push(
        <Square
          value={squares[i * Math.sqrt(squares.length) + j]}
          onSquareClick={() => handleClick(i * Math.sqrt(squares.length) + j)}
          key={"col-" + j}
        />
      );
    }
    boardRow.push(
      <div className="board-row" key={`row-${i}`}>
        {boardCol}
      </div>
    );
  }
  return (
    <>
      <div className="status">{status}</div>
      {boardRow}
    </>
  );
}

export default function Game() {
  const [inputs, setInputs] = useState({
    square: [Array(9).fill(null)],
    index: [0],
    currentMove: 0,
    isDisplayOrderByAsc: true,
  });

  const { square, index, currentMove, isDisplayOrderByAsc } = inputs;

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = square[currentMove];

  function handlePlay(nextSquares, i) {
    const nextHistory = [...square.slice(0, currentMove + 1), nextSquares];
    setInputs({
      ...inputs,
      square: nextHistory,
      index: [...index, i],
      currentMove: nextHistory.length - 1,
    });
  }

  function jumpTo(nextMove) {
    setInputs({
      ...inputs,
      currentMove: nextMove,
    });
  }

  /*
   * 4 개선사항
   * - 오름차순이나 내림차순으로 이동을 정렬하도록 토글 버튼을 추가해주세요.
   */
  function toggleMoves() {
    setInputs({
      ...inputs,
      square: square.reverse(),
      index: index.reverse(),
      isDisplayOrderByAsc: !isDisplayOrderByAsc,
    });
  }

  /*
   * 1 개선사항
   * - 이동 기록 목록에서 특정 형식(행, 열)으로 각 이동의 위치를 표시해주세요.
   */
  const moves = square.map((squares, move) => {
    let description;
    if (isDisplayOrderByAsc) {
      if (move > 0) {
        description =
          "Go to move (" +
          (Math.floor(index[move] / 3) + 1) +
          ", " +
          ((index[move] % 3) + 1) +
          ")";
      } else {
        description = "Go to game start";
      }
    } else {
      if (move < square.length - 1) {
        description =
          "Go to move (" +
          (Math.floor(index[move] / 3) + 1) +
          ", " +
          ((index[move] % 3) + 1) +
          ")";
      } else {
        description = "Go to game start";
      }
    }
    return (
      /*
       * 2 개선사항
       * - 이동 목록에서 현재 선택된 아이템을 굵게 표시해주세요.
       */
      <li key={move}>
        <button
          onClick={() => jumpTo(move)}
          style={{ fontWeight: currentMove === move ? "bold" : "normal" }}
        >
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <button onClick={toggleMoves}>
        {isDisplayOrderByAsc ? "오름차순 ▲" : "내림차순 ▼"}
      </button>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
