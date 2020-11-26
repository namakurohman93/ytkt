import { useState, useEffect } from "react"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import Spinner from "react-bootstrap/Spinner"
import httpClient from "../utilities/http-client"
import "../styles/search-inactive.style.css"

export default function SearchInactive() {
  const [ formData, setFormData ] = useState({
    x: "", y: "",
    evolution: "", hour: "", day: "",
    validated: false, loading: false
  })

  const submitHandler = event => {
    event.preventDefault()

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
        .then(({ data }) => {
          console.log(data)
        })
        .catch(err => {
          console.log(err)
        })
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
            <Form.Control
              required
              size="sm"
              type="number"
              placeholder="x"
              onChange={e => setFormData({
                ...formData,
                x: e.target.value,
                validated: false
              })}
              style={ formData.x.length > 0 ? { fontStyle: "normal" } : { fontStyle: "italic" } }
              disabled={formData.loading}
            />
            <Form.Control.Feedback type="invalid">Required!</Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Control
              required
              size="sm"
              type="number"
              placeholder="y"
              onChange={e => setFormData({
                ...formData,
                y: e.target.value,
                validated: false
              })}
              style={ formData.y.length > 0 ? { fontStyle: "normal" } : { fontStyle: "italic" } }
              disabled={formData.loading}
            />
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
            <Form.Control
              required
              size="sm"
              type="number"
              placeholder="hours"
              onChange={e => setFormData({
                ...formData,
                hour: e.target.value,
                validated: false
              })}
              style={ formData.hour.length > 0 ? { fontStyle: "normal" } : { fontStyle: "italic" } }
              disabled={formData.loading}
            />
            <Form.Control.Feedback type="invalid">Required!</Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>&nbsp;</Form.Label>
            <Form.Control
              required
              size="sm"
              type="number"
              placeholder="days"
              onChange={e => setFormData({
                ...formData,
                day: e.target.value,
                validated: false
              })}
              style={ formData.day.length > 0 ? { fontStyle: "normal" } : { fontStyle: "italic" } }
              disabled={formData.loading}
            />
            <Form.Control.Feedback type="invalid">Required!</Form.Control.Feedback>
          </Form.Group>
        </Form.Row>

        {
          formData.loading
          ? <Button
              variant="info"
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
              variant="info"
              onClick={submitHandler}
              type="submit"
            >
              Search
            </Button>
        }
      </Form>
    </Container>
  )
}
