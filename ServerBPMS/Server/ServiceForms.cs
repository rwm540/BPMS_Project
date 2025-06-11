using Microsoft.EntityFrameworkCore;
using ServerBPMS.Data;
using ServerBPMS.Model;
using System.Linq.Expressions;
using ServerBPMS.DTOs;
using ServerBPMS.Helpers;
using System.Text.Json; // برای سریالایز و دی‌سریالایز کردن JSON
using ServerBPMS.Model.DynamicForms; // برای FieldSchema و FieldOption


namespace ServerBPMS.Server
{

    public class ServiceForms
    {
        private readonly bpms_cors_DbContext _db;
        private readonly SendSMS _sendSMS;

        public ServiceForms(bpms_cors_DbContext db , SendSMS sendSMS)
        {
            _db = db;
            _sendSMS = sendSMS;
        }


        /* ********************************************************************************************************* */
        /* بخش مدیریت تعریف فرم‌های داینامیک (CreateFormCRM) - مربوط به SchemaForm */
        /* ********************************************************************************************************* */

        // ذخیره/ایجاد یک تعریف فرم جدید
        public async Task<bool> SaveFormSchemaAsync(CreateFormCRM formSchema)
        {
            if (formSchema == null)
                throw new ArgumentNullException(nameof(formSchema));

            // تبدیل Schema (List<FieldSchema>) به رشته JSON و ذخیره در SchemaJson
            if (formSchema.Schema != null)
            {
                formSchema.SchemaJson = JsonSerializer.Serialize(formSchema.Schema, new JsonSerializerOptions { WriteIndented = true });
            }
            else
            {
                formSchema.SchemaJson = "[]";
            }

            formSchema.CreatedDate = DateTime.UtcNow;
            formSchema.LastModifiedDate = DateTime.UtcNow;

            _db.CreateFormCRMs.Add(formSchema);
            await _db.SaveChangesAsync();
            return true;
        }

        // بروزرسانی یک تعریف فرم موجود
        public async Task<bool> UpdateFormSchemaAsync(CreateFormCRM formSchema)
        {
            if (formSchema == null)
                throw new ArgumentNullException(nameof(formSchema));

            var existingFormSchema = await _db.CreateFormCRMs.FindAsync(formSchema.Id);
            if (existingFormSchema == null)
                return false;

            // بروزرسانی فیلدها
            existingFormSchema.NameForm = formSchema.NameForm;
            existingFormSchema.IdConnect = formSchema.IdConnect;
            existingFormSchema.LastModifiedDate = DateTime.UtcNow;

            if (formSchema.Schema != null)
            {
                existingFormSchema.SchemaJson = JsonSerializer.Serialize(formSchema.Schema, new JsonSerializerOptions { WriteIndented = true });
            }
            else
            {
                existingFormSchema.SchemaJson = "[]";
            }

            _db.CreateFormCRMs.Update(existingFormSchema);
            await _db.SaveChangesAsync();
            return true;
        }

        // دریافت تمام تعاریف فرم
        public async Task<List<CreateFormCRM>> GetAllFormSchemasAsync()
        {
            var schemas = await _db.CreateFormCRMs.ToListAsync();
            foreach (var schema in schemas)
            {
                // تبدیل SchemaJson به List<FieldSchema> برای استفاده در سمت سرور یا ارسال به کلاینت
                if (!string.IsNullOrWhiteSpace(schema.SchemaJson))
                {
                    try
                    {
                        schema.Schema = JsonSerializer.Deserialize<List<FieldSchema>>(schema.SchemaJson);
                    }
                    catch (JsonException ex)
                    {
                        Console.WriteLine($"Error deserializing SchemaJson for Form ID {schema.Id}: {ex.Message}");
                        schema.Schema = new List<FieldSchema>();
                    }
                }
                else
                {
                    schema.Schema = new List<FieldSchema>();
                }
            }
            return schemas;
        }

