import Container from "react-bootstrap/Container"
import Jumbotron from "react-bootstrap/Jumbotron"
import Badge from "react-bootstrap/Badge"
import "./home.style.css"

export default function Home(props) {
  const { setEventKey } = props

  return (
    <Container>
      <Jumbotron fluid className="p-5 bg-transparent">
        <h1 className="text-info">Your Travian: Kingdom Tool</h1>
        <h4 className="ml-2 font-weight-lighter text-muted">Doing stuff using your session</h4>

        <div className="mt-5">
          <h2 className="text-info">Features</h2>
          <ul style={{ listStyle: ">> " }}>
            <li>
              <a
                href="#"
                className="text-decoration-none"
                onClick={() => setEventKey("inactive-players")}
              >
                <span className="font-weight-light text-muted">Inactive Players </span>
                <Badge pill variant="info">Incoming</Badge>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-decoration-none"
                onClick={() => setEventKey("find-animals")}
              >
                <span className="font-weight-light text-muted">Find Animals </span>
                <Badge pill variant="info">Incoming</Badge>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-decoration-none"
                onClick={() => setEventKey("find-cropper")}
              >
                <span className="font-weight-light text-muted">Find Cropper </span>
                <Badge pill variant="info">Incoming</Badge>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-decoration-none"
                onClick={() => setEventKey("attack-schedule")}
              >
                <span className="font-weight-light text-muted">Attack Schedule </span>
                <Badge pill variant="info">Incoming</Badge>
              </a>
            </li>
          </ul>
        </div>
      </Jumbotron>
    </Container>
  )
}