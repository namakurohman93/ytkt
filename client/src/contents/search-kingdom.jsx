import { useState, useEffect } from "react"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import InputGroup from "react-bootstrap/InputGroup"
import Spinner from "react-bootstrap/Spinner"
import KingdomList from "./kingdom-list"
import KingdomDetail from "./kingdom-detail"
import CustomError from "../components/custom-error"
import httpClient from "../utilities/http-client"

export default function SearchKingdom() {
  const [ kingdomName, setKingdomName ] = useState("")
  const [ kingdomList, setKingdomList ] = useState(null)
  const [ loading, setLoading ] = useState(false)
  const [ error, setError ] = useState(false)
  const [ kingdomId, setKingdomId ] = useState(null)
  const [ showKingdom, setShowKingdom ] = useState(false)

  useEffect(() => {
    if (kingdomId !== null) setShowKingdom(true)
  }, [kingdomId])

  const submitHandler = event => {
    event.preventDefault()
    setKingdomList(null)
    setError(false)
    setLoading(true)
    setKingdomId(null)
    setShowKingdom(false)

    if (kingdomName.trim().length !== 0) {
      httpClient.get(`/api/kingdoms?name=${kingdomName}`)
        .then(({ data }) => setKingdomList(data))
        .catch(err => setError(true))
        .finally(() => setLoading(false))
    } else setLoading(false)
  }

  return (
    <Container>
      <div className="p-5">
        <h1 className="text-info mb-0">Search Kingdom</h1>
        <p className="font-weight-lighter text-muted font-italic">so you can find inactive member</p>
      </div>

      <Form className="px-5" onSubmit={submitHandler}>
        <Form.Row>
          <InputGroup className="mb-2">
            <InputGroup.Prepend>
              {
                loading
                ? <InputGroup.Text className="px-5">
                    <Spinner animation="border" role="status" as="span" size="sm" />
                  </InputGroup.Text>
                : <InputGroup.Text>Kingdom Name</InputGroup.Text>
              }
            </InputGroup.Prepend>
            <Form.Control
              type="text"
              placeholder="type name then press enter..."
              onChange={e => setKingdomName(e.target.value)}
              style={ kingdomName.length > 0 ? { fontStyle: "normal" } : { fontStyle: "italic" } }
              disabled={loading}
            />
          </InputGroup>
        </Form.Row>
      </Form>

      {
        error &&
        <div className="px-5">
          <CustomError setError={val => setError(val)} />
        </div>
      }

      {
        !showKingdom && kingdomList && kingdomList.length === 0 &&
          <div className="px-5">
            <p className="text-danger text-weight-lighter">no kingdom found</p>
          </div>
      }
      {
        !showKingdom && kingdomList && kingdomList.length > 0 && 
          <KingdomList
            kingdomList={kingdomList}
            setKingdomId={val => setKingdomId(val)}
          />
      }

      {
        showKingdom && <KingdomDetail kingdomId={kingdomId} />
      }
    </Container>
  )
}
