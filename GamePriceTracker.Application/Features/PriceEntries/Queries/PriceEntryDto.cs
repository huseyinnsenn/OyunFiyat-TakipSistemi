using System;

namespace GamePriceTracker.Application.Features.PriceEntries.Queries
{
    public class PriceEntryDto
    {
        public int Id { get; set; }
        public int GameId { get; set; }
        public decimal Price { get; set; }
        
        // Eksik olan ve hata veren tüm alanları buraya ekliyoruz:
        public string GameName { get; set; } = string.Empty;
        public string PlatformName { get; set; } = string.Empty;
        public DateTime RecordingDate { get; set; }
    }
}