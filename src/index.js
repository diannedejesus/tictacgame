import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
        <button className={props.highlight + "square"}  onClick={props.onClick}>
            {props.value}
        </button>
    );
  }
  
class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square 
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            highlight={this.props.winners.includes(i) ? 'highlight ' : ''}
        />
      );
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
  
  class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            isAscend: false,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if(calculateWinner(squares)) {
            return;
        }

        if(squares[i] && current['squares'].includes(null)) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
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

    toggleAscend() {
        this.setState({
            isAscend: !this.state.isAscend,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                `Go to move #${move} - ${findPlacement(history[move-1], step)}` : //step['squares']
                'Go to game start';
            return (
                <li key={move}>
                    <button className={move === this.state.stepNumber ? 'highlight' : ''} onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        
        if(winner){
            status = 'Winner: ' + current.squares[winner[0]];
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
                squares={current.squares}
                winners={winner ? winner : []}
                onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <div><button onClick={() => this.toggleAscend()}>{this.state.isAscend ? "Ascend": "Descend"}</button></div>
            <ol>{this.state.isAscend ? moves.slice(0).reverse() : moves }</ol>
          </div>
        </div>
      );
    }
  }

  
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  
  
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
        return lines[i];
      }
    }

    return null;
  }

  function findPlacement(history, current){
    console.log(history, current)

        let place;
        let row;
        let col;

        current['squares'].forEach((turn, index) => {
            return history['squares'][index] !== turn ? place = index : '';
        });

        if(place < 3){
            row = 1;
        } else if(place > 5){
            row = 3;
        } else {
            row = 2;
        }


        if(place % 3 === 1){
            col = 2;
        } else if(place % 3 === 2){
            col = 3;
        } else {
            col = 1;
        }

        return([row, col]);
    }