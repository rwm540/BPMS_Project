// File: ServerBPMS.Model.DynamicForms/FieldSchema.cs
using System.Collections.Generic;

namespace ServerBPMS.Model.DynamicForms; // اطمینان حاصل کنید که دقیقاً این باشد

public class FieldSchema
{
    public string? Type { get; set; }
    public string? Title { get; set; }
    public List<FieldOption>? Options { get; set; }
    public string? DefaultValue { get; set; }
    public bool? IsRequired { get; set; }
    public string? Placeholder { get; set; }
    public string? IdPrefix { get; set; }
    public bool? IsReadOnly { get; set; } = false;
}