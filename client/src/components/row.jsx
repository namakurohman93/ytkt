import React from "react"

export default function Row({ id, name, kingdomId, tribeId, tkPlayerId, setPlayerId }) {
  let tribes = ["", "Romans", "Teutons", "Gauls", "Nature", "Natars"]

  return (
    <tr>
      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
        <div className="flex items-center">
          <div>
            <div className="text-sm leading-5 text-gray-800">{id}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
        <div className="text-sm leading-5 text-blue-900">
          {name}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
        {kingdomId}
      </td>
      <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
        {tribes[tribeId]}
      </td>
      <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
        <button
          className="px-5 py-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"
          onClick={() => setPlayerId(id)}
        >
          View Details
        </button>
      </td>
    </tr>
  )
}
