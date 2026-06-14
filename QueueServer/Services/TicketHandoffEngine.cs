using Microsoft.AspNetCore.SignalR;
using QueueServer.Hubs;

namespace QueueServer.Services;

public class TicketHandoffEngine : BackgroundService
{
    private readonly QueueService _schedulerService;
    public List<TicketWindowWorker> TicketWindowWorkers {get; }
    private readonly IHubContext<TicketStatusHub, ITicketStatusClient> _hubContext;
    private readonly ILogger<TicketHandoffEngine> _handoffEngineLogger;
    private readonly ILogger<TicketWindowWorker> _windowWorkerLogger;

    public TicketHandoffEngine(
        QueueService schedulerService, 
        ILoggerFactory handoffEngineLogger, 
        ILoggerFactory windowWorkerLogger,
        IHubContext<TicketStatusHub, ITicketStatusClient> hubContext)
    {
        _schedulerService = schedulerService;
        _handoffEngineLogger = handoffEngineLogger.CreateLogger<TicketHandoffEngine>();
        _windowWorkerLogger = windowWorkerLogger.CreateLogger<TicketWindowWorker>();

        TicketWindowWorkers = [
            new TicketWindowWorker(1, _windowWorkerLogger, hubContext),
            new TicketWindowWorker(2, _windowWorkerLogger, hubContext),
            new TicketWindowWorker(3, _windowWorkerLogger, hubContext)
        ];
    }
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _handoffEngineLogger.LogInformation("Handoff engine started. Monitoring queue...");

        while(!stoppingToken.IsCancellationRequested)
        {
            if(_schedulerService.Queue.IsEmpty) { 
                await Task.Delay(500, stoppingToken); 
                continue;
            }

            var freeWindowWorker = TicketWindowWorkers
                .FirstOrDefault(w => w.IsAvailable && w.CurrentTicket == null);
            
            if(freeWindowWorker == null) { 
                await Task.Delay(200, stoppingToken); 
                continue;
            }

            if(_schedulerService.Queue.TryDequeue(out var ticket))
            {
                _handoffEngineLogger.LogInformation($"\nTicket {ticket.Id} handed off to {freeWindowWorker.WindowNumber}\n");
                _ = freeWindowWorker.AcceptAndProcessTicketAsync(ticket);
            }
        }
    }
}