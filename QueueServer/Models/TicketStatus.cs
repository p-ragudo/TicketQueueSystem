namespace QueueServer.Models;

public record TicketStatus
{
    public required string TicketId { get; set; }
    public string? UserId { get; set; }
    public required int? WindowNumber { get; set; }
    public string Status { get; set; } = TicketStatusStates.InQueue.ToString();
}

public enum TicketStatusStates
{
    InQueue,
    Processing,
    Done
}