using GamePriceTracker.Application.DTOs;
using GamePriceTracker.Domain.Entities;
using GamePriceTracker.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace GamePriceTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ForumController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    public ForumController(ApplicationDbContext context) => _context = context;

    // 1. KATEGORİLERİ LİSTELE
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories() 
    {
        return Ok(await _context.ForumCategories.ToListAsync());
    }
    // 2. KONU AÇ (Kullanıcı Entegrasyonu)
    [HttpPost("post")]
    [Authorize]
    public async Task<IActionResult> CreatePost(CreateForumPostDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var post = new ForumPost {
            Title = dto.Title, Content = dto.Content,
            ForumCategoryId = dto.ForumCategoryId, UserId = userId,
            CreatedDate = DateTime.UtcNow
        };
        _context.ForumPosts.Add(post);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Konu oluşturuldu", postId = post.Id });
    }

    // 3. KONUYA YORUM YAZ (Hafta 6 Comment Maddesi)
    [HttpPost("post/{postId}/comment")]
    [Authorize]
    public async Task<IActionResult> AddComment(int postId, [FromBody] string content)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var comment = new ForumReply {
            ForumPostId = postId, Content = content,
            UserId = userId, CreatedDate = DateTime.UtcNow
        };
        _context.ForumReplies.Add(comment);
        await _context.SaveChangesAsync();
        return Ok("Yorum eklendi.");
    }

    // 4. KONU SİL (Admin Moderasyon Maddesi)
    [HttpDelete("post/{id}")]
    [Authorize(Roles = "Admin")] 
    public async Task<IActionResult> DeletePost(int id)
    {
        var post = await _context.ForumPosts.FindAsync(id);
        if (post == null) return NotFound();
        
        _context.ForumPosts.Remove(post);
        await _context.SaveChangesAsync();
        return Ok("Admin: Konu ve ilgili yorumlar silindi.");
    }

    // 1. READ: Bir konuyu ve ona bağlı tüm yorumları getir
    [HttpGet("post/{postId}")]
    [AllowAnonymous] // Herkes okuyabilmeli
    public async Task<IActionResult> GetPostWithComments(int postId)
    {
        var post = await _context.ForumPosts
            .Include(p => p.User) // Konuyu açan
            .Include(p => p.Replies) // Konuya gelen yorumlar
                .ThenInclude(r => r.User) // Yorumu yapanlar
            .FirstOrDefaultAsync(p => p.Id == postId);

        if (post == null) return NotFound("Konu bulunamadı.");

        return Ok(new {
            post.Id,
            post.Title,
            post.Content,
            Author = post.User?.Email ?? "Bilinmiyor",
            CreatedDate = post.CreatedDate,
            Comments = post.Replies.Select(r => new {
                r.Id,
                r.Content,
                Author = r.User?.Email ?? "Anonim",
                r.CreatedDate
            })
        });
    }

    // 2. UPDATE: Kullanıcının kendi konusunu güncellemesi
    [HttpPut("post/{id}")]
    [Authorize]
    public async Task<IActionResult> UpdatePost(int id, CreateForumPostDto dto)
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        
        var post = await _context.ForumPosts.FindAsync(id);

        if (post == null) return NotFound("Güncellenecek konu bulunamadı.");
        
        // Güvenlik Kontrolü: Başkası başkasının konusunu değiştiremez
        if (post.UserId != userId) return Forbid();

        post.Title = dto.Title;
        post.Content = dto.Content;
        
        await _context.SaveChangesAsync();
        return Ok("Konu başarıyla güncellendi.");
    }

    // 3. READ: Belirli bir kategoriye ait tüm konuları getir
    [HttpGet("categories/{categoryId}/posts")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPostsByCategory(int categoryId)
    {
        var posts = await _context.ForumPosts
            .Where(p => p.ForumCategoryId == categoryId)
            .Include(p => p.User) // Konuyu açan kişiyi görsek iyi olur
            .OrderByDescending(p => p.CreatedDate) // En yeni konular en üstte
            .Select(p => new {
                p.Id,
                p.Title,
                p.CreatedDate,
                Author = p.User != null ? p.User.Email : "Anonim",
                CommentCount = p.Replies.Count // Kaç yorum gelmiş bilgisini de ekleyelim
            })
            .ToListAsync();

        return Ok(posts);
    }
}