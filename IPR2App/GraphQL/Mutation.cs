using HotChocolate.Subscriptions;
using IPR2.Hubs;
using IPR2App.Attributes;
using IPR2App.Models;
using IPR2App.Services;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Driver;

namespace IPR2App.GraphQL
{
    public class Mutation
    {
        [ApiKey]
        public async Task<RecordModel> AddRecord(
            [Service] IMongoCollection<RecordModel> collection,
            [Service] IHubContext<RecordsHub> hubContext, 
            AddRecordPayload input)
        {
            var newRecord = new RecordModel
            {
                Id = Guid.NewGuid(),
                Name = input.Name,
                CreatedAt = DateTime.UtcNow,
                UserId = input.UserId,
                Items = input.Items.Select(x => new RecordItem
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