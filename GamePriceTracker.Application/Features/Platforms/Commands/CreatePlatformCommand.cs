using GamePriceTracker.Application.Common.Interfaces;
using GamePriceTracker.Domain;
using MediatR;

namespace GamePriceTracker.Application.Features.Platforms.Commands
{
    // 1. İSTEK
    public class CreatePlatformCommand : IRequest<int>
    {
        public required string Name { get; set; } // Örn: "PlayStation 5"
    }

    // 2. İŞLEYİCİ
    public class CreatePlatformCommandHandler : IRequestHandler<CreatePlatformCommand, int>
    {
        private readonly IApplicationDbContext _context;

        public CreatePlatformCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(CreatePlatformCommand request, CancellationToken cancellationToken)
        {
            var platform = new Platform
            {
                Name = request.Name
            };

            _context.Platforms.Add(platform);
            await _context.SaveChangesAsync(cancellationToken);

            return platform.Id;
        }
    }
}