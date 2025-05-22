using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using ServerBPMS.Model;                // برای Login
using Microsoft.Extensions.Configuration; // برای IConfiguration و GetSection
using ServerBPMS.DTOs;                // برای JwtSettings (اگه اون کلاس اونجاست)


namespace ServerBPMS.Server
{

public static class TokenGenerator
{
    public static string GenerateToken(Login user, IConfiguration config)
    {
        var jwtSettings = config.GetSection("JwtSettings").Get<JwtSettings>();
        if (jwtSettings == null || string.IsNullOrEmpty(jwtSettings.Key))
            throw new InvalidOperationException("تنظیمات JWT ناقص یا نال است!");

        var claims = new List<Claim>
        {
            new Claim("Phone", user.Phone ?? string.Empty),
            new Claim("IdConnect", user.IdConnect ?? string.Empty),
            new Claim(ClaimTypes.Name, user.Username ?? string.Empty),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // برای جلوگیری از تکرار توکن
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: jwtSettings.Issuer,
            audience: jwtSettings.Audience,
            claims: claims,
            expires: DateTime.Now.AddDays(jwtSettings.ExpireDays),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
}