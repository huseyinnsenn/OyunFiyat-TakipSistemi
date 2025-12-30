using MediatR;
using GamePriceTracker.Application.Common.Interfaces;

namespace GamePriceTracker.Application.Features.Reviews.Commands;

public record UpdateReviewCommand : IRequest<Unit>
{
    public int Id { get; init; }
    public required string Comment { get; init; }
    public int Rating { get; init; }
}

public class UpdateReviewCommandHandler : IRequestHandler<UpdateReviewCommand, Unit>
{
    private readonly IApplicationDbContext _context;
    public UpdateReviewCommandHandler(IApplicationDbContext context) => _context = context;

    public async Task<Unit> Handle(UpdateReviewCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Reviews.FindAsync(new object[] { request.Id }, cancellationToken);
        if (entity == null) throw new Exception("Yorum bulunamadı!");

        // BURAYI DÜZELTTİM: entity.Comment yerine entity.Content kullandık
        entity.Content = request.Comment; 
        entity.Rating = request.Rating;

        await _context.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}