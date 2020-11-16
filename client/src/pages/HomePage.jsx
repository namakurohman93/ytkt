import { useState } from "react"
import Nav from "react-bootstrap/Nav"

export default function HomePage() {
  const [ eventKey, setEventKey ] = useState("home")

  return (
    <>
      <Nav
        variant="tabs"
        className="justify-content-center mt-2"
        activeKey={eventKey}
        onSelect={value => setEventKey(value)}
      >
        <Nav.Item>
          <Nav.Link eventKey="home">
            ytkt
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="inactive-players">
            Inactive Players
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="find-animals">
            Find Animals
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="find-cropper">
            Find Cropper
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="attack-schedule">
            Attack Schedule
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {
        eventKey === "home" && <p className="mt-5">Home Content</p>
      }
      {
        eventKey === "inactive-players" && <p className="mt-5">Inactive Player Content</p>
      }
      {
        eventKey === "find-animals" && <p className="mt-5">Find Animals Content</p>
      }
      {
        eventKey === "find-cropper" && <p className="mt-5">Find Cropper Content</p>
      }
      {
        eventKey === "attack-schedule" && <p className="mt-5">Attack Schedule Content</p>
      }
    </>
  )
}
