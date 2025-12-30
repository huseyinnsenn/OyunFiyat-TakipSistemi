namespace GamePriceTracker.Domain.Entities;

public class ForumCategory
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    
    // İlişki: Bir kategoride birden fazla post olabilir
    public ICollection<ForumPost> Posts { get; set; } = new List<ForumPost>();
}