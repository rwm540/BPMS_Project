namespace ServerBPMS.Model;

public class Login {
     public int Id { get; set; }
     public string? Phone {get;set;}
     public string? Username {get;set;}
     public string? FirstName {get;set;}
     public string? LastName {get;set;}
     public string? CodeMeli {get;set;}
     public string? CodeVeryFive {get;set;}
     public string? IdConnect {get;set;}  /* id ارتباطی  بین جدول ها */
     public bool? BLock { get; set; }
}

