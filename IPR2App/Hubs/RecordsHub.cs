using Microsoft.AspNetCore.SignalR;

namespace IPR2.Hubs
{
    public class RecordsHub : Hub
    { 
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}
