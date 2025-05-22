using Microsoft.AspNetCore.Mvc;
using ServerBPMS.Model;
using ServerBPMS.Server;
using System.Text.Json;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using ServerBPMS.DTOs;
using ServerBPMS.Helpers;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;


namespace ServerBPMS.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class ControllerOne : ControllerBase
    {
       private readonly ServiceForms _formService;

        public ControllerOne(ServiceForms formService)
        {
            _formService = formService;
        }



        //_________________________________________________________________________________________
        /* api Rest  برای  ارسال  پیامک */
        /* کد  روزو  شده  */
        [HttpPost("send-sms")]
        public async Task<IActionResult> SendSMS([FromBody] string phone)
        {
            if (string.IsNullOrWhiteSpace(phone))
                return BadRequest("⛔ شماره موبایل وارد نشده.");

                var code = CodeGenerator.GenerateCodeVeryfive();
                var success = await _formService.SendCodeViaSMS(phone, code);

                if (!success)
                    return StatusCode(500, "❌ ارسال پیامک با شکست مواجه شد.");

                    return Ok(new
                    {
                        message = "✅ پیامک ارسال شد",
                        code = code // ⚠️ تو محیط واقعی اینو به کلاینت نده!
                    });
        }
        /* کد  روزو  شده  */
        /* api Rest  برای  ارسال  پیامک */
        //_________________________________________________________________________________________



        /* بخش  فرم ها   */
        [HttpPost("save-form")]
        public async Task<IActionResult> SaveForm([FromBody] CreateForm CreateForm)
        {
            try
                {
                    var model = new CreateForm
                    {
                        TitleForm = CreateForm.TitleForm,
                        NameCompany = CreateForm.NameCompany,
                        Images = CreateForm.Images,
                        Json = CreateForm.Json
                    };

                    await _formService.SaveFormAsync(model);
                    return Ok("✅ فرم با موفقیت ذخیره شد.");
                }
            catch (Exception ex)
                {
                    return BadRequest($"❌ خطا در ذخیره‌سازی فرم: {ex.Message}");
                }
            }

            [HttpGet("get-forms")]
            public async Task<IActionResult> GetForms()
            {
                try
                    {
                        var forms = await _formService.GetAllFormsAsync();
                        return Ok(forms);
                    }
                        catch (Exception ex)
                    {
                        return BadRequest($"❌ خطا در دریافت فرم‌ها: {ex.Message}");
                    }
            }
        /* بخش  فرم ها   */


        /* طراحی  فرآیند */
        [HttpPost("save-process")]
        public async Task<IActionResult> SaveProcess([FromBody] Proccess process)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(process.nameProccess))
                    return BadRequest("⛔ نام فرآیند نمی‌تواند خالی باشد.");

                await _formService.SaveProcessAsync(process);
                return Ok("✅ فرآیند با موفقیت ذخیره شد.");
            }
            catch (Exception ex)
            {
                return BadRequest($"❌ خطا در ذخیره‌سازی فرآیند: {ex.Message}");
            }
        }


        /* get all proccess OR get nameProccess  */
        /* if nameOnly = true بیاد و فقط  نام فرآیند نمایش  داده  شود  */
        /* if allProccess = true همه  ی فرآیند ها  با ویژگی  هایشان  نمایش  داده شود */
        [HttpGet("get-processes")] // ✅ بدون nameOnly تو مسیر
        public async Task<IActionResult> GetProcesses([FromQuery] bool nameOnly = false, [FromQuery] bool allProccess = false)
        {
            try
                {
                    var processes = await _formService.GetAllProcessesAsync();

                    if (nameOnly)
                    {
                        var names = processes
                            .Where(p => p.Id > 0 ) // فقط اونایی که Id دارن
                            .Select(p => new 
                            {
                                p.Id,
                                p.nameProccess
                            })
                            .ToList();

                            return Ok(names);
                    }

                    if (allProccess)
                    {
                            return Ok(processes);
                    }

                     return BadRequest("⛔ یکی از پارامترهای nameOnly یا allProccess باید true باشد.");
                }   
                    catch (Exception ex)
            {
                return BadRequest($"❌ خطا در دریافت فرآیندها: {ex.Message}");
            }
        }


        /* delete Proccess حذف  فرایند */
        [HttpDelete("delete-process/{id}")]
        public async Task<IActionResult> DeleteProcess(int id)
        {
            try
            {
                var result = await _formService.DeleteProcessByIdAsync(id);
                if (!result)
                    return NotFound("⛔ فرآیندی با این شناسه یافت نشد!");

                return Ok("✅ فرآیند با موفقیت حذف شد");
            }
            catch (Exception ex)
            {
                return BadRequest($"❌ خطا در حذف فرآیند: {ex.Message}");
            }
        }

        //آپدیت فرآیند
        [HttpPut("update-process/{id}")]
        public async Task<IActionResult> UpdateProcess(int id, [FromBody] Proccess updatedProcess)
        {
            try
                {
                    var result = await _formService.UpdateProcessByIdAsync(id, updatedProcess);

                    if (!result)
                        return NotFound(new { message = "⛔ فرآیندی با این شناسه یافت نشد!" });

                    return Ok(new { message = "✅ فرآیند با موفقیت به‌روزرسانی شد" });
                }
                catch (Exception ex)
                {
                    return BadRequest(new { message = $"❌ خطا در بروزرسانی فرآیند: {ex.Message}" });
                }
        }

        /* طراحی  فرآیند */


        /* گرفتن اطلاعات کابری و  ذخیره ی آن توسط Jwt ,  Cookie */ 
        
        // ⚠️ مرحله 2: بعد از ثبت‌نام، توکن JWT رو داخل کوکی ذخیره کن:
        // ⚠️ مرحله 3: برای گرفتن اطلاعات کاربر از JWT در اکشن me:
        [Authorize]
        [HttpGet("me")]
        public IActionResult Me()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;

            if (identity == null || !identity.IsAuthenticated)
            {
                // 👇 به جای Unauthorized()
                return Ok(new { authenticated = false });
            }

            var username = identity.FindFirst(ClaimTypes.Name)?.Value;
            var phone = identity.FindFirst("Phone")?.Value;
            var idConnect = identity.FindFirst("IdConnect")?.Value;

            return Ok(new
            {
                authenticated = true,
                Username = username,
                Phone = phone,
                IdConnect = idConnect
            });
        }
        /* گرفتن اطلاعات کابری و  ذخیره ی آن توسط Jwt ,  Cookie */ 




        /* مدیریت  کاربران  و کاربران  */
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Login model)
        {
            // مرحله 1: چک فقط شماره موبایل
            if (string.IsNullOrWhiteSpace(model.Phone))
            {
                return BadRequest(new { message = "⛔ فیلد 'Phone' نباید خالی باشد." });
            }

            // مرحله 2: چک تکراری بودن شماره موبایل
            var validation = await _formService.ValidateLoginAsync(model);
            if (!validation.IsValid)
                return BadRequest(new { message = validation.Error });

            // مرحله 3: تولید مقادیر سمت سرور
            model.Username = UsernameGenerator.GenerateUsername();
            model.CodeVeryFive = CodeGenerator.GenerateCodeVeryfive();
            var hashedCode = SHA256TokenCodeveryfive.ToSha256(model.CodeVeryFive);
            model.CodeVeryFive = hashedCode;
            //model.CodeVeryFive = CodeGenerator.GenerateCodeVeryfive();
            model.IdConnect = CodeGenerator.GenerateIdConnect();

            // مرحله 4: ذخیره در دیتابیس
            await _formService.AddLoginAsync(model);

            // مرحله 5: سطح دسترسی
            var accessLevel = new AccessLevel
            {
                IdConnect = model.IdConnect,
                processDesign = "false",
                Follow_up_report = "false",
                Forms = "false",
                CRM = "false",
                PowerBi = "false",
                Human_resources = "false"
            };
            await _formService.AddAccessLevelAsync(accessLevel);

            // مرحله 6: لاگ ورود
            var log = new Log_Login
            {
                Phone = model.Phone,
                Username = model.Username,
                OKCode = "false",
                DataLogin = PersianDateHelper.GetNowShamsi(),
                DataLogout = null
            };
            await _formService.AddLoginLogAsync(log);


            // ✅ مرحله والت: ایجاد والت برای کاربر
            //باز  شدن حساب  با CallWallet
            //بسته شدن حساب  با CloseWallet
            var wallet = new Wallet
            {
                IdConnect = SHA256TokenCodeveryfive.ToSha256(model.IdConnect),
                Toman = "0",
                TransActions = "NULL",
                BlockWallet = "CallWallet"
            };
            await _formService.AddWalletAsync(wallet);
            
            // مرحله 7: توکن
            var token = TokenGenerator.GenerateToken(
                model,
                HttpContext.RequestServices.GetRequiredService<IConfiguration>()
            );
            /* send  sms  code very five */
           /* var smsSent = await _formService.SendCodeViaSMS(model.Phone, model.CodeVeryFive);
            if (!smsSent)
                return StatusCode(500, "❌ ارسال پیامک با شکست مواجه شد.");*/
            /* send  sms  code very five */
            return Ok(new
            {
                message = "✅ ثبت‌ نام موفقیت‌آمیز بود و پیامک ارسال شد",
                token,
                user = new
                {
                    model.Username,
                    model.Phone,
                    model.IdConnect
                }
            });
        }


    /* ورود  کاربر  */
    [HttpPost("login")]
