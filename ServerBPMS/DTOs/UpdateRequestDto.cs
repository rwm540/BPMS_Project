namespace ServerBPMS.DTOs
{
    public class UpdateRequestDto
    {
        public string? Table { get; set; } = string.Empty;
        public string? ConditionField { get; set; } = string.Empty;
        public string? ConditionValue { get; set; } = string.Empty;
        public int? Take { get; set; }
        public Dictionary<string, object> NewValues { get; set; } = new();
    }
}