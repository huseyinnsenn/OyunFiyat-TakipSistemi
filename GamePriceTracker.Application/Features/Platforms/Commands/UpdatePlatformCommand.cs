using MediatR;
using GamePriceTracker.Application.Common.Interfaces;

namespace GamePriceTracker.Application.Features.Platforms.Commands;

public record UpdatePlatformCommand : IRequest<Unit>
{
    public int Id { get; init; }
    public required string Name { get; init; } // Örn: "PlayStation 5" -> "PS5 Slim"
}

public class UpdatePlatformCommandHandler : IRequestHandler<UpdatePlatformCommand, Unit>
{
    private readonly IApplicationDbContext _context;
    public UpdatePlatformCommandHandler(IApplicationDbContext context) => _context = context;

    public async Task<Unit> Handle(UpdatePlatformCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Platforms.FindAsync(new object[] { request.Id }, cancellationToken);
        if (entity == null) throw new Exception("Platform bulunamadı!");

        entity.Name = request.Name;
        await _context.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}