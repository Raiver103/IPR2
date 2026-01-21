using Microsoft.AspNetCore.SignalR;

namespace IPR2.Hubs
{
    public class RecordsHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var userId = Context.GetHttpContext()?.Request.Query["userId"];

            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, userId);
            }

            await base.OnConnectedAsync();
        }
        // только одному пользователю
        // вебсокет, какие протоколы в сигнал ар,
    }
}
