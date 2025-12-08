using GamePriceTracker.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GamePriceTracker.Application.Features.PriceEntries.Queries
{
    // DTO: Kullanıcıya göstereceğimiz süslü veri
    public class PriceEntryDto
    {
        public int Id { get; set; }
        public string GameName { get; set; } = string.Empty;     // Oyunun Adı
        public string PlatformName { get; set; } = string.Empty; // Platformun Adı
        public decimal Price { get; set; }
        public DateTime RecordingDate { get; set; }
    }

    public class GetPriceEntriesQuery : IRequest<List<PriceEntryDto>>
    {
    }

    public class GetPriceEntriesQueryHandler : IRequestHandler<GetPriceEntriesQuery, List<PriceEntryDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetPriceEntriesQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<PriceEntryDto>> Handle(GetPriceEntriesQuery request, CancellationToken cancellationToken)
        {
            // Include: "Fiyatı getirirken yanına Oyun ve Platform bilgilerini de ekle" demek.
            return await _context.PriceEntries
                .Include(x => x.Game)
                .Include(x => x.Platform)
                .Select(x => new PriceEntryDto
                {
                    Id = x.Id,
                    GameName = x.Game.Title,       // Oyunun adını buradan alıyoruz
                    PlatformName = x.Platform.Name, // Platform adını buradan alıyoruz
                    Price = x.Price,
                    RecordingDate = x.RecordingDate
                })
                .ToListAsync(cancellationToken);
        }
    }
}