        // دریافت یک تعریف فرم خاص بر اساس ID
        public async Task<CreateFormCRM?> GetFormSchemaByIdAsync(int id)
        {
            var schema = await _db.CreateFormCRMs.FirstOrDefaultAsync(f => f.Id == id);
            if (schema != null && !string.IsNullOrWhiteSpace(schema.SchemaJson))
            {
                try
                {
                    schema.Schema = JsonSerializer.Deserialize<List<FieldSchema>>(schema.SchemaJson);
                }
                catch (JsonException ex)
                {
                    Console.WriteLine($"Error deserializing SchemaJson for Form ID {schema.Id}: {ex.Message}");
                    schema.Schema = new List<FieldSchema>();
                }
            }
            return schema;
        }

        // حذف یک تعریف فرم
        public async Task<bool> DeleteFormSchemaAsync(int id)
        {
            var formSchema = await _db.CreateFormCRMs.FindAsync(id);
            if (formSchema == null)
                return false;

            _db.CreateFormCRMs.Remove(formSchema);
            await _db.SaveChangesAsync();
            return true;
        }

        /* ********************************************************************************************************* */
        /* بخش مدیریت تعریف فرم‌های داینامیک (CreateFormCRM) - مربوط به SchemaForm */
        /* ********************************************************************************************************* */


        /* ********************************************************************************************************* */
        /* جدید: بخش مدیریت داده‌های فرم (CrmFormData) - با استفاده از مدل شما */
        /* ********************************************************************************************************* */

        // ذخیره/ایجاد یک رکورد داده فرم جدید
        public async Task<bool> SaveCrmFormDataAsync(CrmFormData crmFormData)
        {
            if (crmFormData == null)
                throw new ArgumentNullException(nameof(crmFormData));

            // تنظیم CreatedDate اگر از سمت کلاینت ارسال نشده باشد
            if (crmFormData.CreatedDate == null)
            {
                crmFormData.CreatedDate = DateTime.UtcNow;
            }
            // CreatedByUserId نیز می‌تواند از SecurityContext گرفته شود اگر احراز هویت دارید.
            // crmFormData.CreatedByUserId = "someUserId"; 

            _db.CrmFormDatas.Add(crmFormData); // **استفاده از DbSet<CrmFormData>**
            await _db.SaveChangesAsync();
            return true;
        }

        // دریافت تمام رکوردهای داده فرم برای یک تعریف فرم خاص
        public async Task<List<CrmFormData>> GetCrmFormDataByFormDefinitionIdAsync(int formDefinitionId)
        {
            return await _db.CrmFormDatas
                            .Where(cfd => cfd.FormDefinitionId == formDefinitionId)
                            .ToListAsync();
        }

        // دریافت یک رکورد داده فرم خاص بر اساس ID
        public async Task<CrmFormData?> GetCrmFormDataEntryByIdAsync(int id)
        {
            return await _db.CrmFormDatas.FindAsync(id);
        }

        // بروزرسانی یک رکورد داده فرم
        public async Task<bool> UpdateCrmFormDataAsync(CrmFormData crmFormData)
        {
            if (crmFormData == null)
                throw new ArgumentNullException(nameof(crmFormData));

            var existingEntry = await _db.CrmFormDatas.FindAsync(crmFormData.Id);
            if (existingEntry == null)
                return false;

            // فقط فیلدهایی که می‌خواهید بروزرسانی شوند را اینجا تنظیم کنید.
            existingEntry.FormDataJson = crmFormData.FormDataJson; // **استفاده از FormDataJson**
            existingEntry.CreatedDate = DateTime.UtcNow; // تاریخ آخرین بروزرسانی
            // existingEntry.CreatedByUserId = crmFormData.CreatedByUserId; // اگر همزمان کاربر ویرایش کننده را ذخیره می‌کنید.

            _db.CrmFormDatas.Update(existingEntry);
            await _db.SaveChangesAsync();
            return true;
        }

        // حذف یک رکورد داده فرم
        public async Task<bool> DeleteCrmFormDataEntryAsync(int id)
        {
            var entry = await _db.CrmFormDatas.FindAsync(id);
            if (entry == null)
                return false;

            _db.CrmFormDatas.Remove(entry);
            await _db.SaveChangesAsync();
            return true;
        }

        /* ********************************************************************************************************* */
        /* جدید: بخش مدیریت داده‌های فرم (CrmFormData) - با استفاده از مدل شما */
        /* ********************************************************************************************************* */







