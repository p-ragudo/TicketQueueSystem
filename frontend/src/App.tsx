import { useState, useEffect } from 'react'
import './App.css'
import { useSignalR } from './context/SingalRContext'
import Window from "./components/Window"

export type Ticket = {
  id: string,
  userId: string | null,
  millisToComplete: number,
  windowNumber: number | null,
  status: string
}

export type WindowWorker = {
  windowNumber: number,
  isAvailable: boolean,
  currentTicket: Ticket | null
}

function App() {
  const { connection, isConnected } = useSignalR();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [windowWorkerStatus, setWindowWorkerStatus] = useState<WindowWorker[]>([])

  const windows = [1, 2, 3]

  useEffect(() => {
    if(!connection) return

    connection.on("SendTransactionStatus", (ticket: Ticket, windowWorker: WindowWorker) => {
      setTickets(prev => {
        const exists = prev.some(t => t.id === ticket.id)

        if(exists) {
          return prev.map(t => t.id === ticket.id ? {...t, status: ticket.status} : t)
        }

        return [...prev, ticket]
      })

      setWindowWorkerStatus(prev => {
        const exists = prev.some(ww => ww.windowNumber === windowWorker.windowNumber)

        if(exists) {
          return prev.map(ww =>  
            ww.windowNumber === windowWorker.windowNumber 
            ? {...ww, isAvailable: windowWorker.isAvailable, currentTicket: null}
            : ww)
        }

        return [...prev, windowWorker]
      })
    })

    return () => {
      connection.off("SendTransactionStatus")
    }
  }, [connection])

  const handleRequestTicket = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/tickets') 
      const newTicket: Ticket = await res.json()

      setTickets(prev => [...prev, newTicket])
    } catch(error) {
      console.error("Failed to request a ticket:", error)
    }
  }

  const mockTicket: Ticket = {
    id: 'T-001',
    userId: null,
    windowNumber: 1,
    status: 'Processing',
    millisToComplete: 5000
  }

  return (
    <>
      <button onClick={handleRequestTicket}>Request Ticket</button>
      {windowWorkerStatus.map(windowWorker => {
        return (
          <div>
            {/* populate windows based on windowWorkerStatus
            windows will also keep track of which ticket they are currently serving or they're free 
            all states are managed by the server */}
          </div>
        )
      })}
    </>
  )
}

export default App
