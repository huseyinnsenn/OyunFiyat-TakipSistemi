using GamePriceTracker.Application.Common.Interfaces;
using GamePriceTracker.Domain;
using MediatR;

namespace GamePriceTracker.Application.Features.Games.Commands
{
    // 1. İSTEK (REQUEST)
    public class CreateGameCommand : IRequest<int>
    {
        public required string Title { get; set; }
        public required string Publisher { get; set; }
        public DateTime ReleaseDate { get; set; }
    }

    // 2. İŞLEYİCİ (HANDLER)
    // Artık IApplicationDbContext arayüzünü kullanıyoruz!
    public class CreateGameCommandHandler : IRequestHandler<CreateGameCommand, int>
    {
        private readonly IApplicationDbContext _context;

        // Constructor Injection ile veritabanı arayüzünü alıyoruz
        public CreateGameCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(CreateGameCommand request, CancellationToken cancellationToken)
        {
            // Yeni oyun nesnesi oluştur
            var game = new Game
            {
                Title = request.Title,
                Publisher = request.Publisher,
                ReleaseDate = request.ReleaseDate.ToUniversalTime()
            };

            // Veritabanına ekle (Arayüz üzerinden)
            _context.Games.Add(game);

            // Kaydet
            await _context.SaveChangesAsync(cancellationToken);

            // Yeni oluşan ID'yi döndür
            return game.Id;
        }
    }
}