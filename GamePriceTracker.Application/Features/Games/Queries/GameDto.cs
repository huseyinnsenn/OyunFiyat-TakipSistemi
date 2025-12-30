public class GameDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Publisher { get; set; } = string.Empty;
    public DateTime ReleaseDate { get; set; }
    public string? ImageUrl { get; set; }
    
    // 💰 Bu satırı ekle:
    public decimal Price { get; set; } 
}