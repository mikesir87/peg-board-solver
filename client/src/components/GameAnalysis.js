import { useEffect, useState } from "react";
import MD5 from "crypto-js/md5";
import { useGameContext } from "./GameContext";
import AnalysisInfo from "./AnalysisInfo";

const GameAnalysis = () => {
  const { pegState, gameState } = useGameContext();
  const [analyzing, setAnalyzing] = useState(false);
  const [stateHash, setStateHash] = useState("");
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (gameState === "STARTING") return;
    setStateHash(MD5(JSON.stringify(pegState)).toString());
  }, [gameState, pegState]);

  useEffect(() => {
    if (!stateHash) return;
    setAnalyzing(true);
    fetch(`/api/boards/${stateHash}`)
      .then(r => r.json())
      .then(setAnalysis)
      .then(() => setAnalyzing(false));

  }, [stateHash, setAnalyzing, setAnalysis]);

  if (gameState === "STARTING") {
    return (
      <p>Waiting for the game to start before performing analysis</p>
    );
  }

  if (gameState === "COMPLETED") {
    return (
      <p>Game over! No more analysis needed!</p>
    );
  }

  if (analyzing) {
    return "Analyzing...";
  }

  return (
    <AnalysisInfo analysis={analysis} />
  )
};

export default GameAnalysis;