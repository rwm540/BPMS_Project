using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServerBPMS.Migrations
{
    /// <inheritdoc />
    public partial class initigration06 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CodeMeli",
                table: "Logins",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "Logins",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IdConnect",
                table: "Logins",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LastName",
                table: "Logins",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IdConnect",
                table: "CreateForm",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AccessLevels",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CodeMeli = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CodeVeryFive = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IdConnect = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccessLevels", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AccessLevels");

            migrationBuilder.DropColumn(
                name: "CodeMeli",
                table: "Logins");

            migrationBuilder.DropColumn(
                name: "FirstName",
                table: "Logins");

            migrationBuilder.DropColumn(
                name: "IdConnect",
                table: "Logins");

            migrationBuilder.DropColumn(
                name: "LastName",
                table: "Logins");

            migrationBuilder.DropColumn(
                name: "IdConnect",
                table: "CreateForm");
        }
    }
}
