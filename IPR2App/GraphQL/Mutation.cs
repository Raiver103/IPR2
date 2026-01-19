using HotChocolate.Subscriptions;
using IPR2.Hubs;
using IPR2App.Models;
using IPR2App.Services;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Driver;

namespace IPR2App.GraphQL
{
    public class Mutation
    {
        public async Task<RecordModel> AddRecord(
            [Service] IMongoCollection<RecordModel> collection,
            [Service] IHubContext<RecordsHub> hubContext,
            string name,
            List<RecordItemInput> items)
        {
            var newRecord = new RecordModel
            {
                Id = Guid.NewGuid(),
                Name = name,
                CreatedAt = DateTime.UtcNow,

                Items = items.Select(x => new RecordItem
                {
                    Text = x.Text,
                    IsCompleted = false
                }).ToList()
            };

            await collection.InsertOneAsync(newRecord);

            await hubContext.Clients.All.SendAsync("RecordAdded", newRecord);

            return newRecord;
        }
    }
}