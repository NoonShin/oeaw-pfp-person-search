import {type SyntheticEvent, useEffect, useState} from 'react'
import axios from 'axios'
import './App.css'
import {Accordion, Button, Container, Form, Modal, Spinner, Tab, Table, Tabs} from "react-bootstrap";
import {getSourceLabel} from "./constants/sources.tsx";

interface Event {
  id : string;
  label : string;
  startDate? : string;
  endDate? : string;
  relatedPlace? : { label: string; lat: number; long: number; id: string };
}

interface SourceData {
  label : string;
  subject : string;
  graph? : string;
  events : Event[];
}

interface SourceBrief {
  label : string,
  source : string
}

interface Result {
  uuid : string,
  sources : Array<SourceBrief>
}

export function UUIDModal({ uuid, show, onHide }: { uuid: string, show: boolean, onHide: () => void }) {
  const [sources, setSources] = useState<SourceData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!show) return;
    setLoading(true);

    axios.get(uuid)
    .then((response) => {
      setSources(response.data.sources)
    })
    .catch((error) => {
      console.log(error)
      setSources([])
    })
    .finally(() => setLoading(false));

  }, [uuid, show]);

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{!loading && sources.map(src => src.label).join(' / ')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center my-3">
            <Spinner animation="border" role="status" />
          </div>
        ) : (
          <Tabs defaultActiveKey={sources[0]?.subject} fill>
            {sources.map((source) => (
              <Tab eventKey={source.subject} title={getSourceLabel(source.subject)} key={source.label} className={"p-3"}>
                <div className="mb-1">
                  <strong>Recorded Name:</strong> {source.label}
                </div>
                <div className="mb-1">
                  <strong>Source URI:</strong> <a href={source.subject} target="_blank" rel="noopener noreferrer">{source.subject}</a>
                </div>
                {source.events.length ? (
                  <p><strong>Recorded Events:</strong></p>
                ) : (
                  <div className="text-center my-3">
                    No event information from this source!
                  </div>
                )
                }
                {source.events.map((ev) => (
                  <div key={ev.id} className="my-1">
                    <div className="mx-4">
                    {ev.label}: {ev.startDate} {(ev.startDate && ev.endDate) ? '  —  ' : ''} {ev.endDate}
                    {ev.relatedPlace && ev.relatedPlace.id && (
                      <div className="mt-2">
                        <iframe
                          width="100%"
                          height="100"
                          style={{ minHeight: '120px', border: 0 }}
                          loading="lazy"
                          allowFullScreen
                          src={`https://maps.google.com/maps?q=${ev.relatedPlace.lat},${ev.relatedPlace.long}&hl=en&z=12&output=embed`}
                        />
                        <div className="text-muted text-center small">{ev.relatedPlace.label}</div>
                      </div>
                    )}
                    </div>
                  </div>
                ))}
              </Tab>
            ))}
          </Tabs>
        )}
      </Modal.Body>
    </Modal>
  );
}

function Results({ data } : {data : Result[]}) {
  const [selectedUUID, setSelectedUUID] = useState<string>('');

  return (
    <Accordion>
      {data.map((result) => (
        <Accordion.Item eventKey={result.uuid} key={result.uuid}>
          <Accordion.Header>
            <span className="header-text">
              {result.sources.map(src => src.label).join(' / ')}
            </span>
          </Accordion.Header>
          <Accordion.Body>
            <p>
              <strong>UUID:</strong> {result.uuid}
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => setSelectedUUID(result.uuid)}
                className="m-2"
              >
                Quick View
              </Button>
            </p>
            <p>
              <strong>Sources:</strong>
            </p>

            <Table >
              <thead>
              <tr>
                <th>Label</th>
                <th>URL</th>
              </tr>
              </thead>
              <tbody>
              {result.sources.map((src, index) => (
                <tr key={index}>
                  <td>{src.label}</td>
                  <td>
                    <a
                      href={src.source}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {src.source}
                    </a>
                  </td>
                </tr>
              ))}
              </tbody>
            </Table>
          </Accordion.Body>
        </Accordion.Item>
      ))}
      <UUIDModal uuid={selectedUUID} onHide={() => setSelectedUUID('')} show={!!selectedUUID} />
    </Accordion>
  )
}

function App() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  function handleSubmit(e : SyntheticEvent) {
    e.preventDefault();

    setLoading(true);
    setNotFound(false);

    const target = e.target as typeof e.target & {
      searchValue: { value: string }
    };
    const label = target.searchValue.value;

    axios.get('https://pfp-api.acdh-ch-dev.oeaw.ac.at/persons', {
      params: {
        page: 1,
        size: 100,
        label: label
      }
    })
    .then((response) => {
      setNotFound(!response.data.items.length)
      setResults(response.data.items)
    })
    .catch((error) => {
      console.log(error);
      setNotFound(true);
    })
    .finally(() => setLoading(false))

  }

  return (
    <Container className="p-3">
      <h2>Person Search - PFP</h2>
      <Form onSubmit={handleSubmit} className="py-3">
        <div className="input-group">
          <Form.Control
            type="text"
            placeholder="Search term..."
            name="searchValue"
          />
          <Button type="submit" style={{minWidth: '120px'}}>Search</Button>
        </div>
      </Form>

      {loading ? (
        <div className="text-center my-3">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <Results data={results} />
      )}
      {notFound && (
        <div className="text-center my-3">No results found!</div>
      )}

    </Container>
  )
}

export default App
