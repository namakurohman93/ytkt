import { useState } from "react"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import InputGroup from "react-bootstrap/InputGroup"
import InactiveList from "./inactive-list"
import CustomError from "../components/custom-error"
import CustomSpinner from "../components/custom-spinner"
import httpClient from "../utilities/http-client"
import "../styles/search-inactive.style.css"

export default function SearchInactive() {
  const [ formData, setFormData ] = useState({
    x: "", y: "",
    evolution: "", hour: "", day: "",
    validated: false, loading: false
  })
  const [ inactiveList, setInactiveList ] = useState([])
  const [ page, setPage ] = useState(1)
  const [ error, setError ] = useState(false)

  const submitHandler = event => {
    event.preventDefault()
    setInactiveList([])

    if (
      formData.x === "" ||
      formData.y === "" ||
      formData.evolution === "" ||
      formData.hour === "" ||
      formData.day === ""
    ) {
      setFormData({ ...formData, validated: true })
    } else {
      setFormData({ ...formData, loading: true })
      const { x, y, evolution, hour, day } = formData

      httpClient.get(`/api/inactive`, {
        params: { x, y, evolution, hour, day }
      })
        .then(({ data }) => setInactiveList(data))
        .catch(err => setError(true))
        .finally(() => setFormData({ ...formData, loading: false }))
    }
  }

  return (
    <Container>
      <div className="p-5">
        <h1 className="text-info mb-0">Search Inactive</h1>
        <p className="font-weight-lighter text-muted font-italic">then farm them nonstop</p>
      </div>

      <Form className="px-5" onSubmit={submitHandler} noValidate validated={formData.validated}>
        <Form.Label>
          <h3 className="text-info">Coordinate</h3>
        </Form.Label>
        <Form.Row className="w-25">
          <Form.Group as={Col}>
            <InputGroup size="sm">
              <InputGroup.Prepend>
                <InputGroup.Text><i>x</i></InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                required
                size="sm"
                type="number"
                onChange={e => setFormData({
                  ...formData,
                  x: e.target.value,
                  validated: false
                })}
                disabled={formData.loading}
              />
            </InputGroup>
            <Form.Control.Feedback type="invalid">Required!</Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col}>
            <InputGroup size="sm">
              <InputGroup.Prepend>
                <InputGroup.Text><i>y</i></InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                required
                size="sm"
                type="number"
                onChange={e => setFormData({
                  ...formData,
                  y: e.target.value,
                  validated: false
                })}
                disabled={formData.loading}
              />
            </InputGroup>
            <Form.Control.Feedback type="invalid">Required!</Form.Control.Feedback>
          </Form.Group>
        </Form.Row>

        <Form.Label className="mt-3">
          <h3 className="text-info">Player Evolution</h3>
        </Form.Label>
        <Form.Row className="w-50">
          <Form.Group as={Col}>
            <Form.Label className="text-muted">Max</Form.Label>
            <Form.Control
              required
              size="sm"
              type="number"
              placeholder="max"
              onChange={e => setFormData({
                ...formData,
                evolution: e.target.value,
                validated: false
              })}
              style={ formData.evolution.length > 0 ? { fontStyle: "normal" } : { fontStyle: "italic" } }
              disabled={formData.loading}
            />
            <Form.Control.Feedback type="invalid">Required!</Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label className="text-muted">Over</Form.Label>
            <InputGroup size="sm">
              <Form.Control
                required
                size="sm"
                type="number"
                onChange={e => setFormData({
                  ...formData,
                  day: e.target.value,
                  validated: false
                })}
                disabled={formData.loading}
              />
              <InputGroup.Prepend>
                <InputGroup.Text>Day</InputGroup.Text>
              </InputGroup.Prepend>
            </InputGroup>
            <Form.Control.Feedback type="invalid">Required!</Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>&nbsp;</Form.Label>
            <InputGroup size="sm">
              <Form.Control
                required
                size="sm"
                type="number"
                onChange={e => setFormData({
                  ...formData,
                  hour: e.target.value,
                  validated: false
                })}
                disabled={formData.loading}
              />
              <InputGroup.Prepend>
                <InputGroup.Text>Hour</InputGroup.Text>
              </InputGroup.Prepend>
            </InputGroup>
            <Form.Control.Feedback type="invalid">Required!</Form.Control.Feedback>
          </Form.Group>
        </Form.Row>

        <Button
          variant="info"
          onClick={submitHandler}
          type="submit"
          disabled={formData.loading}
        >
          Search
        </Button>
      </Form>

      {
        formData.loading &&
          <div className="mt-5">
            <CustomSpinner message="fetching..." />
          </div>
      }

      {
        error &&
          <div className="px-5">
            <CustomError setError={val => setError(val)} />
          </div>
      }

      {
        inactiveList.length > 0 &&
          <div className="ml-5 mt-5 mb-5">
            <hr />
            <h2 className="text-info">Result</h2>
            <InactiveList
              inactiveList={inactiveList}
              setInactiveList={val => setInactiveList(val)}
              x={formData.x}
              y={formData.y}
              evolution={formData.evolution}
              hour={formData.hour}
              day={formData.day}
            />
          </div>
      }
    </Container>
  )
}
