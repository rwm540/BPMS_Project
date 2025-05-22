using System;
using System.Globalization;

namespace ServerBPMS.Helpers
{
    public static class PersianDateHelper
    {
        public static string GetNowShamsi()
        {
            var pc = new PersianCalendar();
            var now = DateTime.Now;

            return $"{pc.GetYear(now):0000}/{pc.GetMonth(now):00}/{pc.GetDayOfMonth(now):00} {now:HH:mm:ss}";
        }
    }

    public static class SHA256TokenCodeveryfive {
        public static string ToSha256(string input)
        {
            using var sha = System.Security.Cryptography.SHA256.Create();
            var bytes = System.Text.Encoding.UTF8.GetBytes(input);
            var hash = sha.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }
}
