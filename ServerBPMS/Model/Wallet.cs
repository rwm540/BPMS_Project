namespace ServerBPMS.Model;

public class Wallet {
     public int Id { get; set; }
     public string? IdConnect {get;set;} // باید  به صورت hash  در دیتابیس  باید قرار  گیرد 
     public string? Toman {get;set;}
     public string? TransActions {get;set;} // برای  مدیریت  تراکنش  ها 
     //باز  شدن حساب  با CallWallet
     //بسته شدن حساب  با CloseWallet
     public string? BlockWallet {get;set;}
}