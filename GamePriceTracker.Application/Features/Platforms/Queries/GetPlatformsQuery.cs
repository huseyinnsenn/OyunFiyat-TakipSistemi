using GamePriceTracker.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GamePriceTracker.Application.Features.Platforms.Queries
{
    // Veri Modeli (DTO)
    public class PlatformDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }

    // 1. İSTEK
    public class GetPlatformsQuery : IRequest<List<PlatformDto>>
    {
    }

    // 2. İŞLEYİCİ
    public class GetPlatformsQueryHandler : IRequestHandler<GetPlatformsQuery, List<PlatformDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetPlatformsQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<PlatformDto>> Handle(GetPlatformsQuery request, CancellationToken cancellationToken)
        {
            return await _context.Platforms
                .Select(p => new PlatformDto
                {
                    Id = p.Id,
                    Name = p.Name
                })
                .ToListAsync(cancellationToken);
        }
    }
}