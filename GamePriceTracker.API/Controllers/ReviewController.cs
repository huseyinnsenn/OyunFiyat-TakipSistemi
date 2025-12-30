using GamePriceTracker.Application.DTOs;
using GamePriceTracker.Domain.Entities;
using GamePriceTracker.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using GamePriceTracker.Application.Features.Reviews.Commands;
using MediatR;

namespace GamePriceTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] 
public class ReviewController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IMediator _mediator;

    public ReviewController(ApplicationDbContext context, IMediator mediator)
    {
        _context = context;
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateReview(CreateReviewDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized("Kullanıcı bilgisi bulunamadı.");
        
        var userId = int.Parse(userIdClaim.Value);

        var existingReview = await _context.Reviews
            .AnyAsync(r => r.GameId == dto.GameId && r.UserId == userId);

        if (existingReview)
            return BadRequest("Bu oyuna zaten bir yorum bırakmışsınız.");

        var review = new Review
        {
            GameId = dto.GameId,
            UserId = userId,
            Content = dto.Content,
            Rating = dto.Rating,
            CreatedDate = DateTime.UtcNow
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync(); // 👈 Doğru olan satır bu, diğerini sildim.

        return Ok(new { message = "Yorum başarıyla eklendi!", reviewId = review.Id });
    }

    [HttpGet("game/{gameId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetReviewsByGame(int gameId)
    {
        var reviews = await _context.Reviews
            .Where(r => r.GameId == gameId)
            .Select(r => new {
                r.Id,
                r.Content,
                r.Rating,
                r.CreatedDate,
                UserEmail = r.User != null ? r.User.Email : "Anonim"
            })
            .ToListAsync();

        return Ok(reviews);
    }

    [HttpGet("game/{gameId}/stats")]
    [AllowAnonymous]
    public async Task<IActionResult> GetGameStats(int gameId)
    {
        var reviews = await _context.Reviews
            .Where(r => r.GameId == gameId)
            .ToListAsync();

        if (!reviews.Any())
        {
            return Ok(new { averageRating = 0, totalReviews = 0 });
        }

        var average = reviews.Average(r => r.Rating);
        var total = reviews.Count;

        return Ok(new { 
            averageRating = Math.Round(average, 1),
            totalReviews = total 
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateReviewCommand command)
    {
        if (id != command.Id) return BadRequest("ID uyuşmazlığı!");
        await _mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _mediator.Send(new DeleteReviewCommand(id));
        return NoContent();
    }
}