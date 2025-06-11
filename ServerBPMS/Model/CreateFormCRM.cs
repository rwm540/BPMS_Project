namespace ServerBPMS.Model;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema; // برای [NotMapped]
using System.Text.Json.Serialization; // برای [JsonIgnore]
using ServerBPMS.Model.DynamicForms; // برای دسترسی به FieldSchema

public class CreateFormCRM
{
    public int Id { get; set; }

    // این فیلد در دیتابیس (SQL Server) به عنوان NVARCHAR(MAX) یا مشابه ذخیره می‌شود.
    // محتوای آن، رشته JSON مربوط به Schema (تعریف فیلدهای فرم) خواهد بود.
    public string? SchemaJson { get; set; } // نام را از Json به SchemaJson تغییر دادیم برای وضوح بیشتر

    // این ویژگی (Property) در کد C# استفاده می‌شود اما به ستون دیتابیس نگاشت نمی‌شود.
    // Entity Framework Core آن را نادیده می‌گیرد و ما به صورت دستی آن را از SchemaJson پر می‌کنیم.
    [NotMapped] // این اطمینان می‌دهد که EF Core تلاشی برای نگاشت این به ستون دیتابیس نکند.
    [JsonIgnore] // اگر این مدل به عنوان DTO در API هم استفاده می‌شود، این اطمینان می‌دهد که در خروجی JSON نمایش داده نشود.
    public List<FieldSchema>? Schema { get; set; }

    public string? NameForm { get; set; }

    public string? IdConnect { get; set; }  /* id ارتباطی  بین جدول ها (مثلاً برای اتصال به یک مشتری خاص در CRM) */

    public DateTime? CreatedDate { get; set; } // تاریخ ایجاد فرم
    public DateTime? LastModifiedDate { get; set; } // تاریخ آخرین تغییر
    public string? CreatedByUserId { get; set; } // ID کاربری که فرم را ایجاد کرده است (می‌تواند به Login.IdConnect لینک شود)
}