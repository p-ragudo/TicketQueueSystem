using Microsoft.AspNetCore.SignalR;
using QueueServer.Models;

namespace QueueServer.Hubs;

public interface ITicketStatusClient
{
    Task TicketProcessingStatus(TicketStatus ticketStatus);
    Task TicketProcessingCompleteStatus(TicketStatus ticketStatus);
}

public sealed class TicketStatusHub : Hub<ITicketStatusClient>
{
    
}