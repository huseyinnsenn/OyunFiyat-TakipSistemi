// GamePriceTracker.Domain/Platform.cs

using System.Collections.Generic;

namespace GamePriceTracker.Domain
{
    public class Platform
    {
        // Temel Anahtar
        public int Id { get; set; }

        // Platformun Adı (örn. "PlayStation 5", "Xbox Series X", "Nintendo Switch")
        public string Name { get; set; }

        // Navigasyon Özelliği: Bu platformdaki tüm fiyat kayıtlarını tutar
        public ICollection<PriceEntry> PriceEntries { get; set; } = new List<PriceEntry>();
    }
}