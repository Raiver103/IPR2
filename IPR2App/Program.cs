using IPR2.Hubs;
using IPR2App.GraphQL;
using IPR2App.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
//builder.Services.AddRazorPages(); 
builder.Services.AddSignalR();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<MongoService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularClient", policy =>
    {
        policy.WithOrigins("http://localhost:4200") // Адрес Angular
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // !!! ОБЯЗАТЕЛЬНО ДЛЯ SIGNALR !!!
    });
});

builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>();

var app = builder.Build();
 

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors("AngularClient");

app.UseAuthorization();
app.UseSwagger();
app.UseSwaggerUI();
app.MapControllers();
//app.MapRazorPages();              
app.MapHub<RecordsHub>("/records-hub"); 
app.MapGraphQL("/graphql");


app.Run();
