using MediatR;
using GamePriceTracker.Application.Common.Interfaces;

namespace GamePriceTracker.Application.Features.PriceEntries.Commands;

public record DeletePriceEntryCommand(int Id) : IRequest<Unit>;

public class DeletePriceEntryCommandHandler : IRequestHandler<DeletePriceEntryCommand, Unit>
{
    private readonly IApplicationDbContext _context;

    public DeletePriceEntryCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(DeletePriceEntryCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.PriceEntries
            .FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null)
            throw new Exception("Silinecek fiyat kaydı bulunamadı!");

        _context.PriceEntries.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}