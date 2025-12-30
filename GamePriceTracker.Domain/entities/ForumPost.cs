using System.ComponentModel.DataAnnotations.Schema;

namespace GamePriceTracker.Domain.Entities;

[Table("ForumPosts")] // Tablo isminin büyük/küçük harf hatasını önler
public class ForumPost
{

    public int Id { get; set; }
    

    public string Title { get; set; } = string.Empty;
    

    public string Content { get; set; } = string.Empty;
    

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;


    public int UserId { get; set; }
    public User? User { get; set; }

    // 🎯 DÜZELTİLEN YER: Görseldeki (image_97e3ec.jpg) ismin aynısını yazdık

    public int ForumCategoryId { get; set; }
    public ForumCategory? Category { get; set; }

    public ICollection<ForumReply> Replies { get; set; } = new List<ForumReply>();
}