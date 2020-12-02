import { useState } from "react"
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"
import Spinner from "react-bootstrap/Spinner"

export default function FindCropper() {
  const [ loading, setLoading ] = useState(false)

  const clickHandler = event => setLoading(true)

  return (
    <Container>
      <div className="p-5">
        <h1 className="text-info mb-0">Find Cropper</h1>
        <p className="font-weight-lighter text-muted font-italic">then settle ( or destroy )</p>
      </div>

      {
        loading
        ? <Button
            className="mt-3 ml-5"
            variant="info"
            size="sm"
            disabled
          >
            <Spinner
              animation="border"
              role="status"
              as="span"
              size="sm"
            /> Fetching...
          </Button>
        : <Button
            className="mt-3 ml-5"
            variant="info"
            size="sm"
            onClick={clickHandler}
          >
            Fetch Map Data
          </Button>
      }

    </Container>
  )
}
