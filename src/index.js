import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';

function Square(props) {
  return (
    <button id={props.winCol} className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return <Square value={this.props.squares[i]}
      winCol={this.props.winCol[i]}
      onClick={() => this.props.onClick(i)}
    />
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
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

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        i: null,
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{
        squares: squares,
        i: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  handleChange() {
    const list = document.querySelector('.game-info ol');
    if (list.style.flexDirection === 'column-reverse') {
      list.style.flexDirection = 'column';
    } else {
      list.style.flexDirection = 'column-reverse';
    }
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const winCol = Array(9).fill(null);
    const moves = history.map((step, move) => {
      let desc = '';
      let col, row;
      if (step.i === null) {
        desc = 'К началу игры';
      } else {
        col = step.i % 3 + 1;
        row = parseInt(step.i / 3) + 1;
        desc = 'Перейти к ходу ' + move + ' ' + step.squares[step.i] + ' колонка ' + col + ' ряд ' + row;
      }
      return (
        <li key={move}>
          <Button variant="outlined"
            onClick={() => this.jumpTo(move)}>{desc}</Button>
        </li>
      );
    });

    let status;


    console.log(history.length)
    if (winner) {
      status = 'Выиграл ' + winner;
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
        if (current.squares[a] && current.squares[a] === current.squares[b] && current.squares[a] === current.squares[c]) {
          winCol[a] = 'win';
          winCol[b] = 'win';
          winCol[c] = 'win';
        }
      }

    } else {
      if (history.length === 10) {
        status = 'Ничья';
      } else {
        status = 'Следующий ход: ' + (this.state.xIsNext ? 'X' : 'O');
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winCol={winCol}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div><Switch
            onChange={() => this.handleChange()}
          />По убыванию</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
