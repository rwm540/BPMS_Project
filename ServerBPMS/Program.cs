using Microsoft.EntityFrameworkCore;
using ServerBPMS.Model;
using ServerBPMS.Data;
using ServerBPMS.Server;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using ServerBPMS.DTOs; // ✅ این مهمه
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// خواندن کانکشن استرینگ از appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// خواندن FrontendUrl از appsettings.json برای CORS
var frontendUrl = builder.Configuration["FrontendUrl"] ?? "";

// اتصال DbContext به SQL Server
builder.Services.AddDbContext<bpms_cors_DbContext>(options =>
    options.UseSqlServer(connectionString));

// 🛡 خواندن تنظیمات JWT
var jwtSettingsSection = builder.Configuration.GetSection("JwtSettings");
builder.Services.Configure<JwtSettings>(jwtSettingsSection);

var jwtSettings = jwtSettingsSection.Get<JwtSettings>();
if (jwtSettings == null || string.IsNullOrWhiteSpace(jwtSettings.Key))
{
    throw new InvalidOperationException("❌ تنظیمات JWT در appsettings.json ناقص یا نامعتبر است.");
}

var key = Encoding.UTF8.GetBytes(jwtSettings.Key);

// 🔐 افزودن JWT Auth
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            // 👇 این خط حیاتی‌ـه
            var token = context.Request.Cookies["jwt"];
            if (!string.IsNullOrEmpty(token))
                context.Token = token;
            return Task.CompletedTask;
        }
    };

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});
// اضافه کردن کنترلرها
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



// ثبت سرویس‌های سفارشی
builder.Services.AddHttpClient<SendSMS>();
builder.Services.AddScoped<SendSMS>();
builder.Services.AddScoped<ServiceForms>();

// ✅ تنظیمات CORS با AllowCredentials
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(frontendUrl)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // 🔥 این باید داخل همون بلاک chain باشه
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

// ✨ فعال‌سازی JWT Authentication
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
