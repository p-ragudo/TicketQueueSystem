import { useState, useEffect } from 'react'
import './App.css'
import { useSignalR } from './context/SingalRContext'

type Ticket = {
  id: string,
  millisToComplete: number
}

function App() {
  const { connection, isConnected } = useSignalR();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const [processingState, setProcessingState] = useState("");

  useEffect(() => {
    if(!connection) return

    connection.on("TicketProcessingStatus", (processingMessage: string) => {
      setProcessingState(processingMessage)
    })

    connection.on("TicketProcessingCompleteStatus", (processingCompleteMessage: string) => {
      setProcessingState(processingCompleteMessage)
    })

    return () => {
      connection.off("TicketProcessingStatus")
      connection.off("TicketProcessingCompleteStatus")
    }
  }, [connection])

  const onRequestTicket = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/tickets') 
      const newTicket: Ticket = await res.json()

      setTickets(prev => [...prev, newTicket])
    } catch(error) {
      console.error("Failed to request a ticket:", error)
    }
  }

  return (
    <>
      <button onClick={onRequestTicket}>Request ticket</button>
      <h3 className="text-2xl">Tickets</h3>
      <div className="flex flex-col gap-2">
        {tickets.map(ticket => {
          return (
              <div key={ticket.id}>
                <p>{ticket.id}</p>
                <p>seconds to complete: {ticket.millisToComplete / 1000}</p>
                <p>Status: {processingState}</p>
              </div>
          )
        })}
      </div>
    </>
  )
}

export default App
