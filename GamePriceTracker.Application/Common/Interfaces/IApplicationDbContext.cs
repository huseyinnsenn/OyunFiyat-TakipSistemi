using Microsoft.EntityFrameworkCore;
using GamePriceTracker.Domain.Entities;

namespace GamePriceTracker.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Game> Games { get; }
    DbSet<Platform> Platforms { get; }
    DbSet<PriceEntry> PriceEntries { get; }
    DbSet<User> Users { get; }
    DbSet<Review> Reviews { get; } // Eksikti, eklendi
    DbSet<ForumCategory> ForumCategories { get; }
    DbSet<ForumPost> ForumPosts { get; }
    DbSet<ForumReply> ForumReplies { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}