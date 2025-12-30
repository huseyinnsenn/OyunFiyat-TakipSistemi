namespace GamePriceTracker.Application.DTOs;

public class CreateForumPostDto
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public int ForumCategoryId { get; set; }
}