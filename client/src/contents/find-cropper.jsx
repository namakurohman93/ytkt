import { useState, useEffect } from "react"
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"
import Spinner from "react-bootstrap/Spinner"
import Table from "react-bootstrap/Table"
import Form from "react-bootstrap/Form"
import httpClient from "../utilities/http-client"
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

  useEffect(() => {
    let temp = [...croppers]

    if (!filter.nine) temp = temp.filter(e => e.resType !== "3339")
    if (!filter.fifth) temp = temp.filter(e => e.resType !== "11115")
    if (filter.free) temp = temp.filter(e => e.active === "0" || !e.name)

    setWhatToShow(temp)
  }, [filter])

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
            <div className="mb-2">
              <Form.Check
                inline
                label="3339"
                type="checkbox"
                id="inline-checkbox-1"
                checked={filter.nine}
                onClick={() => setFilter({ ...filter, nine: !filter.nine })}
              />
              <Form.Check
                inline
                label="11115"
                type="checkbox"
                id="inline-checkbox-2"
                checked={filter.fifth}
                onClick={() => setFilter({ ...filter, fifth: !filter.fifth })}
              />
              <Form.Check
                inline
                label="free / inactive"
                type="checkbox"
                id="inline-checkbox-4"
                onClick={() => setFilter({ ...filter, free: !filter.free })}
              />
            </div>
          </Form>
        </div>
      )}

      {croppers.length > 0 && (
        <div className="p-5">
          <Table bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Coordinate</th>
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
