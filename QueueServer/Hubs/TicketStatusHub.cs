using Microsoft.AspNetCore.SignalR;

namespace QueueServer.Hubs;

public interface ITicketStatusClient
{
    Task TicketProcessingStatus(string ticketId, string processingMessage);
    Task TicketProcessingCompleteStatus(string ticketId, string processingCompleteMessage);
}

public sealed class TicketStatusHub : Hub<ITicketStatusClient>
{
    
}