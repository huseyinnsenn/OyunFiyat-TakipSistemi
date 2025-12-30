using GamePriceTracker.Application.Features.PriceEntries.Commands;
using GamePriceTracker.Application.Features.PriceEntries.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace GamePriceTracker.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PricesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PricesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<PriceEntryDto>>> GetAll()
        {
            return Ok(await _mediator.Send(new GetPriceEntriesQuery()));
        }

        [HttpPost]
        public async Task<ActionResult<int>> Create(CreatePriceEntryCommand command)
        {
            return Ok(await _mediator.Send(command));
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdatePriceEntryCommand command)
        {
            if (id != command.Id) return BadRequest();
            await _mediator.Send(command);
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _mediator.Send(new DeletePriceEntryCommand(id));
            return NoContent();
        }

        [HttpGet("game/{gameId}")]
        public async Task<ActionResult<List<PriceEntryDto>>> GetByGameId(int gameId)
        {
            // Bu Query'yi henüz oluşturmadık, birazdan oluşturacağız
            return Ok(await _mediator.Send(new GetPriceEntriesByGameIdQuery(gameId)));
        }
    }
}