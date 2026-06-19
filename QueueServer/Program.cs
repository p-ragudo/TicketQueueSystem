using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;
using QueueServer.Hubs;
using QueueServer.Models;
using QueueServer.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddSingleton<QueueService>();
builder.Services.AddHostedService<TicketHandoffEngine>();
builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowAll");

app.MapHub<TicketStatusHub>("/hubs/ticket-status");

app.MapGet("/api/tickets", async (
    QueueService queueService,
    ClaimsPrincipal claimsPrincipal) =>
{
    try
    {
        Ticket? ticket = await queueService.RequestTicket();
        ticket.UserId = claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);

        return Results.Ok(ticket);
    }
    catch (Exception e)
    {
        Console.Write($"Error at /ticket endpoint. Error: {e}");
        return Results.Json(new { message = "Failed to create or request a ticket." });
    }
});

app.Run();