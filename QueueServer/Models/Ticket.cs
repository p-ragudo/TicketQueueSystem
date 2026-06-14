namespace QueueServer.Models;

public class Ticket
{
    public required string Id { get; set;}
    public string? UserId { get; set; }
    public int MillisToComplete { get; set; } = 3000;
}