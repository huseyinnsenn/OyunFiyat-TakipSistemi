namespace GamePriceTracker.Domain.Entities;

public class ForumReply
{
    public int Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public int ForumPostId { get; set; }
    public ForumPost? ForumPost { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
}