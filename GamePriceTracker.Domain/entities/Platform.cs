using System.Collections.Generic;

namespace GamePriceTracker.Domain.Entities
{
    public class Platform
    {
        // Temel Anahtar
        public int Id { get; set; }

        // Platformun Adı (Zorunlu) - 'required' eklendi
        public required string Name { get; set; }

        // Navigasyon Özelliği
        public ICollection<PriceEntry> PriceEntries { get; set; } = new List<PriceEntry>();
    }
}