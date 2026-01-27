using IPR2App.GraphQL;

namespace IPR2App.Models
{
    public record AddRecordPayload(
        string Name,
        string UserId,
        List<RecordItemInput> Items 
    );
}
