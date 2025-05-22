using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace ServerBPMS.Server
{
    public class SendSMS
    {
        private readonly HttpClient _httpClient;
        private readonly string _restUrl;
        private readonly string _token;
        private readonly string _username;
        private readonly string _password;

        public SendSMS(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _restUrl = config["IdehPayamApi:RestUrl"] ?? "http://217.20.252.203/api/v1/rest/sms/pattern-send";
            _token = config["IdehPayamApi:Token"] ?? "ca446d994d92592cb5f52b5fafb00f613ea031d9";
            _username = config["IdehPayamApi:Username"] ?? "senik";
            _password = config["IdehPayamApi:Password"] ?? "Senik@123";
        }

        public async Task<bool> SendVerificationCodeAsync(string phoneNumber, string code)
        {
            return await SendVerificationCodeRestAsync(phoneNumber, code);
        }

        private async Task<bool> SendVerificationCodeRestAsync(string phoneNumber, string code)
{
    try
    {
        var requestBody = new
        {
            from = "+989998885983",
            recipients = new[] { phoneNumber },
            message = new { code = code },
            patternId = 2,
            type = 0
        };

        var json = JsonSerializer.Serialize(requestBody);
        var request = new HttpRequestMessage(HttpMethod.Post, _restUrl)
        {
            Content = new StringContent(json, Encoding.UTF8, "application/json")
        };

        // 📎 حالا هدرها رو اینجا ست کن، روی خود request نه client
        request.Headers.Add("token", _token);
        request.Headers.Add("username", _username);
        request.Headers.Add("password", _password);

        var response = await _httpClient.SendAsync(request);
        var responseText = await response.Content.ReadAsStringAsync();

        Console.WriteLine("📨 پاسخ پیامک (REST): " + responseText);

        if (!response.IsSuccessStatusCode)
        {
            Console.WriteLine("❌ وضعیت HTTP: " + response.StatusCode);
            return false;
        }

        using var doc = JsonDocument.Parse(responseText);
        var root = doc.RootElement;

        if (root.TryGetProperty("status", out var status) && status.GetInt32() == 200)
        {
            var result = root.GetProperty("result");
            var resultStatus = result.GetProperty("status").GetInt32();
            return resultStatus == 0;
        }

        Console.WriteLine("⚠️ ساختار پاسخ نامعتبر است یا ارسال موفق نبوده.");
        return false;
    }
    catch (Exception ex)
    {
        Console.WriteLine("❌ خطا در ارسال پیامک (REST): " + TranslateError(ex.Message));
        return false;
    }
}

       private string TranslateError(string message)
       {
            if (message.Contains("400"))
                return "درخواست ارسالی نامعتبر است (400 Bad Request). معمولاً به خاطر مشکل در ساختار داده‌ها یا هدرهاست.";
            if (message.Contains("401"))
                return "توکن یا اطلاعات کاربری اشتباه است (401 Unauthorized).";
            if (message.Contains("403"))
                return "دسترسی غیرمجاز است (403 Forbidden).";
            if (message.Contains("404"))
                return "آدرس درخواست‌یافته پیدا نشد (404 Not Found).";
            if (message.Contains("500"))
                return "خطای داخلی در سرور رخ داده است (500 Internal Server Error).";
            if (message.Contains("timeout", StringComparison.OrdinalIgnoreCase))
                return "⏳ اتصال به سرور با Timeout مواجه شد.";
            if (message.Contains("No such host is known"))
                return "🌐 آدرس سرور اشتباه است یا قابل دسترسی نیست.";

        return "خطای ناشناخته: " + message;
        }
    }
}
