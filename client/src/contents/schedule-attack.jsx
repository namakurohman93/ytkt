import { useState, useEffect } from "react"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import InputGroup from "react-bootstrap/InputGroup"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import Table from "react-bootstrap/Table"
import Popover from "react-bootstrap/Popover"
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import { staticUnit, staticBuilding } from "../constants"
import cellIdToCoordinate from "../utilities/cell-id-to-coordinate"
import httpClient from "../utilities/http-client"

export default function ScheduleAttack({ villages, tribeId }) {
  const [loading, setLoading] = useState(false)
  const [schedule, setSchedule] = useState([])
  const [formData, setFormData] = useState({
    villageId: "",
    x: "",
    y: "",
    date: "",
    time: "",
    units: {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0
    },
    firstTarget: "99",
    secondTarget: "99"
  })

  useEffect(() => {
    httpClient
      .get(`/api/schedule-attack`)
      .then(({ data }) => setSchedule(data))
      .catch(err => console.log(err))
  }, [])

  const submitHandler = e => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      date: `${formData.date} ${formData.time}`,
      units: formData.units,
      x: formData.x,
      y: formData.y,
      villageId: formData.villageId,
      catapultTargets: [formData.firstTarget, formData.secondTarget]
    }

    httpClient
      .post(`/api/schedule-attack`, payload)
      .then(({ data }) => setSchedule(data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false))
  }

  const deleteSchedule = scheduleId => {
    httpClient
      .delete(`/api/schedule-attack/${scheduleId}`)
      .then(({ data }) => setSchedule(data))
      .catch(err => console.log(err))
  }

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
              {villages === null ? (
                <Form.Control
                  as="select"
                  id="village-custom-select-1"
                  custom
                  disabled
                >
                  <option value="">Choose...</option>
                </Form.Control>
              ) : (
                <Form.Control
                  as="select"
                  id="village-custom-select-1"
                  custom
                  onChange={e =>
                    setFormData({ ...formData, villageId: e.target.value })
                  }
                  disabled={loading}
                >
                  <option value="">Choose...</option>
                  {villages.map(v => {
                    return (
                      <option value={v.villageId} key={v.villageId}>
                        {v.name}
                      </option>
                    )
                  })}
                </Form.Control>
              )}
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
                <Form.Control
                  type="number"
                  onChange={e =>
                    setFormData({ ...formData, x: e.target.value })
                  }
                  disabled={loading}
                />
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
                <Form.Control
                  type="number"
                  onChange={e =>
                    setFormData({ ...formData, y: e.target.value })
                  }
                  disabled={loading}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group as={Col} lg={2}>
              <Form.Label className="mt-3">
                <h5 className="text-info">Launch Time</h5>
              </Form.Label>
              <Form.Control
                type="date"
                onChange={e =>
                  setFormData({ ...formData, date: e.target.value })
                }
                disabled={loading}
              />
            </Form.Group>

            <Form.Group as={Col} lg={2}>
              <Form.Label className="mt-3">
                <h5 className="text-info">&nbsp;</h5>
              </Form.Label>
              <Form.Control
                type="time"
                step="1"
                onChange={e =>
                  setFormData({ ...formData, time: e.target.value })
                }
                disabled={loading}
              />
            </Form.Group>
          </Form.Row>

          {tribeId !== null && (
            <>
              <Form.Label className="mt-3">
                <h5 className="text-info">Units</h5>
              </Form.Label>
              <Form.Row>
                {staticUnit[tribeId].map(unit => {
                  return (
                    <Form.Group as={Col} key={unit.id}>
                      <Form.Label className="text-muted">
                        {unit.name}
                      </Form.Label>
                      <Form.Control
                        type="number"
                        size="sm"
                        onChange={e =>
                          setFormData({
                            ...formData,
                            units: {
                              ...formData.units,
                              [unit.id]: e.target.value
                            }
                          })
                        }
                        disabled={loading}
                      />
                    </Form.Group>
                  )
                })}
                <Form.Group as={Col}>
                  <Form.Label className="text-muted">Hero</Form.Label>
                  <Form.Check
                    id="hero-switch-1"
                    type="switch"
                    size="sm"
                    onChange={e => {
                      const value = e.target.checked ? "1" : "0"
                      setFormData({
                        ...formData,
                        units: { ...formData.units, "11": value }
                      })
                    }}
                    disabled={loading}
                  />
                </Form.Group>
              </Form.Row>
            </>
          )}

          <Form.Label className="mt-3">
            <h5 className="text-info">Catapult Target</h5>
          </Form.Label>

          <Form.Row>
            <Form.Group as={Col} lg={4}>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>First Target</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  as="select"
                  id="village-custom-select-1"
                  custom
                  onChange={e =>
                    setFormData({ ...formData, firstTarget: e.target.value })
                  }
                  disabled={loading}
                >
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
                <Form.Control
                  as="select"
                  id="village-custom-select-2"
                  custom
                  onChange={e =>
                    setFormData({ ...formData, secondTarget: e.target.value })
                  }
                  disabled={loading}
                >
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

          <Button
            variant="info"
            className="mt-3"
            onClick={submitHandler}
            type="submit"
            disabled={loading}
          >
            Schedule the Attack
          </Button>
        </Form>
      </div>

      {schedule.length > 0 ? (
        <div className="px-5 mt-5">
          <Table bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Target</th>
                <th>Status</th>
                <th>Launch Time</th>
                <th>Catapult Target</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((s, i) => {
                return (
                  <tr key={s.id}>
                    <td>{i + 1}</td>
                    <td>{cellIdToCoordinate(s.target)}</td>
                    <td>{s.status}</td>
                    <td>{new Date(s.end).toLocaleString()}</td>
                    <td>
                      {s.catapultTargets
                        .map(e =>
                          e === "99"
                            ? "Random"
                            : staticBuilding.find(b => b.id === +e).name
                        )
                        .join(", ")}
                    </td>
                    <td>
                      <OverlayTrigger
                        trigger="click"
                        rootClose
                        placement="top"
                        key="top"
                        overlay={
                          <Popover id={s.id} bsPrefix="custom-popover-body">
                            <Popover.Content className="p-0">
                              <Table
                                size="sm"
                                className="m-0"
                                variant="info"
                                bordered
                              >
                                <thead>
                                  <tr>
                                    {staticUnit[tribeId].map(
                                      unit => {
                                        return (
                                          <th key={unit.id}>{unit.name}</th>
                                        )
                                      }
                                    )}
                                    <th>Hero</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    {Object.values(s.units).map((v, i) => {
                                      return <td id={i}>{v}</td>
                                    })}
                                  </tr>
                                </tbody>
                              </Table>
                            </Popover.Content>
                          </Popover>
                        }
                      >
                        <Button variant="primary" size="sm">
                          See Units
                        </Button>
                      </OverlayTrigger>{" "}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => deleteSchedule(s.id)}
                      >
                        🗑️ Delete
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
      ) : (
        <div className="px-5 mt-5">
          <p>There is no schedule</p>
        </div>
      )}
    </Container>
  )
}
