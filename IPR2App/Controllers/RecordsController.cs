using IPR2.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace IPR2App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecordsController : ControllerBase
    {
        //private readonly IHubContext<RecordsHub> _hubContext;

        //public RecordsController(IHubContext<RecordsHub> hubContext)
        //{
        //    _hubContext = hubContext;
        //}

        //[HttpPost]
        //public async Task<IActionResult> CreateRecord([FromBody] string recordName)
        //{
        //    var newRecord = new
        //    {
        //        Id = Guid.NewGuid(),
        //        Name = recordName,
        //        CreatedAt = DateTime.UtcNow
        //    };

        //    await _hubContext.Clients.All.SendAsync("RecordAdded", newRecord);

        //    return Ok(newRecord);
        //}
    }
}
