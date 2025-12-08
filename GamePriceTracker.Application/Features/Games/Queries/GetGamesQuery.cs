using GamePriceTracker.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GamePriceTracker.Application.Features.Games.Queries
{
    // 1. İSTEK: Geriye GameDto listesi dönecek
    public class GetGamesQuery : IRequest<List<GameDto>>
    {
    }

    // 2. İŞLEYİCİ
    public class GetGamesQueryHandler : IRequestHandler<GetGamesQuery, List<GameDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetGamesQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<GameDto>> Handle(GetGamesQuery request, CancellationToken cancellationToken)
        {
            // Veritabanından çekip DTO'ya çeviriyoruz (Select)
            return await _context.Games
                .Select(g => new GameDto
                {
                    Id = g.Id,
                    Title = g.Title,
                    Publisher = g.Publisher,
                    ReleaseDate = g.ReleaseDate
                })
                .ToListAsync(cancellationToken);
        }
    }
}