using IPR2App.Models;
using MongoDB.Driver;

namespace IPR2App.Services
{
    public class MongoService
    {
        private readonly IMongoCollection<RecordModel> _records;

        public MongoService(IConfiguration config)
        {
            var connectionString = "mongodb://localhost:27017";
            var mongoClient = new MongoClient(connectionString);
            var mongoDatabase = mongoClient.GetDatabase("RealTimeDb");

            _records = mongoDatabase.GetCollection<RecordModel>("Records");
        }

        public async Task CreateAsync(RecordModel record) =>
            await _records.InsertOneAsync(record);

        public async Task<List<RecordModel>> GetAsync() =>
            await _records.Find(_ => true).ToListAsync();
    }
}
