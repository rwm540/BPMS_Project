using Microsoft.EntityFrameworkCore;
using ServerBPMS.Model;



namespace ServerBPMS.Data;
public class bpms_cors_DbContext : DbContext
{
    public bpms_cors_DbContext(DbContextOptions<bpms_cors_DbContext> options)
        : base(options)
    {
    }
   public DbSet<Proccess> Proccess { get; set; }
   public DbSet<CreateForm> CreateForm { get;set; } 
   public DbSet<Login> Logins {get;set;}
   public DbSet<Log_Login> Log_Logins {get;set;}
   public DbSet<AccessLevel> AccessLevels {get;set;}
   public DbSet<Wallet> Wallets {get;set;}
}

