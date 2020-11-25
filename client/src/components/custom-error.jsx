import Alert from "react-bootstrap/Alert"

export default function CustomError({ setError }) {
  return (
    <Alert
      variant="danger"
      dismissible
      onClose={() => setError(false)}
    >
      Error just happened, please try again
    </Alert>
  )
}
