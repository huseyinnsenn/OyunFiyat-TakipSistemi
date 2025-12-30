using MediatR;
using GamePriceTracker.Application.Common.Interfaces;

namespace GamePriceTracker.Application.Features.Platforms.Commands;

public record DeletePlatformCommand(int Id) : IRequest<Unit>;

public class DeletePlatformCommandHandler : IRequestHandler<DeletePlatformCommand, Unit>
{
    private readonly IApplicationDbContext _context;
    public DeletePlatformCommandHandler(IApplicationDbContext context) => _context = context;

    public async Task<Unit> Handle(DeletePlatformCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Platforms.FindAsync(new object[] { request.Id }, cancellationToken);
        if (entity == null) throw new Exception("Platform bulunamadı!");

        _context.Platforms.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}