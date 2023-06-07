import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import BoardSpot from "./BoardSpot";

const GameBoard = () => {
  return (
    <Container fluid>
      <Row>
        <Col></Col>
        <Col></Col>
        <Col></Col>
        <Col className="text-center">
          <BoardSpot spot={0} />
        </Col>
        <Col></Col>
        <Col></Col>
        <Col></Col>
      </Row>
      <Row>
        <Col></Col>
        <Col></Col>
        <Col className="text-center">
          <BoardSpot spot={1} />
        </Col>
        <Col className="text-center">
          <BoardSpot spot={2} />
        </Col>
        <Col></Col>
        <Col></Col>
      </Row>
      <Row>
        <Col></Col>
        <Col></Col>
        <Col className="text-center">
          <BoardSpot spot={3} />
        </Col>
        <Col className="text-center">
          <BoardSpot spot={4} />
        </Col>
        <Col className="text-center">
          <BoardSpot spot={5} />
        </Col>
        <Col></Col>
        <Col></Col>
      </Row>
      <Row>
        <Col></Col>
        <Col className="text-center">
          <BoardSpot spot={6} />
        </Col>
        <Col className="text-center">
          <BoardSpot spot={7} />
        </Col>
        <Col className="text-center">
          <BoardSpot spot={8} />
        </Col>
        <Col className="text-center">
          <BoardSpot spot={9} />
        </Col>
        <Col></Col>
      </Row>
      <Row>
        <Col></Col>
        <Col className="text-center">
          <BoardSpot spot={10} />
        </Col>
        <Col className="text-center">
          <BoardSpot spot={11} />
        </Col>
        <Col className="text-center">
          <BoardSpot spot={12} />
        </Col>
        <Col className="text-center">
          <BoardSpot spot={13} />
        </Col>
        <Col className="text-center">
          <BoardSpot spot={14} />
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
};

export default GameBoard;