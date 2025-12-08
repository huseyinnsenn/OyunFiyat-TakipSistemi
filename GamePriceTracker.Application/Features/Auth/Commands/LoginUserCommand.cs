using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using GamePriceTracker.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration; // Ayarları okumak için
using Microsoft.IdentityModel.Tokens;

namespace GamePriceTracker.Application.Features.Auth.Commands
{
    // 1. İSTEK: Kullanıcı email ve şifre gönderir, karşılığında Token (string) alır.
    public class LoginUserCommand : IRequest<string>
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }

    // 2. İŞLEYİCİ
    public class LoginUserCommandHandler : IRequestHandler<LoginUserCommand, string>
    {
        private readonly IApplicationDbContext _context;
        private readonly IConfiguration _configuration; // appsettings.json'ı okumak için

        public LoginUserCommandHandler(IApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<string> Handle(LoginUserCommand request, CancellationToken cancellationToken)
        {
            // A. Kullanıcıyı bul
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);

            // Kullanıcı yoksa hata ver
            if (user == null)
            {
                throw new Exception("Kullanıcı bulunamadı veya şifre yanlış.");
            }

            // B. Şifreyi Doğrula (Hash kontrolü)
            // Kullanıcının girdiği şifre ile veritabanındaki hash aynı mı?
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

            if (!isPasswordValid)
            {
                throw new Exception("Kullanıcı bulunamadı veya şifre yanlış.");
            }

            // C. Token Üret (JWT)
            var tokenHandler = new JwtSecurityTokenHandler();
            
            // Gizli anahtarı al
            var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:Secret"]!);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                // Token içine gömülecek bilgiler (Payload)
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                // Token ne kadar süre geçerli? (7 gün)
                Expires = DateTime.UtcNow.AddDays(7),
                // İmzalama algoritması
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            
            // Token'ı string olarak döndür
            return tokenHandler.WriteToken(token);
        }
    }
}