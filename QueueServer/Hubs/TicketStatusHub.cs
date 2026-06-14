using Microsoft.AspNetCore.SignalR;

namespace QueueServer.Hubs;

public interface ITicketStatusClient
{
    Task TicketProcessingStatus(string processingMessage);
    Task TicketProcessingCompleteStatus(string processingCompleteMessage);
}

public sealed class TicketStatusHub : Hub<ITicketStatusClient>
{
    
}