using IPR2.Hubs;
using IPR2App.GraphQL;
using IPR2App.Models;
using IPR2App.Services;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

var mongoConnection = builder.Configuration.GetConnectionString("MongoDb") ?? "mongodb://localhost:27017";
var mongoClient = new MongoClient(mongoConnection);
var mongoDatabase = mongoClient.GetDatabase("IPR2Database");

builder.Services.AddSingleton<IMongoClient>(mongoClient);
builder.Services.AddSingleton(mongoDatabase);
builder.Services.AddSingleton<IMongoCollection<RecordModel>>(sp =>
{
    var db = sp.GetRequiredService<IMongoDatabase>();
    return db.GetCollection<RecordModel>("Records");
});

builder.Services.AddSingleton<MongoService>();

var redisConnection = builder.Configuration.GetConnectionString("Redis") ?? "localhost:6379";

builder.Services.AddSignalR()
    .AddStackExchangeRedis(redisConnection, options => {
        options.Configuration.ChannelPrefix = "IPR2App";
    });

builder.Services.AddControllers();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("SignalRPolicy", policy =>
    {
        policy
            .AllowAnyMethod()
            .AllowAnyHeader()
            .SetIsOriginAllowed(origin => true) 
            .AllowCredentials();
    });
});

builder.Services.AddHttpContextAccessor();

builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>()
    .AddMongoDbFiltering()
    .AddMongoDbSorting()
    .AddMongoDbProjections()
    .AddMongoDbPagingProviders();

var app = builder.Build();


if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
}

app.UseRouting();
app.UseCors("SignalRPolicy");

app.UseAuthorization();

app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();

app.MapHub<RecordsHub>("/records-hub");
app.MapGraphQL("/graphql");

app.Run();