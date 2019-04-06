import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'



    //Now the game state and squares state are stored in boards state and shared 
    //with the square state. hence it does not require a state. hence, function 
    //components

    
function Square(props){
    return (
        <button className="square" 
            onClick = { props.onClick } >
        { props.value }
        </button>
    );
}


//the square component is now a controlled component. since board has full control 
//over them. React terms. Duh!!

// in react the convention is to use on[EVENT] to handle props that resolve events
// and handle[EVENT] for the methods which handle the event.



class Board extends React.Component {

  renderSquare(i) {
    return (

        //if not put in a function the onclick will fire every time the button renders
        //hence put it in a function 

        <Square value={this.props.squares[i]}
                onClick = { ()=> this.props.onClick(i) }
            />
        )
    }

  render() {    
    
    return (
      <div>
        <div className="status">{}</div>
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

    constructor(props){
        super(props)
        
        this.state = {
            history : [{
                squares : Array(9).fill(null),
            }],
            stepNumber : 0,
            xIsNext : true,
        }
    }

    handleClick(i) {

        //do not mutate states directly. Hence, not using this.state.squares[i]='X'
        const history = this.state.history.slice(0, this.state.stepNumber +1)
        const current = history[history.length -1]
        const squares = current.squares.slice()

        if(calculateWinner(squares) || squares[i]){
            return
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O'
        this.setState({
            history : history.concat([{
                squares : squares
            }]),
            stepNumber : history.length,
            xIsNext : !this.state.xIsNext,
            
        })
    }

    jumpTo (step) {
        this.setState({
            stepNumber : step,
            xIsNext : (step%2) === 0,
        })
    }

    render() {

        const history = this.state.history
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current.squares)

        let status;
        if(winner) {
            status = "Winner:" + winner
        } else {
            status = "Next player: "+(this.state.xIsNext? 'X' : 'O')
        }

        const moves = history.map((step, move) => {
            
            const display = move ? 'Go to move #'+ move : 'Go to game start ' 
            return (
                <li key={ move }>
                    <button onClick = {() => this.jumpTo(move)}>
                        {display}
                    </button>
                </li>
            )
        })

        return (
        <div className="game">
            <div className="game-board">

                <Board squares = {current.squares}
                    onClick = {(i)=> this.handleClick(i)}    
                />

            </div>
            <div className="game-info">
                <div>{ status }</div>
                <ol>{ moves }</ol>
            </div>
        </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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