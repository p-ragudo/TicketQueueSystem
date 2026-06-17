import type { Ticket, WindowWorker } from "../App"

interface WindowProp {
    windowWorker: WindowWorker,
    ticket: Ticket | null,
}

const Window = ({windowWorker, ticket}: WindowProp) => {
  return (
    <div>
      <p>Window {windowWorker.windowNumber}</p>
      {ticket ? (
        <div>
            <p>Ticket: {ticket.id}</p>
            <p>Status: {ticket.status}</p>
        </div>
      ) : (
        <p>Free</p>
      )}
    </div>
  )
}

export default Window
