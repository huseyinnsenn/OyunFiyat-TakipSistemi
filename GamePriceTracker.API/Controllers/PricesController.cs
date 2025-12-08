using GamePriceTracker.Application.Features.PriceEntries.Commands;
using GamePriceTracker.Application.Features.PriceEntries.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

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
    }
}