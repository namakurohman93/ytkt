import { useState, useEffect } from "react"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import InputGroup from "react-bootstrap/InputGroup"
import Spinner from "react-bootstrap/Spinner"
import PlayerList from "./player-list"
import PlayerDetail from "./player-detail"
import CustomError from "../components/custom-error"
import httpClient from "../utilities/http-client"

export default function SearchPlayer() {
  const [playerName, setPlayerName] = useState("")
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [playerList, setPlayerList] = useState(null)
  const [playerId, setPlayerId] = useState(null)
  const [showPlayer, setShowPlayer] = useState(false)

  useEffect(() => {
    if (playerId !== null) setShowPlayer(true)
  }, [playerId])

  const submitHandler = event => {
    event.preventDefault()
    setPlayerList(null)
    setError(false)
    setLoading(true)
    setShowPlayer(false)

    if (playerName.trim().length !== 0) {
      httpClient
        .get(`/api/players?name=${playerName}`)
        .then(({ data }) => setPlayerList(data))
        .catch(err => setError(true))
        .finally(() => setLoading(false))
    } else setLoading(false)
  }

  return (
    <Container>
      <div className="p-5">
        <h1 className="text-info mb-0">Search Player</h1>
        <p className="font-weight-lighter text-muted font-italic">
          that you think is inactive
        </p>
      </div>

      <Form className="px-5" onSubmit={submitHandler}>
        <Form.Row>
          <InputGroup className="mb-2">
            <InputGroup.Prepend>
              {loading ? (
                <InputGroup.Text className="px-5">
                  <Spinner
                    animation="border"
                    role="status"
                    as="span"
                    size="sm"
                  />
                </InputGroup.Text>
              ) : (
                <InputGroup.Text>Player Name</InputGroup.Text>
              )}
            </InputGroup.Prepend>
            <Form.Control
              type="text"
              placeholder="type name then press enter..."
              onChange={e => setPlayerName(e.target.value)}
              style={
                playerName.length > 0
                  ? { fontStyle: "normal" }
                  : { fontStyle: "italic" }
              }
              disabled={loading}
            />
          </InputGroup>
        </Form.Row>
      </Form>

      {error && (
        <div className="px-5">
          <CustomError setError={val => setError(val)} />
        </div>
      )}

      {!showPlayer && playerList && playerList.length === 0 && (
        <div className="px-5">
          <p className="text-danger text-weight-lighter">no player found</p>
        </div>
      )}
      {!showPlayer && playerList && playerList.length > 0 && (
        <PlayerList
          playerList={playerList}
          setPlayerId={val => setPlayerId(val)}
        />
      )}

      {showPlayer && <PlayerDetail playerId={playerId} />}
    </Container>
  )
}
