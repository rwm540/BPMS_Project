namespace ServerBPMS.Model;

public class AccessLevel {
     public int Id { get; set; }
     public string? processDesign {get;set;} /* طراحی  فرآیند */
     public string? Follow_up_report {get;set;} /* گزارش  پیگیری */
     public string? Forms {get;set;} /* فرم ساز */
     public string? CRM {get;set;} /*  crm  */
     public string? PowerBi {get;set;} /* power bi  */
     public string? Human_resources {get;set;} /* منابع  انسانی  */
     public string? IdConnect {get;set;}  /* id ارتباطی  بین جدول ها */
}