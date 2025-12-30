using GamePriceTracker.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GamePriceTracker.Application.Features.PriceEntries.Queries
{
    // 1. Request
    public record GetPriceEntriesByGameIdQuery(int GameId) : IRequest<List<PriceEntryDto>>;

    // 2. Handler
    public class GetPriceEntriesByGameIdQueryHandler : IRequestHandler<GetPriceEntriesByGameIdQuery, List<PriceEntryDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetPriceEntriesByGameIdQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<PriceEntryDto>> Handle(GetPriceEntriesByGameIdQuery request, CancellationToken cancellationToken)
        {
            return await _context.PriceEntries
                .Where(x => x.GameId == request.GameId)
                .OrderByDescending(x => x.Id) 
                .Select(x => new PriceEntryDto
                {
                    Id = x.Id,
                    Price = x.Price,
                    // Diğer dosyada 'RecordingDate' dediğin için burayı ona uyduruyoruz
                    RecordingDate = x.RecordingDate, 
                    GameId = x.GameId,
                    GameName = x.Game.Title,
                    PlatformName = x.Platform.Name
                })
                .ToListAsync(cancellationToken);
        }
    }
}