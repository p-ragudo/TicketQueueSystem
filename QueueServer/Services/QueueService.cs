using System.Collections.Concurrent;
using QueueServer.Common;
using QueueServer.Models;

namespace QueueServer.Services;

public class QueueService
{
    public ConcurrentQueue<Ticket> Queue {get; } = new();
    private int _ticketCounter = 0;
    public ILogger<WindowWorkerService> _logger;

    public QueueService(ILoggerFactory logger)
    {
        _logger = logger.CreateLogger<WindowWorkerService>();
    }

    private Ticket? CreateTicket()
    {
        try
        {
            int nextId = Interlocked.Increment(ref _ticketCounter);
            int secondsToComplete = Utils.GenerateRandomMiliseconds(3000, 8000, 1000);

            Ticket ticket = new() { 
                Id = $"T-{nextId:D3}" ,
                MillisToComplete = secondsToComplete
            };

            return ticket;
        }
        catch
        {
            throw new Exception();
        }
    }

    private Ticket? CreateTicket(int secondsToComplete)
    {
        try
        {
            int nextId = Interlocked.Increment(ref _ticketCounter);

            Ticket ticket = new() { 
                Id = $"T-{nextId:D3}" ,
                MillisToComplete = secondsToComplete
            };

            return ticket;
        }
        catch
        {
            throw new Exception();
        }
    }

    private void AddTicketToQueue(Ticket ticket)
    {
        try
        {
            Queue.Enqueue(ticket);  
        }
        catch
        {
            throw new Exception();
        }
    } 

    public Ticket? RequestTicket()
    {
        try
        {
            Ticket? ticket = CreateTicket();
            AddTicketToQueue(ticket);

            return ticket;
        }
        catch
        {
            throw new Exception();
        }
    }

    public Ticket? RequestTicket(int secondsToComplete)
    {
        try
        {
            Ticket? ticket = CreateTicket(secondsToComplete);
            AddTicketToQueue(ticket);

            return ticket;
        }
        catch
        {
            throw new Exception();
        }
    }
}