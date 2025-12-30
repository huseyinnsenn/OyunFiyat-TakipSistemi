using MediatR;
using GamePriceTracker.Application.Common.Interfaces;

namespace GamePriceTracker.Application.Features.Games.Commands;

public record DeleteGameCommand(int Id) : IRequest<Unit>;

public class DeleteGameCommandHandler : IRequestHandler<DeleteGameCommand, Unit>
{
    private readonly IApplicationDbContext _context;
    public DeleteGameCommandHandler(IApplicationDbContext context) => _context = context;

    public async Task<Unit> Handle(DeleteGameCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Games.FindAsync(new object[] { request.Id }, cancellationToken);
        
        if (entity == null) throw new Exception("Silinecek oyun bulunamadı!");

        _context.Games.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}