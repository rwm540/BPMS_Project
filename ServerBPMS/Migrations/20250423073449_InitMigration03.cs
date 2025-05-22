using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServerBPMS.Migrations
{
    /// <inheritdoc />
    public partial class InitMigration03 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DataLogout",
                table: "Log_Logins",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DataLogout",
                table: "Log_Logins");
        }
    }
}
