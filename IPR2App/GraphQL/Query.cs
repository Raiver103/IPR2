using HotChocolate.Data;
using IPR2App.Models;
using IPR2App.Services;
using MongoDB.Driver;

namespace IPR2App.GraphQL
{
    public class Query
    {
        [UseOffsetPaging(IncludeTotalCount = true)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IExecutable<RecordModel> GetRecords([Service] IMongoCollection<RecordModel> collection)
        {
            return collection.AsExecutable();
        }
    }
}
