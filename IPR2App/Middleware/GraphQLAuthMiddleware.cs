namespace IPR2App.Middleware
{
    public class GraphQLAuthMiddleware
    {
        private readonly RequestDelegate _next;
        private const string MySecretKey = "secret-123";

        public GraphQLAuthMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (context.Request.Path.StartsWithSegments("/graphql"))
            {
                if (!context.Request.Headers.TryGetValue("X-Api-Key", out var extractedApiKey))
                {
                    context.Response.StatusCode = 401; 
                    await context.Response.WriteAsync("API Key is missing");
                    return;
                }

                if (!MySecretKey.Equals(extractedApiKey))
                {
                    context.Response.StatusCode = 403; 
                    await context.Response.WriteAsync("Invalid API Key");
                    return;
                }
            }

            await _next(context);
        }
    }
}
