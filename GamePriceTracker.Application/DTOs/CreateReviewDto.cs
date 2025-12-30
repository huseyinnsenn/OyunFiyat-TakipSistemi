namespace GamePriceTracker.Application.DTOs;

public class CreateReviewDto
{
    public int GameId { get; set; }
    public string Content { get; set; } = string.Empty;
    public int Rating { get; set; } // 1-5 arası
}