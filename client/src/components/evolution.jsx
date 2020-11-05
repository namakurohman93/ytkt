import React, { useState, useEffect } from "react"
import axios from "../config/http-client"

import Row2 from "./row2"

export default function Table({ setPlayerId }) {
  let [formData, setFormData] = useState({ days: 7, hours: 0, evolution: 0 })
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
    axios.get(`/api/inactive`, {
      params: {
        ...formData
      }
    })
      .then(({ data }) => {
        setPlayers(data)
      })
      .catch(err => {
        console.log("Error happen on Table component when fetching player by name")
      })
  }

  useEffect(() => {
    axios.get(`/api/inactive`, {
      params: {
        ...formData,
        page
      }
    })
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
            Player Evolution
          </h1>
          <form onSubmit={submitHandler} className="bg-white rounded-lg px-8 py-5">
            <h5>Evolution</h5>
            <label>Max</label>
            <input
              type="number"
              className="shadow appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.evolution}
              onChange={e => setFormData({ ...formData, evolution: Number(e.target.value) })}
            />
            <h5 className="mt-5">Over</h5>
            <label>Days</label>
            <input
              type="number"
              className="shadow appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.days}
              onChange={e => setFormData({ ...formData, days: Number(e.target.value) })}
            />
            <label>Hours</label>
            <input
              type="number"
              className="shadow appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.hours}
              onChange={e => setFormData({ ...formData, hours: Number(e.target.value) })}
            />
            <input type="submit" value="Filter" className="bg-white px-5 py-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none mt-5" />
          </form>
          
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
                      Kingdom
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                      Tribe
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                      Evolution
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300"></th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {players.map((player, index) => <Row2 {...player} setPlayerId={val => setPlayerId(val)} key={index} />)}
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
