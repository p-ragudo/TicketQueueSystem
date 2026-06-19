using System.Collections.Concurrent;
using Microsoft.Extensions.Logging;
using QueueServer.Models;
using QueueServer.Services;

namespace QueueServer.Tests;

public class TicketSystemTests
{
    // private readonly QueueService _queueService;

    public TicketSystemTests()
    {
        using var loggerFactory = LoggerFactory.Create(builder => builder.AddConsole());
        // _queueService = new QueueService(loggerFactory);
    }

    // [Fact]
    // public async Task CreateTicketsUnderHeavyLoad_ShouldBeUniqueAndMaintainCount()
    // {
    //     int totalRequests = 10_000;
    //     ConcurrentBag<string> ticketIds = new();

    //     var tasks = Enumerable.Range(0, totalRequests).Select(_ => Task.Run(() =>
    //     {
    //         Ticket? ticket = _queueService.RequestTicket();
    //         if(ticket != null)
    //         {
    //             ticketIds.Add(ticket.Id);
    //         }
    //     }));

    //     await Task.WhenAll(tasks);

    //     Assert.Equal(ticketIds.Count, totalRequests);
    //     Assert.Equal(ticketIds.Count, _queueService.Queue.Count);

    //     int uniqueCount = ticketIds.Distinct().Count();
    //     Assert.Equal(uniqueCount, totalRequests);
    // }

    // [Fact]
    // public async Task CreateFourTasks_Worker2ShouldHaveFourthTicket()
    // {
    //     using var loggerFactory = LoggerFactory.Create(builder => builder.AddConsole());
    //     TicketHandoffEngine ticketHandoffEngine = new(_queueService, loggerFactory);

    //     var cts = new CancellationTokenSource();

    //     _queueService.RequestTicket(8000);
    //     _queueService.RequestTicket(1000);
    //     _queueService.RequestTicket(5000);

    //     Task engineTask = ticketHandoffEngine.StartAsync(cts.Token);

    //     await Task.Delay(2000);

    //     _queueService.RequestTicket(3000);
    //     await Task.Delay(500);

    //     var worker2 = _queueService.TicketWindowWorkers.FirstOrDefault(w => w.WindowNumber == 2);

    //     Assert.NotNull(worker2);
    //     Assert.False(worker2.IsAvailable, "Worker 2 should be busy processing Ticket 4");
    //     Assert.NotNull(worker2.CurrentTicket);
    //     Assert.Equal("T-004", worker2.CurrentTicket.Id);

    //     await cts.CancelAsync();
    //     await ticketHandoffEngine.StopAsync(CancellationToken.None);
    // }
}
