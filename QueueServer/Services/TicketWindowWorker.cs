using Microsoft.AspNetCore.SignalR;
using QueueServer.Hubs;
using QueueServer.Models;

namespace QueueServer.Services;

public class TicketWindowWorker
{
    public int WindowNumber { get; set; }
    public bool IsAvailable { get; set; } = true;
    public Ticket? CurrentTicket { get; set; }

    private readonly ILogger<TicketWindowWorker> _logger;
    private readonly IHubContext<TicketStatusHub, ITicketStatusClient> _hubContext;

    public TicketWindowWorker(int windowNumber, ILogger<TicketWindowWorker> logger, IHubContext<TicketStatusHub, ITicketStatusClient> hubContext)
    {
        WindowNumber = windowNumber;
        _logger = logger;
        _hubContext = hubContext;
    }

    public async Task AcceptAndProcessTicketAsync(Ticket ticket)
    {
        await _hubContext.Clients.All.TicketProcessingStatus(
            new TicketStatus
            {
                TicketId = ticket.Id,
                WindowNumber = WindowNumber,
                Status = TicketStatusStates.Processing.ToString()
            }
        );

        IsAvailable = false;
        CurrentTicket = ticket;

        await Task.Delay(ticket.MillisToComplete);
        await _hubContext.Clients.All.TicketProcessingCompleteStatus(
            new TicketStatus
            {
                TicketId = ticket.Id,
                WindowNumber = WindowNumber,
                Status = TicketStatusStates.Done.ToString()
            }
        );
        _logger.LogInformation($"\nWindow {WindowNumber}: Done processing ticket {ticket.Id}\n");

        IsAvailable = true;
        CurrentTicket = null;
    }
}