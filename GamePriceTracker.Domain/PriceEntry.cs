// GamePriceTracker.Domain/PriceEntry.cs

namespace GamePriceTracker.Domain
{
    // Oyun (Game) ve Platform (Platform) arasında bağlantı kuran ana kayıt
    public class PriceEntry
    {
        public int Id { get; set; }

        // Fiyatın kaydedildiği tarih ve saat
        public DateTime RecordingDate { get; set; }
        
        // Kaydedilen fiyat
        public decimal Price { get; set; }

        // Yabancı Anahtarlar (Foreign Keys)
        public int GameId { get; set; }
        public int PlatformId { get; set; }

        // Navigasyon Özellikleri (EF Core için)
        public Game Game { get; set; }
        public Platform Platform { get; set; }
    }
}