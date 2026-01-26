using IPR2.Hubs;
using IPR2App.GraphQL;
using IPR2App.Middleware;
using IPR2App.Models;
using IPR2App.Services;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);
var mongoClient = new MongoClient("mongodb://localhost:27017");
var mongoDatabase = mongoClient.GetDatabase("IPR2Database");

builder.Services.AddControllers(); 
builder.Services.AddSignalR();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<MongoService>();

builder.Services.AddSingleton<IMongoCollection<RecordModel>>(sp =>
{
    var db = sp.GetRequiredService<IMongoDatabase>();
    return db.GetCollection<RecordModel>("Records");
});

builder.Services.AddSingleton<IMongoClient>(mongoClient);
builder.Services.AddSingleton(mongoDatabase);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularClient", policy =>
    {
        policy.WithOrigins("http://localhost:4200") 
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>()
    .AddMongoDbFiltering()   
    .AddMongoDbSorting()      
    .AddMongoDbProjections()
    .AddMongoDbPagingProviders();

builder.Services.AddHttpContextAccessor();
var app = builder.Build();
 

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection(); 
app.UseRouting();
app.UseCors("AngularClient"); 

app.UseAuthorization();
app.UseSwagger();
app.UseSwaggerUI();
app.MapControllers();

app.MapHub<RecordsHub>("/records-hub"); 
app.MapGraphQL("/graphql");


app.Run();