        /*Send SMS CodeVeryfive */
        public async Task<bool> SendCodeViaSMS(string phone, string code)
        {
            return await _sendSMS.SendVerificationCodeAsync(phone, code);
        }
        /*Send SMS CodeVeryfive */

        public async Task<bool> SaveFormAsync(CreateForm form)
        {
            _db.CreateForm.Add(form);
            await _db.SaveChangesAsync();
            return true;
        }




        /* آپدیت هر  جدولی  که  دلمون خواست  */
        public async Task<int> UpdateAnyTableAsync<T>(
                Expression<Func<T, bool>> condition,
                Dictionary<string, object> newValues,
                    int? takeCount = null
            ) where T : class
         {
            var query = _db.Set<T>().Where(condition);

            if (takeCount.HasValue)
            query = query.Take(takeCount.Value);

            var list = await query.ToListAsync();

            foreach (var item in list)
            {
                foreach (var entry in newValues)
                {
                    var prop = item.GetType().GetProperty(entry.Key);
                    if (prop != null && prop.CanWrite)
                        prop.SetValue(item, entry.Value);
                }
            }

            return await _db.SaveChangesAsync();
        }
        /* آپدیت هر  جدولی  که  دلمون خواست  */

        /* بخش  فرم ها   */
        public async Task<List<CreateForm>> GetAllFormsAsync()
        {
            return await _db.CreateForm.ToListAsync();
        }


        public async Task<CreateForm?> GetFormByIdAsync(int id)
        {
            return await _db.CreateForm.FirstOrDefaultAsync(f => f.Id == id);
        }
        /* بخش  فرم ها   */

        /* طراحی  فرآیند */

        /* فرآیند  آپدیت  شده */
        public async Task<bool> UpdateProcessByIdAsync(int id, Proccess updatedProcess)
        {
            var existingProcess = await _db.Proccess.FindAsync(id);
    
            if (existingProcess == null)
                return false; // ⛔ رکوردی با این Id وجود نداره، نمیخواییم الکی آپدیت کنیم

            // ✨ فقط مقداردهی جدید روی آبجکت پیدا شده
            existingProcess.nameProccess = updatedProcess.nameProccess;
            existingProcess.Json = updatedProcess.Json;
            existingProcess.Xml = updatedProcess.Xml;

            await _db.SaveChangesAsync();
            return true;
        }
        /* فرآیند  آپدیت  شده */

        public async Task<bool> SaveProcessAsync(Proccess process)
        {
            _db.Proccess.Add(process);
            await _db.SaveChangesAsync();
            return true;
        }


        public async Task<List<Proccess>> GetAllProcessesAsync()
        {
            return await _db.Proccess.ToListAsync();
        }
        /* حذف  فرآیند مورد نظر  با آیدی  وارد شده   */



        public async Task<bool> DeleteProcessByIdAsync(int id)
        {
            var process = await _db.Proccess.FirstOrDefaultAsync(p => p.Id == id);
            if (process == null)
                return false;

            _db.Proccess.Remove(process);
            await _db.SaveChangesAsync();
            return true;
        }

        /* طراحی  فرآیند */


        /*  ADD Users  */
    public async Task AddLoginAsync(Login model)
{
    await _db.Logins.AddAsync(model);
    await _db.SaveChangesAsync();
}

public async Task AddAccessLevelAsync(AccessLevel access)
{
    await _db.AccessLevels.AddAsync(access);
    await _db.SaveChangesAsync();
}

public async Task AddLoginLogAsync(Log_Login newLog)
{
    var existingLog = await _db.Log_Logins
        .Where(l => l.Phone == newLog.Phone && l.Username == newLog.Username)
        .OrderByDescending(l => l.Id)
        .FirstOrDefaultAsync();

    if (existingLog != null && string.IsNullOrWhiteSpace(existingLog.DataLogout))
    {
        // ورود باز بدون خروج → فقط تاریخ ورود رو آپدیت کن
        existingLog.DataLogin = PersianDateHelper.GetNowShamsi();
        _db.Log_Logins.Update(existingLog);
    }
    else
    {
        // یا لاگ وجود نداشت، یا قبلی خروج داشت → لاگ جدید بساز
        await _db.Log_Logins.AddAsync(newLog);
    }

    await _db.SaveChangesAsync();
}
        public async Task<(bool IsValid, string? Error)> ValidateLoginAsync(Login model)
        {
            if (await _db.Logins.AnyAsync(l => l.Phone == model.Phone))
                return (false, "⛔ این شماره موبایل قبلاً ثبت شده است.");

            // if (await _db.Logins.AnyAsync(l => l.CodeMeli == model.CodeMeli))
            //     return (false, "⛔ این کد ملی قبلاً ثبت شده است.");

            return (true, null);
        }

