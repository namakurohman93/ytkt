import { useState } from "react"
import Form from "react-bootstrap/Form"
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"
import Spinner from "react-bootstrap/Spinner"
import httpClient from "../utilities/http-client"

const { NODE_ENV } = process.env

export default function LoginPage({ setIsLogin, setSkipLogin }) {
  const [ email, setEmail ] = useState("")
  const [ password, setPassword ] = useState("")
  const [ gameworld, setGameworld ] = useState("")
  const [ loading, setLoading ] = useState(false)

  const submitHandler = event => {
    event.preventDefault()
    setLoading(true)

    httpClient.post("/api/login", { email, password, gameworld })
      .then(({ data }) => {
        setEmail("")
        setPassword("")
        setGameworld("")
        setIsLogin(true)
      })
      .catch(err => {
        console.log(err)
        console.log("Error happened when trying to login")
      })
      .finally(() => setLoading(false))
  }

  return (
    <Container className="mt-5 p-5 w-25">
      <h3>Login</h3>

      {
        NODE_ENV === "development" &&
          <Button variant="success" onClick={() => setSkipLogin(true)}>
            Skip Login
          </Button>
      }

      <Form className="mt-3">
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Gameworld</Form.Label>
          <Form.Control
            type="text"
            placeholder="Gameworld"
            onChange={e => setGameworld(e.target.value)}
            disabled={loading}
          />
        </Form.Group>
        {
          loading
          ? <Button
              variant="primary"
              onClick={submitHandler}
              type="submit"
              disabled
            >
              <Spinner
                animation="border"
                role="status"
                as="span"
                size="sm"
              /> Loading...
            </Button>
          : <Button
              variant="primary"
              onClick={submitHandler}
              type="submit"
            >
              Login
            </Button>
        }
      </Form>
    </Container>
  )
}
