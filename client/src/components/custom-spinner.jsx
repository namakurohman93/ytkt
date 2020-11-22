import Spinner from "react-bootstrap/Spinner"

const spinnerStyle = {
  display: "block",
  position: "fixed",
  top: "50%",
  right: "50%"
}

export default function CustomSpinner(props) {
  const { message } = props

  return (
    <div style={spinnerStyle} className="text-center">
      <Spinner animation="grow" variant="info" />
      <p>{message}</p>
    </div>
  )
}
