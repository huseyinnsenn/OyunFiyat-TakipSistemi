using GamePriceTracker.Application.Common.Interfaces; 
using GamePriceTracker.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GamePriceTracker.Infrastructure.Persistence;

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
    public DbSet<Review> Reviews { get; set; }
    public DbSet<ForumCategory> ForumCategories { get; set; }
    public DbSet<ForumPost> ForumPosts { get; set; }
    public DbSet<ForumReply> ForumReplies { get; set; }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return base.SaveChangesAsync(cancellationToken);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // --- 👤 USER (KULLANICI) EŞLEME ---
        // Login hatasını (u.id bulunamadı) bu kısım çözer
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            entity.Property(e => e.Id).HasColumnName("Id");
            entity.Property(e => e.FirstName).HasColumnName("FirstName");
            entity.Property(e => e.LastName).HasColumnName("LastName");
            entity.Property(e => e.Email).HasColumnName("Email");
            entity.Property(e => e.PasswordHash).HasColumnName("PasswordHash");
            entity.Property(e => e.Role).HasColumnName("Role");
        });

        // --- 🎯 FORUM POST EŞLEME ---
        modelBuilder.Entity<ForumPost>(entity =>
        {
            entity.ToTable("ForumPosts");
            entity.Property(e => e.Id).HasColumnName("Id");
            entity.Property(e => e.Title).HasColumnName("Title");
            entity.Property(e => e.Content).HasColumnName("Content");
            entity.Property(e => e.CreatedDate).HasColumnName("CreatedDate");
            entity.Property(e => e.UserId).HasColumnName("UserId");
            entity.Property(e => e.ForumCategoryId).HasColumnName("ForumCategoryId");
        });

        // --- ⭐ REVIEW (YORUM) EŞLEME ---
        // Yorum hatasını (r.gameid bulunamadı) bu kısım çözer
        modelBuilder.Entity<Review>(entity =>
        {
            entity.ToTable("Reviews"); 
            entity.Property(e => e.Id).HasColumnName("Id");
            entity.Property(e => e.Content).HasColumnName("Content");
            entity.Property(e => e.Rating).HasColumnName("Rating");
            entity.Property(e => e.GameId).HasColumnName("GameId"); // Kritik
            entity.Property(e => e.UserId).HasColumnName("UserId"); // Kritik
            entity.Property(e => e.CreatedDate).HasColumnName("CreatedDate");
        });

        // --- 💰 PRICE ENTRY EŞLEME ---
        modelBuilder.Entity<PriceEntry>(entity =>
        {
            entity.ToTable("PriceEntries");
            entity.Property(e => e.Id).HasColumnName("Id");
            entity.Property(e => e.Price).HasColumnName("Price");
            entity.Property(e => e.RecordingDate).HasColumnName("RecordingDate");
            entity.Property(e => e.GameId).HasColumnName("GameId");
            entity.Property(e => e.PlatformId).HasColumnName("PlatformId");
        });

        // Seed Data
        modelBuilder.Entity<ForumCategory>().HasData(
            new ForumCategory { Id = 1, Name = "Genel Sohbet", Description = "Oyunlar hakkında her şey." },
            new ForumCategory { Id = 2, Name = "Donanım Tavsiyeleri", Description = "PC ve Konsol donanımları." },
            new ForumCategory { Id = 3, Name = "Oyun Önerileri", Description = "Ne oynasam diyenler için." }
        );

        // İlişki Yapılandırması
        modelBuilder.Entity<ForumPost>()
            .HasOne(p => p.User)
            .WithMany(u => u.ForumPosts)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}