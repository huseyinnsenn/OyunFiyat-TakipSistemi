using MediatR;
using GamePriceTracker.Application.Common.Interfaces;

namespace GamePriceTracker.Application.Features.PriceEntries.Commands;

public record UpdatePriceEntryCommand : IRequest<Unit>
{
    public int Id { get; init; }
    public decimal Price { get; init; }
}

public class UpdatePriceEntryCommandHandler : IRequestHandler<UpdatePriceEntryCommand, Unit>
{
    private readonly IApplicationDbContext _context;
    public UpdatePriceEntryCommandHandler(IApplicationDbContext context) => _context = context;

    public async Task<Unit> Handle(UpdatePriceEntryCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.PriceEntries.FindAsync(new object[] { request.Id }, cancellationToken);
        if (entity == null) throw new Exception("Fiyat kaydı bulunamadı!");

        entity.Price = request.Price;
        entity.RecordingDate = DateTime.UtcNow; // Güncelleme tarihini yeniliyoruz

        await _context.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}