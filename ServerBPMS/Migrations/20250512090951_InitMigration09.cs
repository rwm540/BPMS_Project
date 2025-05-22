using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServerBPMS.Migrations
{
    /// <inheritdoc />
    public partial class InitMigration09 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TransActions",
                table: "Wallets",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "BLock",
                table: "Logins",
                type: "bit",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TransActions",
                table: "Wallets");

            migrationBuilder.DropColumn(
                name: "BLock",
                table: "Logins");
        }
    }
}
