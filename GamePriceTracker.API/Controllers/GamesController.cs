using Microsoft.AspNetCore.Authorization;
using GamePriceTracker.Application.Features.Games.Commands;
using GamePriceTracker.Application.Features.Games.Queries;
using MediatR;
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

        // 🎯 TEK VE DOĞRU GET METODU
        // Hem tüm oyunları getirir, hem de platformId gelirse filtreler.
        [HttpGet]
        public async Task<ActionResult<List<GameDto>>> GetAll([FromQuery] int? platformId)
        {
            var result = await _mediator.Send(new GetGamesQuery { PlatformId = platformId });
            return Ok(result);
        }

        // POST: api/Games
        [HttpPost]
        public async Task<ActionResult<int>> Create(CreateGameCommand command)
        {
            var gameId = await _mediator.Send(command);
            return Ok(gameId);
        }

        // PUT: api/Games/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateGameCommand command)
        {
            if (id != command.Id) return BadRequest("ID uyuşmazlığı!");
            
            await _mediator.Send(command);
            return NoContent();
        }

        // DELETE: api/Games/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _mediator.Send(new DeleteGameCommand(id));
            return NoContent();
        }
    }
}