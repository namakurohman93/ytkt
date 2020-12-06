import { useState, useEffect } from "react"
import Nav from "react-bootstrap/Nav"
import Home from "../contents/home"
import SearchPlayer from "../contents/search-player"
import SearchKingdom from "../contents/search-kingdom"
import SearchInactive from "../contents/search-inactive"
import FindAnimals from "../contents/find-animals"
import FindCropper from "../contents/find-cropper"
import ScheduleAttack from "../contents/schedule-attack"
import httpClient from "../utilities/http-client"

export default function HomePage() {
  const [eventKey, setEventKey] = useState("home")
  const [accountDetail, setAccountDetail] = useState({
    villages: null,
    tribeId: null
  })

  useEffect(() => {
    httpClient
      .get(`/api/own-villages`)
      .then(({ data }) =>
        setAccountDetail({
          villages: data,
          tribeId: data[0].tribeId
        })
      )
      .catch(err => console.log(err))
  }, [])

  return (
    <>
      <Nav
        variant="tabs"
        className="justify-content-center mt-2"
        activeKey={eventKey}
        onSelect={value => setEventKey(value)}
      >
        <Nav.Item>
          <Nav.Link eventKey="home">ytkt</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="search">Search Player</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="search-kingdom">Search Kingdom</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="search-inactive">Search Inactive</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="find-animals">Find Animals</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="find-cropper">Find Cropper</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="attack-schedule">Attack Schedule</Nav.Link>
        </Nav.Item>
      </Nav>

      {eventKey === "home" && (
        <Home setEventKey={value => setEventKey(value)} />
      )}
      {eventKey === "search" && <SearchPlayer />}
      {eventKey === "search-kingdom" && <SearchKingdom />}
      {eventKey === "search-inactive" && <SearchInactive />}
      {eventKey === "find-animals" && <FindAnimals />}
      {eventKey === "find-cropper" && <FindCropper />}
      {eventKey === "attack-schedule" && (
        <ScheduleAttack accountDetail={accountDetail} />
      )}
    </>
  )
}
