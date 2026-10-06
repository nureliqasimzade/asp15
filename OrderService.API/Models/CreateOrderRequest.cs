using System.ComponentModel.DataAnnotations;

namespace OrderService.API.Models;

public class CreateOrderRequest
{
    public int ProductId { get; set; }

    public int Quantity { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}