public async Task<IActionResult> Login([FromBody] Login model)
{
    // مرحله 1: بررسی اولیه
    if (!ModelState.IsValid || string.IsNullOrWhiteSpace(model.Phone))
        return BadRequest(new { message = "⛔ شماره موبایل وارد نشده است." });

    // مرحله 2: یافتن کاربر
    var existingUser = await _formService.GetUserByPhoneAsync(model.Phone);
    if (existingUser == null)
        return NotFound(new { message = "⛔ کاربری با این شماره یافت نشد." });

    // مرحله 3: تولید کد تأیید جدید
    // var newCode = CodeGenerator.GenerateCodeVeryfive();
    model.CodeVeryFive = CodeGenerator.GenerateCodeVeryfive();
    var code = model.CodeVeryFive;
    var hashedCode = SHA256TokenCodeveryfive.ToSha256(model.CodeVeryFive);
    model.CodeVeryFive = hashedCode;
    existingUser.CodeVeryFive = hashedCode;

    // مرحله 4: ذخیره کد جدید در دیتابیس
    await _formService.UpdateUserCodeVeryFiveAsync(existingUser);

    // مرحله 5: تولید توکن JWT
    var token = TokenGenerator.GenerateToken(
        existingUser,
        HttpContext.RequestServices.GetRequiredService<IConfiguration>()
    );

    // مرحله 7: ثبت لاگ ورود
    var log = new Log_Login
    {
        Phone = existingUser.Phone,
        Username = existingUser.Username,
        OKCode = "false",
        DataLogin = PersianDateHelper.GetNowShamsi(),
        DataLogout = null
    };
    await _formService.AddLoginLogAsync(log);
    /* send  sms  code very five */
    /*var smsSent = await _formService.SendCodeViaSMS(model.Phone, model.CodeVeryFive);
    if (!smsSent)
        return StatusCode(500, "❌ ارسال پیامک با شکست مواجه شد.");*/
    /* send  sms  code very five */

    // مرحله 8: پاسخ موفق
    return Ok(new
    {
        message = "✅ ورود موفقیت‌آمیز بود",
        codeVeryFive = code,
        token,
        user = new
        {
            existingUser.Username,
            existingUser.Phone,
            existingUser.IdConnect
        }
    });
}

