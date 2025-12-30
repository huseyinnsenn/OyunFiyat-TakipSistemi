using GamePriceTracker.Application.Common.Interfaces;
using GamePriceTracker.Domain.Entities;
using MediatR;

namespace GamePriceTracker.Application.Features.Games.Commands
{
    public class CreateGameCommand : IRequest<int>
    {
        public required string Title { get; set; }
        public required string Publisher { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string? ImageUrl { get; set; }
        public decimal Price { get; set; } // 🆕 Frontend'den gelen fiyat
        public int PlatformId { get; set; } // 🆕 Hangi platforma ait olduğu
    }

    public class CreateGameCommandHandler : IRequestHandler<CreateGameCommand, int>
    {
        private readonly IApplicationDbContext _context;

        public CreateGameCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(CreateGameCommand request, CancellationToken cancellationToken)
        {
            // 1. Önce Oyunu Oluştur
            var game = new Game
            {
                Title = request.Title, 
                Publisher = request.Publisher,
                ReleaseDate = request.ReleaseDate.ToUniversalTime(),
                ImageUrl = request.ImageUrl,
                PlatformId = request.PlatformId // Oyunun platformunu set et
            };

            _context.Games.Add(game);
            await _context.SaveChangesAsync(cancellationToken);

            // 2. 🆕 Fiyat Kaydını At (Loglarda eksik olan ve Price=0 çıkmasına sebep olan kısım)
            var priceEntry = new PriceEntry
            {
                GameId = game.Id, // Az önce oluşan Id
                Price = request.Price,
                RecordingDate = DateTime.UtcNow,
                PlatformId = request.PlatformId
            };

            _context.PriceEntries.Add(priceEntry);
            await _context.SaveChangesAsync(cancellationToken);

            return game.Id;
        }
    }
}