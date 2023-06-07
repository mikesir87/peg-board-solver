import './App.scss';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import GameActions from './components/GameActions';
import GameBoard from './components/GameBoard';
import { GameContextProvider } from './components/GameContext';
import GameAnalysis from './components/GameAnalysis';

function App() {
  return (
    <div className="App mt-5">
      <GameContextProvider>
        <Container>
          <Row>
            <Col lg={6}>
              <GameBoard />
            </Col>
            <Col lg={6}>
              <GameActions />
              <hr />
              <GameAnalysis />
            </Col>
          </Row>
        </Container>
      </GameContextProvider>
    </div>
  );
}

export default App;
