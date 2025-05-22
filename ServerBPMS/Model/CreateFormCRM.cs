namespace ServerBPMS.Model;

public class CreateFormCRM {
     public int Id { get; set; }
     public string? Json {get;set;}
     public string? NameForm {get;set;}
     public string? IdConnect {get;set;}  /* id ارتباطی  بین جدول ها */
}

