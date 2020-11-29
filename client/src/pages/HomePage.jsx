import { useState } from "react"
import Nav from "react-bootstrap/Nav"
import Home from "../contents/home"
import SearchPlayer from "../contents/search-player"
import SearchKingdom from "../contents/search-kingdom"
import SearchInactive from "../contents/search-inactive"
import FindAnimals from "../contents/find-animals"

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
          <Nav.Link eventKey="search">
            Search Player
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="search-kingdom">
            Search Kingdom
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="search-inactive">
            Search Inactive
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
        eventKey === "home" && <Home setEventKey={value => setEventKey(value)}/>
      }
      {
        eventKey === "search" && <SearchPlayer />
      }
      {
        eventKey === "search-kingdom" && <SearchKingdom />
      }
      {
        eventKey === "search-inactive" && <SearchInactive />
      }
      {
        eventKey === "find-animals" && <FindAnimals />
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
