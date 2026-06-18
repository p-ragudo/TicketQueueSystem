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

type TransactionStatusDto = {
  ticket: Ticket,
  windowWorker: WindowWorker
}

function App() {
  const windows = [1, 2, 3]

  const { connection } = useSignalR();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [windowWorkers, setWindowWorkers] = useState<WindowWorker[]>(
    windows.map(num => ({
      windowNumber: num,
      isAvailable: true,
      currentTicket: null
    }))
  )

  useEffect(() => {
    if(!connection) return

    connection.on("SendTransactionStatus", (dto: TransactionStatusDto) => {
      const { ticket, windowWorker } = dto

      setTickets(prev => {
        const exists = prev.some(t => t.id === ticket.id)

        if(exists) {
          return prev.map(t => t.id === ticket.id 
            ? { ...ticket } 
            : t)
        }

        return [...prev, ticket]
      })

      setWindowWorkers(prev => {
        const exists = prev.some(ww => ww.windowNumber === windowWorker.windowNumber)

        if(exists) {
          return prev.map(ww => ww.windowNumber === windowWorker.windowNumber 
            ? { ...windowWorker }
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

  return (
    <>
      <button 
        onClick={handleRequestTicket}
        className='mb-10'
      >
        Request Ticket
      </button>

      <div className='w-full flex flex-row justify-around'>
        <div>
          {windowWorkers.map(windowWorker => {
            const ticket = windowWorker.currentTicket

            return (
              <div className='mb-20' key={windowWorker.windowNumber}>
                <Window 
                  windowWorker={windowWorker} 
                  ticket={ticket ?? null} 
                />
              </div>
            )
          })}
        </div>

        <div>
          <p>Queue</p>
          {tickets.map(ticket => ticket.status === "InQueue"
            ? <div className='flex flex-row gap-5'>
                <p>{ticket.id}: </p>
                <p>{ticket.status}</p>
              </div>
            : <></>
          )}
        </div>

        <div>
          <p>Done</p>
          {tickets.map(ticket => ticket.status === "Done"
            ? <p>{ticket.id}</p>
            : <></>
          )}
        </div>
      </div>
    </>
  )
}

export default App
