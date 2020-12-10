import { useState, useEffect } from "react"
import Nav from "react-bootstrap/Nav"
import Badge from "react-bootstrap/Badge"
import Home from "../contents/home"
import SearchPlayer from "../contents/search-player"
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
          <Nav.Link eventKey="home">
            ytkt{" "}
            <Badge pill variant="warning">
              Beta
            </Badge>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="search">Player Evolution</Nav.Link>
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
      {eventKey === "find-animals" && <FindAnimals />}
      {eventKey === "find-cropper" && <FindCropper />}
      {eventKey === "attack-schedule" && (
        <ScheduleAttack accountDetail={accountDetail} />
      )}
    </>
  )
}
