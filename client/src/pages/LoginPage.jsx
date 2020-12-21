import { useState } from "react"
import Form from "react-bootstrap/Form"
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"
import Spinner from "react-bootstrap/Spinner"
import Alert from "react-bootstrap/Alert"
import httpClient from "../utilities/http-client"

const { NODE_ENV } = process.env

export default function LoginPage({ setIsLogin, setSkipLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    gameworld: "",
    isDual: false,
    avatarName: ""
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const submitHandler = e => {
    e.preventDefault()
    setError(false)
    setLoading(true)

    httpClient
      .post("/api/login", formData)
      .then(({ data }) => setIsLogin(data.response.isLogin))
      .catch(err => setError(true))
      .finally(() => setLoading(false))
  }

  const inputChangeHandler = e => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const selectChangeHandler = e => {
    const { value } = e.target
    setFormData({ ...formData, isDual: value === "dual" ? true : false })
  }

  return (
    <Container className="mt-5 p-5 w-25">
      <h3>Login</h3>

      {NODE_ENV === "development" && (
        <Button variant="success" onClick={() => setSkipLogin(true)}>
          Skip Login
        </Button>
      )}

      <Form className="mt-3" onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="example@email.com"
            style={
              formData.email.length > 0
                ? { fontStyle: "normal" }
                : { fontStyle: "italic" }
            }
            name="email"
            onChange={inputChangeHandler}
            disabled={loading}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="dirty little secret"
            style={
              formData.password.length > 0
                ? { fontStyle: "normal" }
                : { fontStyle: "italic" }
            }
            name="password"
            onChange={inputChangeHandler}
            disabled={loading}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Gameworld</Form.Label>
          <Form.Control
            type="text"
            placeholder="cz2"
            style={
              formData.gameworld.length > 0
                ? { fontStyle: "normal" }
                : { fontStyle: "italic" }
            }
            name="gameworld"
            onChange={inputChangeHandler}
            disabled={loading}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Account Type</Form.Label>
          <Form.Control
            as="select"
            custom
            onChange={selectChangeHandler}
            disabled={loading}
          >
            <option value="primary">Primary</option>
            <option value="dual">Dual</option>
          </Form.Control>
        </Form.Group>

        {formData.isDual && (
          <Form.Group>
            <Form.Label>Avatar Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="RandomGuy"
              style={
                formData.avatarName.length > 0
                  ? { fontStyle: "normal" }
                  : { fontStyle: "italic" }
              }
              name="avatarName"
              onChange={inputChangeHandler}
              disabled={loading}
            />
          </Form.Group>
        )}

        {loading ? (
          <Button variant="primary" disabled>
            <Spinner animation="border" role="status" as="span" size="sm" />{" "}
            Loading...
          </Button>
        ) : (
          <Button variant="primary" onClick={submitHandler} type="submit">
            Login
          </Button>
        )}
      </Form>

      {error && (
        <Alert
          className="mt-3"
          variant="danger"
          dismissible
          onClose={() => setError(false)}
        >
          Make sure your credential is correct.
        </Alert>
      )}
    </Container>
  )
}
