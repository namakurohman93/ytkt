import { useState } from "react"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Table from "react-bootstrap/Table"
import Alert from "react-bootstrap/Alert"
import CustomSpinner from "../components/custom-spinner"
import httpClient from "../utilities/http-client"
import cellIdToCoordinate from "../utilities/cell-id-to-coordinate"

export default function FindAnimals() {
  const [ animals, setAnimals ] = useState([])
  const [ loading, setLoading ] = useState(false)
  const [ result, setResult ] = useState([])
  const [ error, setError ] = useState(false)

  const animalsName = [
    "", "🐭", "🕷️", "🐍", "🦇", "Boar 🐗",
    "🐺", "🐻", "🐊", "🐯", "🐘"
  ]

  const changeHandler = (isChecked, value) => {
    setError(false)

    if (isChecked) {
      setAnimals([...animals, value].sort((a, b) => a - b))
    } else {
      setAnimals(animals
        .filter(animal => animal !== value)
        .sort((a, b) => a - b))
    }
  }

  const submitHandler = event => {
    event.preventDefault()
    setError(false)

    if (animals.length === 0) {
      setError(true)
    } else {
      setLoading(true)
      setResult([])

      const options = {
        method: "GET",
        params: animals.reduce((a, animal) => ({ ...a, [animal]: 0 }), {}),
        url: `/api/animals`
      }

      httpClient(options)
        .then(({ data }) => setResult(data))
        .catch(err => console.log(err))
        .finally(() => setLoading(false))
    }

  }

  return (
    <Container>
      <div className="p-5">
        <h1 className="text-info mb-0">Find Animals</h1>
        <p className="font-weight-lighter text-muted font-italic">then make a zoo 🐾</p>
      </div>

      <Form className="px-5" onSubmit={submitHandler}>
        <div>
          <Form.Check
            inline
            label="Rat 🐭"
            type="checkbox"
            id="inline-checkbox-1"
            onChange={event => changeHandler(event.target.checked, 1)}
            disabled={loading}
          />
          <Form.Check
            inline label="Spider 🕷️"
            type="checkbox"
            id="inline-checkbox-2"
            onChange={event => changeHandler(event.target.checked, 2)}
            disabled={loading}
          />
          <Form.Check
            inline label="Snake 🐍"
            type="checkbox"
            id="inline-checkbox-3"
            onChange={event => changeHandler(event.target.checked, 3)}
            disabled={loading}
          />
          <Form.Check
            inline label="Bat 🦇"
            type="checkbox"
            id="inline-checkbox-4"
            onChange={event => changeHandler(event.target.checked, 4)}
            disabled={loading}
          />
          <Form.Check
            inline label="Wild Boar 🐗"
            type="checkbox"
            id="inline-checkbox-5"
            onChange={event => changeHandler(event.target.checked, 5)}
            disabled={loading}
          />
        </div>
        <div className="mt-2">
          <Form.Check
            inline label="Wolf 🐺"
            type="checkbox"
            id="inline-checkbox-6"
            onChange={event => changeHandler(event.target.checked, 6)}
            disabled={loading}
          />
          <Form.Check
            inline label="Bear 🐻"
            type="checkbox"
            id="inline-checkbox-7"
            onChange={event => changeHandler(event.target.checked, 7)}
            disabled={loading}
          />
          <Form.Check
            inline label="Crocodile 🐊"
            type="checkbox"
            id="inline-checkbox-8"
            onChange={event => changeHandler(event.target.checked, 8)}
            disabled={loading}
          />
          <Form.Check
            inline label="Tiger 🐯"
            type="checkbox"
            id="inline-checkbox-9"
            onChange={event => changeHandler(event.target.checked, 9)}
            disabled={loading}
          />
          <Form.Check
            inline label="Elephant 🐘"
            type="checkbox"
            id="inline-checkbox-10"
            onChange={event => changeHandler(event.target.checked, 10)}
            disabled={loading}
          />
        </div>
        <Button
          className="mt-3"
          variant="info"
          onClick={submitHandler}
          disabled={loading}
        >
          Find
        </Button>
      </Form>

      {
        error &&
          <div className="m-5">
            <Alert
              variant="danger"
              dismissible
              onClose={() => setError(false)}
            >
              Please select at least one animal
            </Alert>
          </div>
      }

      {
        loading && <CustomSpinner message="finding animals..."/>
      }

      {
        result.length > 0 &&
          <div className="ml-5 mt-5 mb-5">
            <hr />
            <h2 className="text-info">Result</h2>
            <Table bordered hover>
              <thead>
                <tr>
                  <th>Coordinate</th>
                  <th>Animals</th>
                </tr>
              </thead>
              <tbody>
                {
                  result.map((res, i) => {
                    return (
                      <tr key={i}>
                        <td>{cellIdToCoordinate(res.id)}</td>
                        <td>
                        {
                          Object.keys(res.units)
                            .map(key => `${animalsName[key]} ${res.units[key]}`)
                            .join(" ")
                        }
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </Table>
          </div>
      }
    </Container>
  )
}
