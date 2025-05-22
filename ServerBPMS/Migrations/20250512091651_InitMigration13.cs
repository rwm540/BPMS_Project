using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServerBPMS.Migrations
{
    /// <inheritdoc />
    public partial class InitMigration13 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BlockWallet",
                table: "Wallets",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BlockWallet",
                table: "Wallets");
        }
    }
}
