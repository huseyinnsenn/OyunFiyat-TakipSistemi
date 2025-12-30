using GamePriceTracker.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GamePriceTracker.Application.Features.PriceEntries.Queries
{
    // DTO TANIMINI BURADAN SİLDİK, ÇÜNKÜ PriceEntryDto.cs DOSYASINDA ZATEN VAR.

    public class GetPriceEntriesQuery : IRequest<List<PriceEntryDto>> { }

    public class GetPriceEntriesQueryHandler : IRequestHandler<GetPriceEntriesQuery, List<PriceEntryDto>>
    {
        private readonly IApplicationDbContext _context;
        public GetPriceEntriesQueryHandler(IApplicationDbContext context) => _context = context;

        public async Task<List<PriceEntryDto>> Handle(GetPriceEntriesQuery request, CancellationToken cancellationToken)
        {
            return await _context.PriceEntries
                .Include(x => x.Game)
                .Include(x => x.Platform)
                .Select(x => new PriceEntryDto
                {
                    Id = x.Id,
                    GameName = x.Game.Title,
                    PlatformName = x.Platform != null ? x.Platform.Name : "PC",
                    Price = x.Price,
                    RecordingDate = x.RecordingDate,
                    GameId = x.GameId
                })
                .ToListAsync(cancellationToken);
        }
    }
}