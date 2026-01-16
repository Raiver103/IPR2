using IPR2App.Models;
using IPR2App.Services;

namespace IPR2App.GraphQL
{
    public class Query
    { 
        public async Task<List<RecordModel>> GetRecords([Service] MongoService mongoService)
        {
            return await mongoService.GetAsync();
        }
    }
}
