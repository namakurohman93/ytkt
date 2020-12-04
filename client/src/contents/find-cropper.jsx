import { useState } from "react"
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"
import Spinner from "react-bootstrap/Spinner"
import Table from "react-bootstrap/Table"
import httpClient from "../utilities/http-client"
import cellIdToCoordinate from "../utilities/cell-id-to-coordinate"

export default function FindCropper() {
  const [loading, setLoading] = useState(false)
  const [croppers, setCroppers] = useState([])

  const clickHandler = event => {
    setLoading(true)

    httpClient(`/api/cropper`)
      .then(({ data }) => setCroppers(data))
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

      {loading ? (
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
      )}

      <div className="p-5">
        <Table bordered hover size="sm">
          <thead>
            <tr>
              <th>Coordinate</th>
              <th>Village Name</th>
              <th>Type</th>
              <th>Bonus</th>
              <th>Active</th>
            </tr>
          </thead>

          <tbody>
            {croppers.map((cropper, i) => {
              return (
                <tr key={i}>
                  <td>{cellIdToCoordinate(cropper.id)}</td>
                  <td>{cropper.name}</td>
                  <td>{cropper.resType}</td>
                  <td>{cropper.bonusOases}</td>
                  <td>{cropper.active}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    </Container>
  )
}
