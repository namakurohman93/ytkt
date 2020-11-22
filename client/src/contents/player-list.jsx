import Table from "react-bootstrap/Table"

export default function PlayerList(props) {
  const { playerList, setPlayerId } = props

  return (
    <div className="pt-1 w-25 pl-5">
      <Table bordered hover size="sm">
        <thead>
          <tr>
            <th>Player Name</th>
          </tr>
        </thead>
        <tbody>
          {playerList.map((player, i) => {
            return (
              <tr key={i}>
                <td>
                  <a
                    href="#"
                    className="text-decoration-none"
                    onClick={() => setPlayerId(player.tkPlayerId)}
                  >
                    <span className="text-info">
                      {player.name} { player.isActive ? "" : "💤" }
                    </span>
                  </a>
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  )
}
