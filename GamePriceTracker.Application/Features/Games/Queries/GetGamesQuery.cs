using GamePriceTracker.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GamePriceTracker.Application.Features.Games.Queries
{
    public class GetGamesQuery : IRequest<List<GameDto>> 
    { 
        public int? PlatformId { get; set; } 
    }

    public class GetGamesQueryHandler : IRequestHandler<GetGamesQuery, List<GameDto>>
    {
        private readonly IApplicationDbContext _context;
        public GetGamesQueryHandler(IApplicationDbContext context) => _context = context;

        public async Task<List<GameDto>> Handle(GetGamesQuery request, CancellationToken cancellationToken)
        {
            // 🔍 Debug: Backend'e ne geldiğini terminalden takip et (dotnet run ekranında göreceksin)
            Console.WriteLine($"===> Filtreleme İsteği Alındı. Gelen PlatformId: {(request.PlatformId.HasValue ? request.PlatformId.Value : "Boş (Tümü)")}");

            // 1. Sorguyu başlatıyoruz (AsNoTracking okuma hızı sağlar)
            var query = _context.Games.AsNoTracking();

            // 2. PlatformId filtresini uyguluyoruz
            if (request.PlatformId.HasValue && request.PlatformId > 0)
            {
                var targetPlatformId = request.PlatformId.Value;
                query = query.Where(g => g.PlatformId == targetPlatformId);
            }

            // 3. Projeksiyon (Select) işlemini yapıyoruz
            // Not: Select işlemi ToListAsync'den önce yapılmalı ki veritabanı sadece gerekli kolonları çeksin
            var result = await query
                .Select(g => new GameDto {
                    Id = g.Id,
                    Title = g.Title,
                    Publisher = g.Publisher,
                    ReleaseDate = g.ReleaseDate,
                    ImageUrl = g.ImageUrl,
                    
                    // 💰 En güncel fiyatı alt sorgu ile çekiyoruz
                    Price = _context.PriceEntries
                        .Where(p => p.GameId == g.Id)
                        .OrderByDescending(p => p.RecordingDate)
                        .Select(p => p.Price) 
                        .FirstOrDefault() 
                })
                .ToListAsync(cancellationToken);

            return result;
        }
    }
}