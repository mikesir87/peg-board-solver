import { useMemo } from "react";
import Button from "react-bootstrap/Button";
import { useGameContext } from "./GameContext"

const GameActions = () => {
  const { gameState, pegState, startGame, clearSelection } = useGameContext();

  const hasEmptySlots = useMemo(() => {
    return pegState.filter(e => !e).length > 0;
  }, [pegState]);

  if (gameState === "STARTING") {
    return (
      <>
        <p>Pick your starting board!</p>
        <Button onClick={startGame} disabled={!hasEmptySlots}>Start Game!</Button>
      </>
    );
  }

  if (gameState === "FIRST_SELECTION") {
    return (
      <>
        <p>Choose a piece to move.</p>
      </>
    )
  }

  if (gameState === "SECOND_SELECTION") {
    return (
      <>
        <p>Choose where to move the spot.</p>
        <Button onClick={clearSelection}>Cancel Selection</Button>
      </>
    )
  }

  if (gameState === "COMPLETED") {
    return (
      <>
        <p>Game completed!</p>
      </>
    )
  }

  return null;
}

export default GameActions;