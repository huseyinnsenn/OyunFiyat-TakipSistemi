using System;

namespace GamePriceTracker.Domain.Entities; // Noktalı virgül kalsın, süslü parantezleri kaldırdık

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
    // = null!; ifadesi derleyiciye "bu değer çalışma anında atanacak" garantisi verir.
    public Game Game { get; set; } = null!;
    public Platform Platform { get; set; } = null!;
}