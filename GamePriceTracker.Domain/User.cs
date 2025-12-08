namespace GamePriceTracker.Domain
{
    public class User
    {
        public int Id { get; set; }
        
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        
        // DİKKAT: Buraya asla gerçek şifreyi (örn: "123456") kaydetmeyeceğiz!
        // Onun yerine şifrelenmiş (Hashlenmiş) halini tutacağız.
        public required string PasswordHash { get; set; }

        // Kullanıcının rolü (Admin, User vb.) - Şimdilik basit tutuyoruz
        public string Role { get; set; } = "User";
    }
}