using System;
using System.Linq;

namespace ServerBPMS.Server
{

    public class UsernameGenerator
    {
        private static Random random = new Random();

        public static string GenerateUsername()
        {
            const string letters = "abcdefghijklmnopqrstuvwxyz";
            const int nameLength = 9;

            string namePart = new string(Enumerable.Repeat(letters, nameLength)
                .Select(s => s[random.Next(s.Length)]).ToArray());

            int numberPart = random.Next(100, 9999);

            return $"{namePart}{numberPart}";
        }
    }


}
