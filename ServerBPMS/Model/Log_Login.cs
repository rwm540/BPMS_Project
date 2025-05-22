namespace ServerBPMS.Model;

public class Log_Login {
     public int Id { get; set; }
     public string? Phone {get;set;}
     public string? Username {get;set;}
     public string? OKCode {get;set;} /* برای اینکه  ایا تایید  شده  است یا  خیر  */
     public string? DataLogin {get;set;}
     public string? DataLogout {get;set;}
}

