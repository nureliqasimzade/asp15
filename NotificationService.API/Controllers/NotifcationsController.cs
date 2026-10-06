using Microsoft.AspNetCore.Mvc;
using NotificationService.API.Models;
using NotificationService.API.Services;

namespace NotificationService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly IEmailService _emailService;

    public NotificationsController(IEmailService emailService)
    {
        _emailService = emailService;
    }

    [HttpPost]
    public async Task<IActionResult> Send(NotificationRequest request)
    {
        Console.WriteLine("----------------------------------");
        Console.WriteLine("NEW NOTIFICATION");
        Console.WriteLine($"Order Id: {request.OrderId}");
        Console.WriteLine($"Product: {request.ProductName}");
        Console.WriteLine($"Quantity: {request.Quantity}");
        Console.WriteLine($"Total: {request.TotalPrice} AZN");
        Console.WriteLine($"Email: {request.Email}");
        Console.WriteLine("----------------------------------");

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest(new
            {
                message = "Email is required."
            });
        }

        var subject = $"Order #{request.OrderId} confirmed";

        var body = $@"
            <h2>Thank you for your order!</h2>
            <p>Your order has been created successfully.</p>
            <p><b>Order Id:</b> {request.OrderId}</p>
            <p><b>Product:</b> {request.ProductName}</p>
            <p><b>Quantity:</b> {request.Quantity}</p>
            <p><b>Total:</b> {request.TotalPrice} AZN</p>
            <p>MiniShop</p>";

        try
        {
            await _emailService.SendEmailAsync(request.Email, subject, body);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Email error: {ex.Message}");

            return StatusCode(500, new
            {
                message = "Email could not be sent."
            });
        }

        return Ok(new
        {
            message = "Notification sent successfully."
        });
    }
}
