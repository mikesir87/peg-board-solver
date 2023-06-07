import * as React from "react";

const GameContext = React.createContext(null);

/*
 * Game states:
 * - STARTING - have to pick the initial game layout
 * - FIRST_SELECTION - choose which piece will be moving/jumping
 * - SECOND_SELECTION - choose which spot it will move to/land
 * - COMPLETED - no valid moves remain
 */

const VALID_MOVES = [  // [ Jump over, land in ]
  /* 00 */ [ [1, 3], [2, 5] ],
  /* 01 */ [ [4, 8], [3, 6] ],
  /* 02 */ [ [4, 7], [5, 9] ],
  /* 03 */ [ [1, 0], [6, 10], [7, 12], [4, 5] ],
  /* 04 */ [ [7, 11], [8, 13] ],
  /* 05 */ [ [2, 0], [9, 14], [8, 12], [4, 3] ],
  /* 06 */ [ [3, 1], [7, 8] ],
  /* 07 */ [ [4, 2], [8, 9] ],
  /* 08 */ [ [4, 1], [7, 6] ],
  /* 09 */ [ [5, 2], [8, 7] ],
  /* 10 */ [ [6, 3], [11, 12] ],
  /* 11 */ [ [7, 4], [12, 13] ],
  /* 12 */ [ [7, 3], [8, 5], [13, 14], [11, 10] ],
  /* 13 */ [ [8, 4], [12, 11] ],
  /* 14 */ [ [9, 5], [13, 12] ],
];

export const GameContextProvider = ({ children }) => {
  const [gameState, setGameState] = React.useState("STARTING");
  const [pegState, setPegState] = React.useState(Array(15).fill(true));
  const [movingPiece, setMovingPiece] = React.useState(null);

  const startGame = React.useCallback(() => {
    setGameState("FIRST_SELECTION");
  }, [setGameState]);

  const clearSelection = React.useCallback(() => {
    setMovingPiece(null);
    setGameState("FIRST_SELECTION");
  }, [setMovingPiece, setGameState]);

  const makeSelection = React.useCallback((slot) => {
    console.log("SLOT", slot, gameState);
    if (gameState === "STARTING") {
      const newPegState = [...pegState];
      newPegState[slot] = !newPegState[slot];
      return setPegState(newPegState);
    }
    else if (gameState === "FIRST_SELECTION") {
      if (!pegState[slot])
        return alert("Invalid selection. That slot is currently empty and can't be selected.");
      else {
        setMovingPiece(slot);
        setGameState("SECOND_SELECTION");
      }
    }
    else if (gameState === "SECOND_SELECTION") {
      if (pegState[slot])
        return alert("Invalid selection. Another peg is in that slot right now");
      const move = VALID_MOVES[movingPiece].find(m => m[1] === slot);
      if (!move)
        return alert("Invalid move");
      if (!pegState[move[0]])
        return alert("Invalid move. There is an empty peg where one should be jumping");
      
      const newPegState = [...pegState];
      newPegState[movingPiece] = false;
      newPegState[move[0]] = false;
      newPegState[move[1]] = true;
      setPegState(newPegState);
      setGameState("FIRST_SELECTION");
      setMovingPiece(null);
    }
  }, [gameState, pegState, movingPiece]);

  React.useEffect(() => {
    if (gameState === "STARTING") return;

    for (let i = 0; i < VALID_MOVES.length; i++) {
      if (!pegState[i]) continue;

      for (let j = 0; j < VALID_MOVES[i].length; j++) {
        if (pegState[VALID_MOVES[i][j][0]] && !pegState[VALID_MOVES[i][j][1]])
          return true;
      }
    }

    setGameState("COMPLETED");
  }, [gameState, pegState]);

  return (
    <GameContext.Provider value={{ gameState, startGame, pegState, makeSelection, clearSelection, movingPiece }}>
      { children }
    </GameContext.Provider>
  )
};


export const useGameContext = () => {
  return React.useContext(GameContext);
}