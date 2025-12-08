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
    }
}