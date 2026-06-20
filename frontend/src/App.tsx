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

type QueueInfoDto = {
  queue: Ticket[],
  totalWaiting: number
}

function App() {
  const windows = [1, 2, 3]

  const { connection } = useSignalR();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [queue, setQueue] = useState<Ticket[]>([]);
  const [totalWaiting, setTotalWaiting] = useState<number>(0)
  const [completedTickets, updateCompletedTickets] = useState<Ticket[]>([])
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

      updateCompletedTickets(prev => {
        if(ticket.status === "Done") {
          return [...prev, ticket]
        } else {
          return prev
        }
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

    connection.on("SendQueueStatus", (dto: QueueInfoDto) => {
      const { queue, totalWaiting } = dto;

      setQueue(queue)
      setTotalWaiting(totalWaiting)
    })

    return () => {
      connection.off("SendTransactionStatus")
      connection.off("SendQueueStatus")
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
    <div className='p-5 flex flex-col gap-10'>
      <div className='flex justify-around'>
        {windowWorkers.map(windowWorker => {
          const ticket = windowWorker.currentTicket

          return (
            <div key={windowWorker.windowNumber}>
              <Window 
                windowWorker={windowWorker} 
                ticket={ticket ?? null} 
              />
            </div>
          )
        })}
      </div>

      <div className='w-full text-center'>
        <button 
          onClick={handleRequestTicket}
          className='px-10 py-2'
        >
          Request Ticket
        </button>
      </div>

      <div className='grid grid-cols-2 w-full justify-start'>
        <div className='mr-2.5'>
          <div className='flex w-full border-solid border-1 justify-around'>
            <p>Queue</p>
            <p>Total Waiting: {totalWaiting}</p>
          </div>
          {queue.map(ticket => (
            <div key={ticket.id}>
              <p>{ticket.id}</p>
              <p>{ticket.status}</p>
            </div>
          ))}
        </div>

        <div className='border-solid border-1 ml-2.5'>
          <p>Done</p>
          {completedTickets.map(ticket => (
            <div>
              <p>{ticket.id}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default App