/* ورود  کاربر  */


/* ورود  به پنل  با  کد  تاییده  */
[HttpPost("verify-code")]
public async Task<IActionResult> VerifyCode([FromBody] Login model)
{
    if (string.IsNullOrWhiteSpace(model.Phone) || string.IsNullOrWhiteSpace(model.CodeVeryFive))
        return BadRequest(new { message = "⛔ شماره موبایل یا کد تایید خالی است." });

    var user = await _formService.GetUserByPhoneAsync(model.Phone);
    if (user == null)
        return NotFound(new { message = "⛔ کاربری با این شماره یافت نشد." });

    var hashedInputCode = SHA256TokenCodeveryfive.ToSha256(model.CodeVeryFive);

    if (user.CodeVeryFive != hashedInputCode)
        return Unauthorized(new { message = "⛔ کد تایید نادرست است." });

    // ✅ پاک کردن کد تایید
    user.CodeVeryFive = null;
    await _formService.UpdateUserAsync(user);

    // ✅ بروزرسانی لاگ ورود
    await _formService.ConfirmLoginLogAsync(user.Phone, user.Username);

    // ✅ صدور توکن JWT و ذخیره در کوکی
    var token = TokenGenerator.GenerateToken(
        user,
        HttpContext.RequestServices.GetRequiredService<IConfiguration>()
    );

    var env = HttpContext.RequestServices.GetRequiredService<IWebHostEnvironment>();
    Response.Cookies.Append("jwt", token, new CookieOptions
    {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.Lax,
        Expires = DateTimeOffset.UtcNow.AddDays(1)
    });

    Response.Cookies.Append("hasSession", "true", new CookieOptions
    {
        HttpOnly = false, // 👈 قابل دسترسی از جاوااسکریپت
        Secure = true,
        SameSite = SameSiteMode.Lax,
        Expires = DateTimeOffset.UtcNow.AddDays(1)
    });
    // ✅ پاسخ نهایی به کلاینت
    return Ok(new
    {
        message = "✅ تایید موفق و ورود انجام شد",
        token,
        user = new
        {
            user.Username,
            user.Phone,
            user.IdConnect
        }
    });
}
/* ورود  به پنل  با  کد  تاییده  */


