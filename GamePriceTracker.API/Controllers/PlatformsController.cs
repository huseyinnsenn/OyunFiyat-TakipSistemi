using GamePriceTracker.Application.Features.Platforms.Commands;
using GamePriceTracker.Application.Features.Platforms.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GamePriceTracker.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlatformsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PlatformsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<PlatformDto>>> GetAll()
        {
            return Ok(await _mediator.Send(new GetPlatformsQuery()));
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<int>> Create(CreatePlatformCommand command)
        {
            return Ok(await _mediator.Send(command));
        }

        // PUT: api/Platforms/5
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdatePlatformCommand command)
        {
            if (id != command.Id) return BadRequest("ID uyuşmazlığı!");
            await _mediator.Send(command);
            return NoContent();
        }

        // DELETE: api/Platforms/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _mediator.Send(new DeletePlatformCommand(id));
            return NoContent();
        }
    }
}