using Microsoft.AspNetCore.Authorization; // 👈 1. KİLİT MEKANİZMASI KÜTÜPHANESİ
using GamePriceTracker.Application.Features.Games.Commands;
using MediatR;
using GamePriceTracker.Application.Features.Games.Queries; 
using Microsoft.AspNetCore.Mvc;

namespace GamePriceTracker.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GamesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public GamesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // GET: Herkese açık (Authorize YOK)
        // İsteyen herkes oyun listesine bakabilir, üye olmasına gerek yok.
        [HttpGet]
        public async Task<ActionResult<List<GameDto>>> GetAll()
        {
            var query = new GetGamesQuery();
            var result = await _mediator.Send(query);

            return Ok(result);
        }

        // POST: SADECE ÜYELERE ÖZEL 🔒
        // Buraya sadece elinde geçerli bir Token (Kimlik Kartı) olan girebilir.
        [Authorize] // 👈 2. KAPIYI KİLİTLEDİK!
        [HttpPost]
        public async Task<ActionResult<int>> Create(CreateGameCommand command)
        {
            var gameId = await _mediator.Send(command);
            return Ok(gameId);
        }
    }
}