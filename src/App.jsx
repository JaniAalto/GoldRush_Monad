import { useState } from 'react'

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}

const App = () => {
  const [gameState, setGameState] = useState('')
  const [angle, setAngle] = useState(0);
  const playerId = "66289bcf-4019-49b9-b392-e0235a4ad3d5"
  const gameId = "01HPJEYPDY5WM51N48MJTFVRTG"
  
  const socket = new WebSocket(`wss://goldrush.monad.fi/backend/${playerId}`)
  
  const rotateCmd = () => {
    const rotate = {
      "action": "rotate",
      "rotation": parseInt(angle)
    }
    const command = [
      "run-command", {
        "gameId": gameId,
        "payload": rotate
      }
    ]
  
    socket.send(JSON.stringify(command))
  }
  
  const moveCmd = () => {
    const move = { "action": "move" }
    const command = [
      "run-command", {
        "gameId": gameId,
        "payload": move
      }
    ]
  
    socket.send(JSON.stringify(command))
  }
  
  const resetCmd = () => {
    const reset = { "action": "reset" }
    const command = [
      "run-command", {
        "gameId": gameId,
        "payload": reset
      }
    ]
  
    socket.send(JSON.stringify(command))
  }
  
  const subscribeCmd = () => {
    const subscribe = ["sub-game", { "id": gameId }]
    socket.send(JSON.stringify(subscribe))
  }
  
  socket.onopen = function (e) {
    console.log("[Connection established]")
    subscribeCmd()
  };

  socket.onmessage = function (event) {
    console.log(`[Message from server]: ${event.data}`)
    const response = JSON.parse(event.data)
    setGameState(JSON.stringify(response[1]))
    return false;
  };

  socket.onclose = function (event) {
    if (event.wasClean) {
      console.log(`Connection closed cleanly, code=${event.code} reason=${event.reason}`)
    } else {
      console.log('Connection died')
    }
  };

  socket.onerror = function (error) {
    console.log(`[Error]: ${error.error}`)
  };

  let gameStateObj = {}
  if (gameState)
    gameStateObj = JSON.parse(gameState)


  return (
    <div>
      {Object.entries(gameStateObj).map(el => <div>{el[0]}: {el[1]}</div>)}
      <br></br>

      <div><Button
        handleClick={rotateCmd}
        text='Rotate'
      />
      <select value={angle} onChange={e => setAngle(e.target.value)} >
        <option value="0">North</option>
        <option value="45">Northeast</option>
        <option value="90">East</option>
        <option value="135">Southeast</option>
        <option value="180">South</option>
        <option value="225">Southwest</option>
        <option value="270">West</option>
        <option value="315">Northwest</option>
      </select></div>

      <div><Button
        handleClick={moveCmd}
        text='Move'
      /></div>
      <div><Button
        handleClick={resetCmd}
        text='Reset'
      /></div>
      <div><Button
        handleClick={subscribeCmd}
        text='Subscribe'
      /></div>
    </div>
  )
}

export default App