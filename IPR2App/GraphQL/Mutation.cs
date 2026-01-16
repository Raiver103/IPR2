using IPR2.Hubs;
using IPR2App.Models;
using IPR2App.Services;
using Microsoft.AspNetCore.SignalR;

namespace IPR2App.GraphQL
{
    public class Mutation
    {
        public async Task<RecordModel> AddRecord(
            string name,
            [Service] MongoService mongoService,
            [Service] IHubContext<RecordsHub> hubContext)
        {
            var newRecord = new RecordModel
            {
                Id = Guid.NewGuid(),
                Name = name,
                CreatedAt = DateTime.UtcNow
            };
             
            await mongoService.CreateAsync(newRecord);
             
            await hubContext.Clients.All.SendAsync("RecordAdded", newRecord);

            return newRecord;
        }
    }
}
