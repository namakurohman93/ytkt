import { useState, useEffect } from "react"
import Nav from "react-bootstrap/Nav"
import Badge from "react-bootstrap/Badge"
import Home from "../contents/home"
import SearchPlayer from "../contents/search-player"
import FindAnimals from "../contents/find-animals"
import FindCropper from "../contents/find-cropper"
import ScheduleAttack from "../contents/schedule-attack"
import FarmlistSender from "../contents/farmlist-sender"
import CustomSpinner from "../components/custom-spinner"
import httpClient from "../utilities/http-client"

export default function HomePage() {
  const [eventKey, setEventKey] = useState("home")
  const [accountDetail, setAccountDetail] = useState({
    villages: null,
    tribeId: null,
    farmlist: null
  })

  useEffect(() => {
    httpClient
      .get(`/api/farmlist-village`)
      .then(({ data }) =>
        setAccountDetail({
          villages: data.villages,
          tribeId: data.villages[0].tribeId,
          farmlist: data.farmlist
        })
      )
      .catch(err => {
        console.log(err)
        setAccountDetail({ villages: [], tribeId: 0, farmlist: [] })
      })
  }, [])

  if (accountDetail.villages === null) return <CustomSpinner message="Fetching data..." />

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
        <Nav.Item>
          <Nav.Link eventKey="farmer">Farmlist Sender</Nav.Link>
        </Nav.Item>
      </Nav>

      {eventKey === "home" && (
        <Home setEventKey={value => setEventKey(value)} />
      )}
      {eventKey === "search" && <SearchPlayer />}
      {eventKey === "find-animals" && <FindAnimals />}
      {eventKey === "find-cropper" && <FindCropper />}
      {eventKey === "attack-schedule" && (
        <ScheduleAttack
          villages={accountDetail.villages}
          tribeId={accountDetail.tribeId}
        />
      )}
      {eventKey === "farmer" && (
        <FarmlistSender
          villages={accountDetail.villages}
          farmlist={accountDetail.farmlist}
        />
      )}
    </>
  )
}