/* پاک  کردن  کوکی  */
[HttpPost("logout")]
public IActionResult Logout()
{
    Response.Cookies.Delete("jwt");
    Response.Cookies.Delete("hasSession");
    return Ok(new
    {
        message = "✅ کوکی حذف شد. کاربر از سیستم خارج شد"
    });
}
/* پاک  کردن  کوکی  */



        /* مدیریت کاربران - حذف کاربر با ID */
        [HttpDelete("delete-user/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var result = await _formService.DeleteUserByIdAsync(id);
            if (!result)
                return NotFound("⛔ کاربر با این شناسه پیدا نشد.");

            return Ok("✅ کاربر با موفقیت حذف شد");
        }
      /* مدیریت  کاربران  و کاربران  */


      /*  آپدیت  کامل  برای  هر تیبل   */
      [HttpPut("update-table")]
      public async Task<IActionResult> UpdateAny([FromBody] UpdateRequestDto request)
      {
        try
            {
                if (string.IsNullOrWhiteSpace(request.Table))
                    return BadRequest("⛔ نام جدول نباید خالی باشد.");

                switch (request.Table.ToLower())
                {
                    case "login":
                        return await RunUpdate<Login>(request.ConditionField, request.ConditionValue, request.NewValues, request.Take);

                    case "proccess":
                        return await RunUpdate<Proccess>(request.ConditionField, request.ConditionValue, request.NewValues, request.Take);

                    case "accesslevel":
                        return await RunUpdate<AccessLevel>(request.ConditionField, request.ConditionValue, request.NewValues, request.Take);

                    default:
                        return BadRequest("⛔ جدول مشخص‌شده یافت نشد.");
                }
            }
             catch (Exception ex)
                {
                    return BadRequest($"❌ خطا در آپدیت جدول: {ex.Message}");
                }
            }

       private async Task<IActionResult> RunUpdate<T>(
    string? field, string? value,
    Dictionary<string, object> updates,
    int? take = null
) where T : class
{
    try
    {
        // جلوگیری از null یا خالی بودن ورودی‌ها
        if (string.IsNullOrWhiteSpace(field))
            return BadRequest("⛔ فیلد شرط نمی‌تواند خالی باشد.");

        if (string.IsNullOrWhiteSpace(value))
            return BadRequest("⛔ مقدار شرط نمی‌تواند خالی باشد.");

        if (updates == null || updates.Count == 0)
            return BadRequest("⛔ هیچ مقدار جدیدی برای آپدیت ارسال نشده است.");

        // بررسی وجود فیلد قبل از شرط‌سازی
        var propInfo = typeof(T).GetProperty(field);
        if (propInfo == null)
            return BadRequest($"⛔ فیلد '{field}' در مدل '{typeof(T).Name}' پیدا نشد.");

        // شرط داینامیک با EF.Property<object>
        Expression<Func<T, bool>> condition = x =>
            EF.Property<object>(x, field) != null &&
            EF.Property<object>(x, field).ToString() == value;

        // اجرای آپدیت
        var count = await _formService.UpdateAnyTableAsync<T>(
            condition,
            SafeConvertDictionary<T>(updates),
            take
        );

        return Ok($"✅ {count} رکورد در جدول {typeof(T).Name} آپدیت شد.");
    }
    catch (Exception ex)
    {
        return BadRequest($"❌ خطا در اجرای شرط یا آپدیت: {ex.Message}");
    }
}

        private Dictionary<string, object> SafeConvertDictionary<T>(Dictionary<string, object> input)
        {
                var output = new Dictionary<string, object>();
                foreach (var entry in input)
                {
                    var prop = typeof(T).GetProperty(entry.Key);
                    if (string.IsNullOrWhiteSpace(entry.Key)) continue;
                    if (prop == null) continue;

                    object value = entry.Value;

                    if (value is JsonElement jsonElement)
                    {
                    try
                    {
                        var targetType = Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType;
                        value = Convert.ChangeType(jsonElement.ToString(), targetType);
                    }
                    catch
                    {
                        // اگه تبدیل نشد، بی‌خیالش می‌شیم یا می‌تونی throw کنی
                        continue;
                    }
                }

                output[entry.Key] = value;
            }

            return output;
        }
        /*  آپدیت  کامل  برای  هر تیبل   */


        /* حذف  مقدار های  جدول */
        /* Delete  value for tables */

        
     [HttpDelete("delete-records")]
public async Task<IActionResult> DeleteAny([FromBody] DynamicDeleteDto request)
{
    try
    {
        (bool success, string message) result;
        if (string.IsNullOrWhiteSpace(request.Table))
            return BadRequest("⛔ نام جدول نباید خالی باشد.");

        switch (request.Table.ToLower())
        {
            case "login":
                result = await _formService.DeleteRecords<Login>(
                    request.ConditionField, request.ConditionValue, request.Take);
                break;
            case "proccess":
                result = await _formService.DeleteRecords<Proccess>(
                    request.ConditionField, request.ConditionValue, request.Take);
                break;
            case "accesslevel":
                result = await _formService.DeleteRecords<AccessLevel>(
                    request.ConditionField, request.ConditionValue, request.Take);
                break;
            default:
                return BadRequest("⛔ جدول مشخص‌شده پشتیبانی نمی‌شود.");
        }

        if (!result.success)
            return NotFound(result.message);

        return Ok(result.message);
    }
    catch (Exception ex)
    {
        return BadRequest($"❌ خطا در حذف داینامیک: {ex.Message}");
    }
}


        /* Delete  value for tables */
        /* حذف  مقدار های  جدول */



    }



}
