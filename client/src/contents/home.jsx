import Container from "react-bootstrap/Container"
import Jumbotron from "react-bootstrap/Jumbotron"
import Badge from "react-bootstrap/Badge"

export default function Home(props) {
  const { setEventKey } = props

  return (
    <Container>
      <Jumbotron fluid className="p-5 bg-transparent">
        <h1 className="text-info">Your Travian: Kingdom Tool</h1>
        <h4 className="ml-2 font-weight-lighter text-muted">
          Doing stuff using your session
        </h4>

        <div className="mt-5">
          <h2 className="text-info">Features</h2>
          <ul>
            <li>
              <span
                role="button"
                className="font-weight-light text-muted"
                onClick={() => setEventKey("search")}
              >
                Player Evolution{" "}
                <Badge pill variant="warning">
                  Beta
                </Badge>
              </span>
            </li>
            <li>
              <span
                role="button"
                className="font-weight-light text-muted"
                onClick={() => setEventKey("find-animals")}
              >
                Find Animals{" "}
                <Badge pill variant="warning">
                  Beta
                </Badge>
              </span>
            </li>
            <li>
              <span
                role="button"
                className="font-weight-light text-muted"
                onClick={() => setEventKey("find-cropper")}
              >
                Find Cropper{" "}
                <Badge pill variant="warning">
                  Beta
                </Badge>
              </span>
            </li>
            <li>
              <span
                role="button"
                className="font-weight-light text-muted"
                onClick={() => setEventKey("attack-schedule")}
              >
                Attack Schedule{" "}
                <Badge pill variant="warning">
                  Beta
                </Badge>
              </span>
            </li>
          </ul>
        </div>
      </Jumbotron>
    </Container>
  )
}
