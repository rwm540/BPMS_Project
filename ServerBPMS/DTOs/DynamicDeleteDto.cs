namespace ServerBPMS.DTOs
{
    public class DynamicDeleteDto
    {
        public string? Table { get; set; } = string.Empty;
        public string? ConditionField { get; set; }
        public string? ConditionValue { get; set; }
        public int? Take { get; set; } // اگر null بود = همه
    }
}