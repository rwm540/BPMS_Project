// File: ServerBPMS.Model/CrmFormData.cs
namespace ServerBPMS.Model;

using System;
using System.ComponentModel.DataAnnotations.Schema; // برای [Column(TypeName)] اگر نیاز باشد

public class CrmFormData
{
    public int Id { get; set; }

    // شناسه (Id) فرمی که این داده‌ها بر اساس آن ایجاد شده‌اند.
    // این فیلد به CreateFormCRM.Id ارجاع می‌دهد (Foreign Key).
    public int FormDefinitionId { get; set; }

    // این فیلد در SQL Server به عنوان NVARCHAR(MAX) ذخیره می‌شود.
    // تمام داده‌های ورودی کاربر برای این فرم (مثلاً {"نام مشتری": "علی", "سن": 30}) در اینجا به صورت JSON ذخیره می‌شوند.
    // [Column(TypeName = "nvarchar(max)")] // معمولاً EF Core خودش تشخیص می‌دهد، اما برای صراحت می‌توانید اضافه کنید.
    public string? FormDataJson { get; set; }

    public DateTime? CreatedDate { get; set; }
    public string? CreatedByUserId { get; set; } // ID کاربری که این فرم را پر کرده است
}