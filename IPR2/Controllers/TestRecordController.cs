using IPR2.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace IPR2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestRecordController : ControllerBase
    {
        private readonly IHubContext<RecordsHub> _hubContext;

        // Инжектим контекст хаба, чтобы вызывать методы клиентов из контроллера
        public TestRecordController(IHubContext<RecordsHub> hubContext)
        {
            _hubContext = hubContext;
        }

        [HttpPost]
        public async Task<IActionResult> AddRecord([FromBody] string recordName)
        {
            // 1. Здесь будет логика сохранения в MongoDB (реализуем позже)
            var newRecord = new { Id = Guid.NewGuid(), Name = recordName, CreatedAt = DateTime.UtcNow };

            // 2. Уведомляем ВСЕХ клиентов о новой записи
            // "ReceiveRecord" — это имя метода, на который подпишется JS на фронтенде
            await _hubContext.Clients.All.SendAsync("ReceiveRecord", newRecord);

            return Ok(new { Message = "Record added and broadcasted", Data = newRecord });
        }
    }
}
