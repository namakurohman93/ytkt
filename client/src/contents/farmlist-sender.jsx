import { useState, useEffect } from "react"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col"
import InputGroup from "react-bootstrap/InputGroup"
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"
import Table from "react-bootstrap/Table"
import httpClient from "../utilities/http-client"

export default function FarmlistSender({ farmlist, villages }) {
  const [fl, setFl] = useState(null)
  const [formData, setFormData] = useState({
    farmlistIds: [],
    villageId: "",
    interval: 0,
    redFarmlistId: ""
  })
  const [farmlistSender, setFarmlistSender] = useState([])

  useEffect(() => {
    const result = []

    for (let i = 0; i < farmlist.length; i += 5) {
      const temp = []
      for (let j = i; j < i + 5; j++) {
        if (farmlist[j] === undefined) break
        temp.push(farmlist[j])
      }

      result.push(temp)
    }

    setFl(result)
  }, [])

  useEffect(() => {
    httpClient
      .get(`/api/farmlist-sender`)
      .then(({ data }) => setFarmlistSender(data))
      .catch(err => console.log(err))
  }, [])

  const submitHandler = e => {
    e.preventDefault()
    httpClient
      .post(`/api/farmlist-sender`, formData)
      .then(({ data }) => setFarmlistSender(data))
      .catch(err => console.log(err))
  }

  const inputFormHandler = e => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const checkboxHandler = e => {
    const { checked, value } = e.target

    setFormData({
      ...formData,
      farmlistIds: checked
        ? [...formData.farmlistIds, value]
        : formData.farmlistIds.filter(e => e !== value)
    })
  }

  const switchHandler = e => {
    const { checked, value } = e.target

    httpClient
      .patch(`/api/farmlist-sender`, {
        farmlistSenderId: value,
        checked
      })
      .then(({ data }) => setFarmlistSender(data))
      .catch(err => console.log(err))
  }

  const deleteButtonHandler = e => {
    const { value } = e.target

    httpClient
      .delete(`/api/farmlist-sender/${value}`)
      .then(({ data }) => setFarmlistSender(data))
      .catch(err => console.log(err))
  }

  return (
    <Container>
      <div className="px-5 pt-5 pb-4">
        <h1 className="text-info mb-0">Farmlist Sender</h1>
        <p>
          <span className="font-weight-lighter text-muted font-italic">
            and go beyond top robbers of the week
          </span>{" "}
          🥇
        </p>
      </div>

      <div className="px-5">
        <Form onSubmit={submitHandler}>
          {fl !== null && (
            <Form.Row>
              {fl.map((t, i) => {
                return (
                  <Form.Group as={Col} lg={3} key={i}>
                    {i === 0 ? (
                      <Form.Label className="mt-3">
                        <h5 className="text-info">Which Farmlist</h5>
                      </Form.Label>
                    ) : (
                      <Form.Label className="mt-3">
                        <h5 className="text-info">&nbsp;</h5>
                      </Form.Label>
                    )}
                    {t.map(e => {
                      return (
                        <Form.Check
                          label={e.listName}
                          value={e.listId}
                          type="checkbox"
                          custom
                          id={e.listId}
                          key={e.listId}
                          onClick={checkboxHandler}
                        />
                      )
                    })}
                  </Form.Group>
                )
              })}
            </Form.Row>
          )}

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
                  name="villageId"
                  onChange={inputFormHandler}
                  value={formData.villageId}
                >
                  <option value="" disabled>
                    Choose...
                  </option>
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

            <Form.Group as={Col} lg={3}>
              <Form.Label className="mt-3">
                <h5 className="text-info">Interval</h5>
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  name="interval"
                  onChange={inputFormHandler}
                />
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <i>minute</i>
                  </InputGroup.Text>
                </InputGroup.Prepend>
              </InputGroup>
            </Form.Group>

            <Form.Group as={Col} lg={4}>
              <Form.Label className="mt-3">
                <h5 className="text-info">
                  Fallback Farmlist{" "}
                  <OverlayTrigger
                    key="top"
                    placement="top"
                    overlay={
                      <Tooltip id="tooltip-fallback-farmlist">
                        When single report is red or orange, the village from
                        that report will be moved to this farmlist
                      </Tooltip>
                    }
                  >
                    <span>💡</span>
                  </OverlayTrigger>
                </h5>
              </Form.Label>
              {farmlist === null ? (
                <Form.Control
                  as="select"
                  id="farmlist-custom-select-2"
                  custom
                  disabled
                >
                  <option value="">Choose...</option>
                </Form.Control>
              ) : (
                <Form.Control
                  as="select"
                  id="farmlist-custom-select-2"
                  custom
                  name="redFarmlistId"
                  onChange={inputFormHandler}
                  value={formData.redFarmlistId}
                >
                  <option value="" disabled>
                    Choose...
                  </option>
                  {farmlist.map(f => {
                    return (
                      <option value={f.listId} key={f.listId}>
                        {f.listName}
                      </option>
                    )
                  })}
                </Form.Control>
              )}
            </Form.Group>
          </Form.Row>

          <Button
            variant="info"
            className="mt-2"
            onClick={submitHandler}
            type="submit"
          >
            Add Farmlist Sender
          </Button>
        </Form>
      </div>

      {farmlistSender.length > 0 ? (
        <div className="px-5 mt-5">
          <Table bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Farmlists</th>
                <th>From</th>
                <th>Interval</th>
                <th>Fallback Farmlist</th>
                <th>off / on</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {farmlistSender.map((fls, i) => {
                return (
                  <tr key={fls.id}>
                    <td>{i + 1}</td>
                    <td>
                      {fls.farmlistIds
                        .map(e => farmlist.find(f => f.listId === e).listName)
                        .join(", ")}
                    </td>
                    <td>
                      {villages.find(v => v.villageId === fls.villageId).name}
                    </td>
                    <td>{fls.interval} minutes</td>
                    <td>{farmlist.find(f => f.listId === fls.red).listName}</td>
                    <td>
                      <Form>
                        <Form.Check
                          type="switch"
                          id="custom-switch"
                          value={fls.id}
                          onChange={switchHandler}
                          checked={fls.run}
                        />
                      </Form>
                    </td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        value={fls.id}
                        onClick={deleteButtonHandler}
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
          <p>There is no farmlist sender</p>
        </div>
      )}
    </Container>
  )
}
