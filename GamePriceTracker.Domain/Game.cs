// GamePriceTracker.Domain/Game.cs

using System.Collections.Generic;

namespace GamePriceTracker.Domain
{
    public class Game
    {
        // Temel Anahtar (Primary Key)
        public int Id { get; set; } 

        // Oyunun Adı (Zorunlu)
        public string Title { get; set; }

        // Oyunun Yayıncısı (Opsiyonel)
        public string Publisher { get; set; }

        // Oyunun Çıkış Tarihi
        public DateTime ReleaseDate { get; set; }

        // Navigasyon Özelliği: Oyunun hangi platformlarda olduğunu gösterir
        // Bu, EF Core ile ilişki kurmak için kullanılır (Çoktan Çoka veya Bire Çok)
        public ICollection<PriceEntry> PriceEntries { get; set; } = new List<PriceEntry>(); 
    }
}