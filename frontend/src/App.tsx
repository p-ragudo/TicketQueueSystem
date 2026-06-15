import { useState, useEffect } from 'react'
import './App.css'
import { useSignalR } from './context/SingalRContext'

type Ticket = {
  id: string,
  millisToComplete: number
}

type TicketStatus = {
  ticketId: string,
  userId: string | null,
  windowNumber: number,
  status: string
}

function App() {
  const { connection, isConnected } = useSignalR();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const [ticketStatus, setTicketStatus] = useState<TicketStatus[]>([]);

  useEffect(() => {
    if(!connection) return

    connection.on("TicketProcessingStatus", (ticketStatus: TicketStatus) => {
      setTicketStatus(prev => [...prev, ticketStatus])
    })

    connection.on("TicketProcessingCompleteStatus", (ticketStatus: TicketStatus) => {
      setTicketStatus(prev =>{
        return prev.map(t => t.ticketId === ticketStatus.ticketId ? {...t, status: ticketStatus.status} : t)
      })
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
      {tickets.map(ticket => {
        return (
            <div key={ticket.id} className="mb-10">
              <p>{ticket.id}</p>
              <p>seconds to complete: {ticket.millisToComplete / 1000}</p>
              <p>Window Number assigned: {ticketStatus.find(s => s.ticketId === ticket.id)?.windowNumber || "Unassigned..."}</p>
              <p>Status: {ticketStatus.find(s => s.ticketId === ticket.id)?.status || "In queue..."}</p>
            </div>
        )
      })}
    </>
  )
}

export default App
