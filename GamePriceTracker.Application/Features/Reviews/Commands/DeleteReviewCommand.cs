using MediatR;
using GamePriceTracker.Application.Common.Interfaces;

namespace GamePriceTracker.Application.Features.Reviews.Commands;

public record DeleteReviewCommand(int Id) : IRequest<Unit>;

public class DeleteReviewCommandHandler : IRequestHandler<DeleteReviewCommand, Unit>
{
    private readonly IApplicationDbContext _context;
    public DeleteReviewCommandHandler(IApplicationDbContext context) => _context = context;

    public async Task<Unit> Handle(DeleteReviewCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Reviews.FindAsync(new object[] { request.Id }, cancellationToken);
        if (entity == null) throw new Exception("Yorum bulunamadı!");

        _context.Reviews.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}