import { useState, useEffect } from "react"
import PlayerList from "./player-list"
import PlayerDetail from "./player-detail"
import CustomSpinner from "../components/custom-spinner"
import CustomError from "../components/custom-error"
import httpClient from "../utilities/http-client"

export default function KingdomDetail(props) {
  const { kingdomId } = props
  
  const [ error, setError ] = useState(false)
  const [ kingdom, setKingdom ] = useState(null)
  const [ playerId, setPlayerId ] = useState(null)
  const [ showPlayer, setShowPlayer ] = useState(false)
  const [ showKingdom, setShowKingdom ] = useState(true)

  useEffect(() => {
    if (playerId !== null) {
      setShowPlayer(true)
      setShowKingdom(false)
    } else {
      setShowPlayer(false)
      setShowKingdom(true)
    }
  }, [playerId])

  useEffect(() => {
    httpClient.get(`/api/kingdoms/${kingdomId}`)
      .then(({ data }) => setKingdom(data))
      .catch(err => setError(true))
  }, [kingdomId])

  if (kingdom === null) return <CustomSpinner message="fetching..." />

  return (
    <>
      {
        error &&
          <div className="px-5">
            <CustomError setError={val => setError(val)} />
          </div>
      }


      {
        showKingdom &&
          <PlayerList 
            playerList={kingdom.Players}
            setPlayerId={val => setPlayerId(val)}
          />
      }

      {
        showPlayer && playerId !== null &&
          <>
            <div className="pt-1 w-25 pl-5">
              <a
                href="#"
                className="text-decoration-none"
                onClick={() => setPlayerId(null)}
              >
                <h3>⬅️ Back</h3>
              </a>
            </div>

            <PlayerDetail playerId={playerId} />
          </>
      }
    </>
  )
}
