import { useState, useEffect } from "react"
import Container from "react-bootstrap/Container"
import Table from "react-bootstrap/Table"
import Pagination from "react-bootstrap/Pagination"
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import InputGroup from "react-bootstrap/InputGroup"
import PlayerDetail from "./player-detail"
import httpClient from "../utilities/http-client"

const tribes = ["", "Roman", "Teuton", "Gauls"]

export default function SearchPlayer() {
  const [playerList, setPlayerList] = useState([])
  const [whatToShow, setWhatToShow] = useState([])
  const [page, setPage] = useState(0)
  const [lastPage, setLastPage] = useState(0)
  const [formData, setFormData] = useState({
    max: 0,
    day: 1,
    hour: 0,
    loading: false
  })
  const [playerId, setPlayerId] = useState(null)
  const [filterInactive, setFilterInactive] = useState(false)

  useEffect(() => {
    if (filterInactive) {
      let temp = playerList.filter(player => player.isActive)

      setWhatToShow(temp.slice(20 * page, (page + 1) * 20))
    } else {
      setWhatToShow(playerList.slice(20 * page, (page + 1) * 20))
    }
  }, [page, playerList, filterInactive])

  const prevButton = e => {
    if (page !== 0) setPage(page - 1)
  }

  const nextButton = e => {
    if (page !== lastPage - 1) setPage(page + 1)
  }

  const inactiveSwitchHandler = e => setFilterInactive(e.target.checked)

  const playerDetail = playerId => setPlayerId(playerId)

  const inputChangeHandler = e => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const submitHandler = e => {
    e.preventDefault()
    setPlayerId(null)
    setPage(0)
    setFilterInactive(false)
    setWhatToShow([])
    setFormData({ ...formData, loading: true })

    httpClient
      .get(`/api/players`, {
        params: {
          max: formData.max,
          day: formData.day,
          hour: formData.hour
        }
      })
      .then(({ data }) => {
        setPlayerList(data)
        setWhatToShow(data.slice(0, 20))
        setLastPage(Math.ceil(data.length / 20))
      })
      .catch(err => console.log(err))
      .finally(() => setFormData({ ...formData, loading: false }))
  }

  return (
    <Container>
      <div className="p-5">
        <h1 className="text-info mb-0">Player Evolution</h1>
        <p className="font-weight-lighter text-muted font-italic">
          get the detail of player's evolution
        </p>
      </div>

      <div className="px-5 pb-5">
        <Form onSubmit={submitHandler}>
          <Form.Row className="w-50">
            <Form.Group as={Col}>
              <Form.Label className="text-info">Maximum Evolution</Form.Label>
              <Form.Control
                name="max"
                size="sm"
                type="number"
                placeholder="max"
                value={formData.max}
                onChange={inputChangeHandler}
                disabled={formData.loading}
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label className="text-info">Over</Form.Label>
              <InputGroup size="sm">
                <Form.Control
                  name="day"
                  size="sm"
                  type="number"
                  value={formData.day}
                  onChange={inputChangeHandler}
                  disabled={formData.loading}
                />
                <InputGroup.Prepend>
                  <InputGroup.Text>Day</InputGroup.Text>
                </InputGroup.Prepend>
              </InputGroup>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>&nbsp;</Form.Label>
              <InputGroup size="sm">
                <Form.Control
                  name="hour"
                  size="sm"
                  type="number"
                  value={formData.hour}
                  onChange={inputChangeHandler}
                  disabled={formData.loading}
                />
                <InputGroup.Prepend>
                  <InputGroup.Text>Hour</InputGroup.Text>
                </InputGroup.Prepend>
              </InputGroup>
            </Form.Group>
          </Form.Row>

          <Button
            variant="info"
            size="sm"
            onClick={submitHandler}
            type="submit"
            disabled={formData.loading}
          >
            Filter
          </Button>
        </Form>
      </div>

      {playerId === null ? (
        <div className="px-5">
          <Pagination>
            <Pagination.Prev onClick={prevButton} />
            <Pagination.Next onClick={nextButton} />
            <Pagination.Item disabled className="text-muted font-italic">
              {page + 1} of {lastPage}
            </Pagination.Item>

            <div className="ml-5 my-auto">
              <Form.Check
                type="switch"
                id="show-inactive-switch"
                label="Filter Inactive"
                onChange={inactiveSwitchHandler}
              />
            </div>
          </Pagination>

          <Table bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Tribe</th>
                <th>Kingdom</th>
                <th>Evolution</th>
              </tr>
            </thead>
            <tbody>
              {whatToShow.map((player, i) => {
                return (
                  <tr
                    key={player.id}
                    role="button"
                    onClick={() => playerDetail(player.id)}
                  >
                    <td>{20 * page + (i + 1)}</td>
                    <td>
                      {player.name} {player.isActive ? "" : "💤"}
                    </td>
                    <td>{tribes[player.tribeId]}</td>
                    <td>{player.kingdom}</td>
                    <td>{player.evolution}</td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
      ) : (
        <div className="px-5">
          <Button variant="outline-info" onClick={() => playerDetail(null)}>
            « Back
          </Button>

          <div className="mt-3">
            <PlayerDetail playerId={playerId} />
          </div>
        </div>
      )}
    </Container>
  )
}
