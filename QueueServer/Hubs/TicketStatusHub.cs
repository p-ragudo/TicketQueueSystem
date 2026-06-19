using Microsoft.AspNetCore.SignalR;
using QueueServer.Models;
using QueueServer.Dtos;

namespace QueueServer.Hubs;

public interface ITicketStatusClient
{
    Task SendTransactionStatus(TransactionStatusDto dto);
    Task SendQueueStatus(QueueInfoDto dto);
}

public sealed class TicketStatusHub : Hub<ITicketStatusClient>
{
    
}