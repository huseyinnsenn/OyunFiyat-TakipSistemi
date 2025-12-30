using MediatR;
using GamePriceTracker.Application.Common.Interfaces;
using GamePriceTracker.Domain.Entities;

namespace GamePriceTracker.Application.Features.Games.Commands;

public record UpdateGameCommand : IRequest<Unit>
{
    public int Id { get; init; }
    public required string Title { get; init; }
    public required string Publisher { get; init; }
    public DateTime ReleaseDate { get; init; }
    public string? ImageUrl { get; init; } // 🆕 Image güncellemesi için
    public decimal Price { get; init; } // 🆕 Güncel fiyat
    public int PlatformId { get; init; } // 🆕 Platform bilgisi
}

public class UpdateGameCommandHandler : IRequestHandler<UpdateGameCommand, Unit>
{
    private readonly IApplicationDbContext _context;
    public UpdateGameCommandHandler(IApplicationDbContext context) => _context = context;

    public async Task<Unit> Handle(UpdateGameCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Games.FindAsync(new object[] { request.Id }, cancellationToken);
        
        if (entity == null) throw new Exception("Güncellenecek oyun bulunamadı!");

        // 1. Temel Bilgileri Güncelle
        entity.Title = request.Title;
        entity.Publisher = request.Publisher;
        entity.ReleaseDate = request.ReleaseDate.ToUniversalTime();
        entity.ImageUrl = request.ImageUrl;
        entity.PlatformId = request.PlatformId;

        // 2. 🆕 Yeni Fiyat Girişi Ekle (Fiyat tarihçesi oluşması için)
        var newPrice = new PriceEntry
        {
            GameId = request.Id,
            Price = request.Price,
            RecordingDate = DateTime.UtcNow,
            PlatformId = request.PlatformId
        };

        _context.PriceEntries.Add(newPrice);
        
        await _context.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}