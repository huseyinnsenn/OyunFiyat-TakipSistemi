namespace GamePriceTracker.Domain.Entities;
public class Review
{
    public int Id { get; set; }
    public string Content { get; set; } = string.Empty; // Yorum metni
    public int Rating { get; set; } // 1 ile 5 arası puan
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    // İlişkiler
    public int GameId { get; set; }
    public Game? Game { get; set; }

    public int UserId { get; set; }
    public User? User { get; set; }
}