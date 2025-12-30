namespace GamePriceTracker.Domain.Entities // Klasör yapına uygun hale getir
{
    public class User
    {
        public int Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
        public string Role { get; set; } = "User";

        // HAFTA 6 & 8 İÇİN KRİTİK EKLEME: 
        // Kullanıcının yazdığı postlara ve yorumlara buradan ulaşabilmeliyiz.
        public ICollection<Entities.ForumPost> ForumPosts { get; set; } = new List<Entities.ForumPost>();
        public ICollection<Entities.ForumReply> ForumReplies { get; set; } = new List<Entities.ForumReply>();
    }
}