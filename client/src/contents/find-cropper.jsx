import { useState, useEffect } from "react"
import Container from "react-bootstrap/Container"
import InputGroup from "react-bootstrap/InputGroup"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import Spinner from "react-bootstrap/Spinner"
import Table from "react-bootstrap/Table"
import Form from "react-bootstrap/Form"
import httpClient from "../utilities/http-client"
import distance from "../utilities/distance"
import cellIdToCoordinate from "../utilities/cell-id-to-coordinate"

export default function FindCropper() {
  const [loading, setLoading] = useState(false)
  const [croppers, setCroppers] = useState([])
  const [whatToShow, setWhatToShow] = useState([])
  const [filter, setFilter] = useState({
    nine: true,
    fifth: true,
    free: false
  })
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  useEffect(() => {
    let tempX, tempY

    if (isNaN(Number(x))) tempX = 0
    else tempX = x

    if (isNaN(Number(y))) tempY = 0
    else tempY = y

    let temp = [...croppers]
      .map(e => ({ ...e, distance: distance(e.id, tempX, tempY) }))
      .sort((a, b) => a.distance - b.distance)

    if (!filter.nine) temp = temp.filter(e => e.resType !== "3339")
    if (!filter.fifth) temp = temp.filter(e => e.resType !== "11115")
    if (filter.free) temp = temp.filter(e => e.active === "0" || !e.name)

    setWhatToShow(temp)
  }, [filter, x, y])

  const clickHandler = event => {
    setLoading(true)

    httpClient(`/api/cropper`)
      .then(({ data }) => {
        setCroppers(data)
        setWhatToShow(data)
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false))
  }

  return (
    <Container>
      <div className="pt-5 pl-5 pr-5 pb-4">
        <h1 className="text-info mb-0">Find Cropper</h1>
        <p className="font-weight-lighter text-muted font-italic">
          then settle ( or destroy )
        </p>
      </div>

      {croppers.length === 0 ? (
        loading ? (
          <Button className="ml-5" variant="info" size="sm" disabled>
            <Spinner animation="border" role="status" as="span" size="sm" />{" "}
            Fetching...
          </Button>
        ) : (
          <Button
            className="ml-5"
            variant="info"
            size="sm"
            onClick={clickHandler}
          >
            Fetch Map Data
          </Button>
        )
      ) : (
        <div className="ml-5">
          <h3 className="text-info">Filter</h3>

          <Form>
            <div className="mb-4">
              <Form.Check
                inline
                label="3339"
                type="switch"
                id="inline-switch-1"
                checked={filter.nine}
                onClick={() => setFilter({ ...filter, nine: !filter.nine })}
              />
              <Form.Check
                inline
                label="11115"
                type="switch"
                id="inline-switch-2"
                checked={filter.fifth}
                onClick={() => setFilter({ ...filter, fifth: !filter.fifth })}
              />
              <Form.Check
                inline
                label="free / inactive"
                type="switch"
                id="inline-switch-4"
                onClick={() => setFilter({ ...filter, free: !filter.free })}
              />
            </div>
            <Form.Label>
              <h3 className="text-info">Coordinate</h3>
            </Form.Label>
            <Form.Row className="w-25">
              <Form.Group as={Col}>
                <InputGroup size="sm">
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      <i>x</i>
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    size="sm"
                    type="string"
                    onChange={e => setX(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group as={Col}>
                <InputGroup size="sm">
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      <i>y</i>
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    size="sm"
                    type="string"
                    onChange={e => setY(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </Form.Row>
          </Form>
        </div>
      )}

      {croppers.length > 0 && (
        <div className="pl-5 pr-5 pb-5 pt-3">
          <Table bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Coordinate</th>
                <th>Distance</th>
                <th>Village Name</th>
                <th>Type</th>
                <th>Bonus</th>
              </tr>
            </thead>

            <tbody>
              {whatToShow.map((cropper, i) => {
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{cellIdToCoordinate(cropper.id)}</td>
                    <td>{distance(cropper.id, x, y).toFixed(1)}</td>
                    {cropper.name ? (
                      <td>
                        {cropper.name} {cropper.active === "1" ? "" : "💤"}
                      </td>
                    ) : (
                      <td></td>
                    )}
                    <td>{cropper.resType}</td>
                    <td>{cropper.bonusOases}</td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  )
}
