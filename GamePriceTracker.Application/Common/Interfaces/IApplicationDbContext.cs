using GamePriceTracker.Domain;
using Microsoft.EntityFrameworkCore;

namespace GamePriceTracker.Application.Common.Interfaces
{
    // Bu arayüz, Application katmanının veritabanından beklentilerini tanımlar.
    public interface IApplicationDbContext
    {
        DbSet<Game> Games { get; }
        DbSet<Platform> Platforms { get; }
        DbSet<PriceEntry> PriceEntries { get; }

        DbSet<User> Users { get; }

        // Değişiklikleri kaydetme metodu
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }

    
}