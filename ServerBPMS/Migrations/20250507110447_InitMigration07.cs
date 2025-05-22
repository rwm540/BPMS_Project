using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServerBPMS.Migrations
{
    /// <inheritdoc />
    public partial class InitMigration07 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Username",
                table: "AccessLevels",
                newName: "processDesign");

            migrationBuilder.RenameColumn(
                name: "Phone",
                table: "AccessLevels",
                newName: "PowerBi");

            migrationBuilder.RenameColumn(
                name: "LastName",
                table: "AccessLevels",
                newName: "Human_resources");

            migrationBuilder.RenameColumn(
                name: "FirstName",
                table: "AccessLevels",
                newName: "Forms");

            migrationBuilder.RenameColumn(
                name: "CodeVeryFive",
                table: "AccessLevels",
                newName: "Follow_up_report");

            migrationBuilder.RenameColumn(
                name: "CodeMeli",
                table: "AccessLevels",
                newName: "CRM");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "processDesign",
                table: "AccessLevels",
                newName: "Username");

            migrationBuilder.RenameColumn(
                name: "PowerBi",
                table: "AccessLevels",
                newName: "Phone");

            migrationBuilder.RenameColumn(
                name: "Human_resources",
                table: "AccessLevels",
                newName: "LastName");

            migrationBuilder.RenameColumn(
                name: "Forms",
                table: "AccessLevels",
                newName: "FirstName");

            migrationBuilder.RenameColumn(
                name: "Follow_up_report",
                table: "AccessLevels",
                newName: "CodeVeryFive");

            migrationBuilder.RenameColumn(
                name: "CRM",
                table: "AccessLevels",
                newName: "CodeMeli");
        }
    }
}
