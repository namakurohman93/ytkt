import Table from "react-bootstrap/Table"

export default function KingdomList(props) {
  const { kingdomList, setKingdomId } = props

  return (
    <div className="pt-1 w-25 pl-5">
      <Table bordered hover size="sm">
        <thead>
          <tr>
            <th>Kingdom Name</th>
          </tr>
        </thead>
        <tbody>
          {kingdomList.map((kingdom, i) => {
            return (
              <tr key={i}>
                <td>
                  <a
                    href="#"
                    className="text-decoration-none"
                    onClick={() => setKingdomId(kingdom.tkKingdomId)}
                  >
                    <span className="text-info">
                      {kingdom.name} - {kingdom.Players} player(s)
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
