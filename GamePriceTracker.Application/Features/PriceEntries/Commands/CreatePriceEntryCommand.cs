using GamePriceTracker.Application.Common.Interfaces;
using GamePriceTracker.Domain.Entities;
using MediatR;

namespace GamePriceTracker.Application.Features.PriceEntries.Commands
{
    public class CreatePriceEntryCommand : IRequest<int>
    {
        public int GameId { get; set; }      // Hangi Oyun? (Örn: 1)
        public int PlatformId { get; set; }  // Hangi Platform? (Örn: 1)
        public decimal Price { get; set; }   // Kaç Para?
    }

    public class CreatePriceEntryCommandHandler : IRequestHandler<CreatePriceEntryCommand, int>
    {
        private readonly IApplicationDbContext _context;

        public CreatePriceEntryCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(CreatePriceEntryCommand request, CancellationToken cancellationToken)
        {
            var entity = new PriceEntry
            {
                GameId = request.GameId,
                PlatformId = request.PlatformId,
                Price = request.Price,
                RecordingDate = DateTime.UtcNow
            };

            _context.PriceEntries.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }
}