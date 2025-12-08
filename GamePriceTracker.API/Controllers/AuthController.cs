using GamePriceTracker.Application.Features.Auth.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace GamePriceTracker.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("register")] // Adres: api/auth/register
        public async Task<ActionResult<int>> Register(RegisterUserCommand command)
        {
            // Başarılı olursa kullanıcının ID'sini döner
            return Ok(await _mediator.Send(command));
        }

        [HttpPost("login")] // Adres: api/auth/login
        public async Task<ActionResult<string>> Login(LoginUserCommand command)
        {
            // Başarılı olursa upuzun bir Token string döner
            return Ok(await _mediator.Send(command));
        }
    }
}