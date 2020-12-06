import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import InputGroup from "react-bootstrap/InputGroup"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import { staticUnit, staticBuilding } from "../constants"

export default function ScheduleAttack() {
  const tribeId = "1"

  return (
    <Container>
      <div className="p-5">
        <h1 className="text-info mb-0">Schedule Attack</h1>
        <p className="font-weight-lighter text-muted">
          <span className="font-italic">
            Schedule your attack, then sleep well
          </span>{" "}
          🛏️💭
        </p>
        <div className="border border-warning rounded-lg">
          <ul className="pt-3">
            <li>
              <span className="font-weight-lighter text-muted">
                Note that the time is
              </span>{" "}
              <b>relative</b>{" "}
              <span className="font-weight-lighter text-muted">
                to server time
              </span>
            </li>
            <li>
              <span className="font-weight-lighter text-muted">
                Make sure you have enough
              </span>{" "}
              <b>troops</b>
            </li>
          </ul>
        </div>
      </div>

      <div className="px-5">
        <h3 className="text-info">Setup Attack</h3>

        <Form>
          <Form.Row>
            <Form.Group as={Col} lg={4}>
              <Form.Label className="mt-3">
                <h5 className="text-info">From Village</h5>
              </Form.Label>
              <Form.Control as="select" id="village-custom-select-1" custom>
                <option value="0">Choose...</option>
                <option value="1">001</option>
                <option value="2">002</option>
                <option value="3">003</option>
                <option value="4">004</option>
                <option value="5">005</option>
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} lg={2}>
              <Form.Label className="mt-3">
                <h5 className="text-info">Target</h5>
              </Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <i>x</i>
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control type="number" />
              </InputGroup>
            </Form.Group>

            <Form.Group as={Col} lg={2}>
              <Form.Label className="mt-3">
                <h5 className="text-info">&nbsp;</h5>
              </Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <i>y</i>
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control type="number" />
              </InputGroup>
            </Form.Group>

            <Form.Group as={Col} lg={2}>
              <Form.Label className="mt-3">
                <h5 className="text-info">Launch Time</h5>
              </Form.Label>
              <Form.Control type="date" />
            </Form.Group>

            <Form.Group as={Col} lg={2}>
              <Form.Label className="mt-3">
                <h5 className="text-info">&nbsp;</h5>
              </Form.Label>
              <Form.Control type="time" step="1" />
            </Form.Group>
          </Form.Row>

          <Form.Label className="mt-3">
            <h5 className="text-info">Units</h5>
          </Form.Label>
          <Form.Row>
            {staticUnit[tribeId].map((unit, i) => {
              return (
                <Form.Group as={Col} key={i}>
                  <Form.Label className="text-muted">{unit}</Form.Label>
                  <Form.Control type="number" size="sm" />
                </Form.Group>
              )
            })}
            <Form.Group as={Col}>
              <Form.Label className="text-muted">Hero</Form.Label>
              <Form.Check id="hero-switch-1" type="switch" size="sm" />
            </Form.Group>
          </Form.Row>

          <Form.Label className="mt-3">
            <h5 className="text-info">Catapult Target</h5>
          </Form.Label>

          <Form.Row>
            <Form.Group as={Col} lg={4}>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>First Target</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control as="select" id="village-custom-select-1" custom>
                  <option value="99">Random</option>
                  {staticBuilding.map(building => {
                    return (
                      <option key={building.id} value={building.id}>
                        {building.name}
                      </option>
                    )
                  })}
                </Form.Control>
              </InputGroup>
            </Form.Group>

            <Form.Group as={Col} lg={4}>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>Second Target</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control as="select" id="village-custom-select-2" custom>
                  <option value="99">Random</option>
                  {staticBuilding.map(building => {
                    return (
                      <option key={building.id} value={building.id}>
                        {building.name}
                      </option>
                    )
                  })}
                </Form.Control>
              </InputGroup>
            </Form.Group>
          </Form.Row>

          <Button variant="info" className="mt-3">
            Schedule the Attack
          </Button>
        </Form>
      </div>
    </Container>
  )
}
