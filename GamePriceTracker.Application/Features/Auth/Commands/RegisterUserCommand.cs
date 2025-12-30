using BCrypt.Net; // Şifreleme için
using GamePriceTracker.Application.Common.Interfaces;
using GamePriceTracker.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GamePriceTracker.Application.Features.Auth.Commands
{
    // 1. İSTEK (Kullanıcıdan ne istiyoruz?)
    public class RegisterUserCommand : IRequest<int>
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; } // Kullanıcının girdiği saf şifre
    }

    // 2. İŞLEYİCİ
    public class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, int>
    {
        private readonly IApplicationDbContext _context;

        public RegisterUserCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
        {
            // A. Aynı mail adresiyle kayıt var mı kontrol et
            var userExists = await _context.Users
                .AnyAsync(u => u.Email == request.Email, cancellationToken);

            if (userExists)
            {
                // Normalde burada hata fırlatılır ama şimdilik -1 dönelim veya basit geçelim
                throw new Exception("Bu email adresi zaten kullanılıyor.");
            }

            // B. Şifreyi Hashle (Güvenli hale getir)
            // "123456" -> "$2a$11$Z5..." gibi karmaşık bir şeye dönüşür
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            // C. Kullanıcıyı oluştur
            var user = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                PasswordHash = passwordHash, // Hashlenmiş şifreyi kaydediyoruz
                Role = "User"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync(cancellationToken);

            return user.Id;
        }
    }
}