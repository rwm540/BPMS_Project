namespace ServerBPMS.Model;

public class CreateForm {
     public int Id { get; set; }
     public string? Json {get;set;}
     public string? TitleForm {get;set;}
     public string? NameCompany {get;set;}
     public string? Images {get;set;}
     public string? IdConnect {get;set;}  /* id ارتباطی  بین جدول ها */
}

