using HotChocolate.Types.Descriptors;
using System.Reflection;

namespace IPR2App.Attributes
{
    public class ApiKeyAttribute : ObjectFieldDescriptorAttribute
    {
        private const string HEADER_NAME = "X-Api-Key";
        private const string SECRET_KEY = "secret-123";

        protected override void OnConfigure(
            IDescriptorContext context,
            IObjectFieldDescriptor descriptor,
            MemberInfo member)
        {
            descriptor.Use(next => async ctx =>
            {
                var httpContextAccessor = ctx.Services.GetRequiredService<IHttpContextAccessor>();
                var httpContext = httpContextAccessor.HttpContext;

                if (httpContext != null)
                {
                    if (!httpContext.Request.Headers.TryGetValue(HEADER_NAME, out var extractedKey))
                    {
                        throw new GraphQLException(new ErrorBuilder()
                            .SetMessage("Access Denied: API Key Not Provided.")
                            .SetCode("AUTH_NOT_AUTHENTICATED")
                            .Build());
                    }

                    if (!SECRET_KEY.Equals(extractedKey))
                    {
                        throw new GraphQLException(new ErrorBuilder()
                            .SetMessage("Access Denied: Invalid API Key.")
                            .SetCode("AUTH_NOT_AUTHORIZED")
                            .Build());
                    }
                }

                await next(ctx);
            });
        }
    }
}
