using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace IPR2App.Models
{
    public class RecordModel
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
         
        public List<RecordItem> Items { get; set; } = new List<RecordItem>(); 
        public string UserId { get; set; } = string.Empty;
    }
}
