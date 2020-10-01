import React, { useState, useEffect } from "react"
import axios from "axios"

import Row from "./row"

export default function Table({ setPlayerId }) {
  let [playerName, setPlayerName] = useState("")
  let [players, setPlayers] = useState(null)
  let [page, setPage] = useState(0)

  let pageHandler = status => {
    if (status === "decrement") {
      if (page > 0) {
        setPage(page - 1)
      }
    } else if (status === "increment") {
      setPage(page + 1)
    }
    else console.log("unknown status")
  }

  let submitHandler = e => {
    e.preventDefault()
    axios.get(`http://localhost:3000/api/players?name=${playerName}`)
      .then(({ data }) => {
        setPlayers(data)
      })
      .catch(err => {
        console.log("Error happen on Table component when fetching player by name")
      })
      .finally(() => setPlayerName(""))
  }

  useEffect(() => {
    axios.get(`http://localhost:3000/api/players?page=${page}`)
      .then(({ data }) => {
        setPlayers(data)
      })
      .catch(err => {
        console.log("Error happen on Table component")
      })
  }, [page])

  if (players == null) return "Loading..."

  return (
    <>
      <div className="mt-64 px-32">
        <div className="px-64">
          <h1 className="text-white font-bold text-5xl leading-tight">
            Player List
          </h1>
          <div className="align-middle rounded inline-block w-full py-4 overflow-hidden bg-white shadow-lg px-12 mt-4">
            <form onSubmit={submitHandler}>
              <div className="flex justify-between">
                <div className="inline-flex rounded w-7/12 px-2 lg:px-6 h-12 bg-transparent">
                  <div className="flex flex-wrap items-stretch w-full h-full mb-6 relative">
                    <input
                      type="text"
                      autoComplete="off"
                      className="shadow appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Search player"
                      value={playerName}
                      onChange={e => setPlayerName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 pr-10 lg:px-8">
            <div className="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-8 pt-3 rounded-lg rounded-br-lg pb-2">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                      Kingdom Id
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                      Tribe
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300"></th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {players.map((player, index) => <Row {...player} setPlayerId={val => setPlayerId(val)} key={index} />)}
                </tbody>
              </table>
              <div className="sm:flex-1 sm:flex sm:items-center sm:justify-between mt-4 work-sans">
                <div>
                  <nav className="relative z-0 inline-flex shadow-sm">
                    <div>
                      <button
                        onClick={e => pageHandler("decrement")}
                        className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-blue-700 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-tertiary active:text-gray-700 transition ease-in-out duration-150 hover:bg-tertiary"
                      >
                        &lt;
                      </button>
                      <button
                        onClick={e => pageHandler("increment")}
                        className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-blue-600 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-tertiary active:text-gray-700 transition ease-in-out duration-150 hover:bg-tertiary"
                      >
                        &gt;
                      </button>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
