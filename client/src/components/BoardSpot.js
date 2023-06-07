import { useGameContext } from "./GameContext";

const BoardSpot = ({ spot }) => {
  const { pegState, makeSelection, movingPiece } = useGameContext();
  const enabled = pegState[spot];

  return (
    <div className={`m-3 ${enabled ? 'text-success ' : ''} ${movingPiece === spot ? 'text-warning' : ''}`}>
      <div className="peg" onClick={() => makeSelection(spot)}>
        { enabled ? "\u2B24" : "\u25EF"}
        <br />{ spot }
      </div>
    </div>
  );
};

export default BoardSpot;