        public async Task<bool> RegisterUserAsync(Login model)
        {
            // مثلا اعتبارسنجی و ذخیره
            if (string.IsNullOrWhiteSpace(model.Phone))
                return false;

            model.CodeVeryFive = CodeGenerator.GenerateCodeVeryfive();
            model.IdConnect = CodeGenerator.GenerateIdConnect();

            await _db.Logins.AddAsync(model);
            await _db.SaveChangesAsync();

            return true;
        }

        //DELTE USERS 
        public async Task<bool> DeleteUserByIdAsync(int id)
        {
            var user = await _db.Logins.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
                return false;

            _db.Logins.Remove(user);
            await _db.SaveChangesAsync();
            return true;
        }

        /*  ADD Users  */


        /*  حذف  در  هر حالتی  */
      public async Task<(bool Success, string Message)> DeleteRecords<T>(
        string? field, string? value, int? take = null
        ) where T : class
        {
            IQueryable<T> query;

            if (string.IsNullOrWhiteSpace(field) || string.IsNullOrWhiteSpace(value))
                {
                    // هیچ شرطی نیست → حذف کل جدول
                    query = _db.Set<T>();
                }
                else
                {
                    var prop = typeof(T).GetProperty(field);
                if (prop == null)
                    return (false, $"⛔ فیلد '{field}' در مدل '{typeof(T).Name}' پیدا نشد.");

                    Expression<Func<T, bool>> condition = x =>
                        EF.Property<object>(x, field).ToString() == value;

                    query = _db.Set<T>().Where(condition);
                }

                if (take.HasValue)
                    query = query.Take(take.Value);

                var items = await query.ToListAsync();

                if (!items.Any())
                    return (false, "⛔ رکوردی برای حذف پیدا نشد.");

                _db.Set<T>().RemoveRange(items);
                await _db.SaveChangesAsync();

                return (true, $"✅ {items.Count} رکورد از جدول {typeof(T).Name} حذف شد.");
            }

        /*  حذف  در  هر حالتی  */
        
        /* آپدیت کد تاییده */
        public async Task UpdateUserCodeVeryFiveAsync(Login user)
        {
            _db.Logins.Update(user);
            await _db.SaveChangesAsync();
        }
        public async Task<Login?> GetUserByPhoneAsync(string phone)
        {
            return await _db.Logins.FirstOrDefaultAsync(u => u.Phone == phone);
        }
        public async Task UpdateUserAsync(Login user)
        {
            _db.Logins.Update(user);
            await _db.SaveChangesAsync();
        }
        public async Task ConfirmLoginLogAsync(string? phone, string? username)
        {
            var log = await _db.Log_Logins
                .Where(l => l.Phone == phone && l.Username == username)
                .OrderByDescending(l => l.Id)
                .FirstOrDefaultAsync();

                if (log != null)
                {
                    log.OKCode = "true";
                    log.DataLogin = PersianDateHelper.GetNowShamsi();
                    _db.Log_Logins.Update(log);
                    await _db.SaveChangesAsync();
                }
        }
        /* آپدیت کد تاییده */

        /*  Wallet : والت کاربری   */
        public async Task AddWalletAsync(Wallet wallet)
        {
            _db.Wallets.Add(wallet);         // فرض بر اینکه DbSet<Wallet> اسمش Wallets هست
            await _db.SaveChangesAsync();
        }
        /*  Wallet : والت کاربری   */

    }


    /* Generate Code  */
    public static class CodeGenerator
    {
        private static Random random = new Random();

        public static string GenerateCodeVeryfive()
        {
            return random.Next(1000, 9999).ToString(); // 4 رقمی، می‌تونی 6 رقمی هم بزاری
        }

        public static string GenerateIdConnect()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, 20)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        
    }
    /* Generate Code  */



   


    


}
