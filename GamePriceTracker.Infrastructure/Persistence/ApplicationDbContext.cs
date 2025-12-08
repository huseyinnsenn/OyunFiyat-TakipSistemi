using GamePriceTracker.Application.Common.Interfaces; // BU EKLENDİ
using GamePriceTracker.Domain;
using Microsoft.EntityFrameworkCore;

namespace GamePriceTracker.Infrastructure.Persistence
{
    // IApplicationDbContext'i implemente ediyoruz
    public class ApplicationDbContext : DbContext, IApplicationDbContext 
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Game> Games { get; set; }
        public DbSet<Platform> Platforms { get; set; }
        public DbSet<PriceEntry> PriceEntries { get; set; }

        public DbSet<User> Users { get; set; }

        // SaveChangesAsync metodu zaten DbContext içinde var olduğu için 
        // ekstra bir şey yazmamıza gerek yok, otomatik eşleşir.
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}