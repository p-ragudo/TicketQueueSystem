using Microsoft.AspNetCore.SignalR;
using QueueServer.Models;
using QueueServer.Dtos;

namespace QueueServer.Hubs;

public interface ITicketStatusClient
{
    Task SendTransactionStatus(TransactionStatusDto dto);
}

public sealed class TicketStatusHub : Hub<ITicketStatusClient>
{
    
}