using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace GamePriceTracker.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddForumSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Reviews_GameId_UserId",
                table: "Reviews");

            migrationBuilder.InsertData(
                table: "ForumCategories",
                columns: new[] { "Id", "Description", "Name" },
                values: new object[,]
                {
                    { 1, "Oyunlar hakkında her şey.", "Genel Sohbet" },
                    { 2, "PC ve Konsol donanımları.", "Donanım Tavsiyeleri" },
                    { 3, "Ne oynasam diyenler için.", "Oyun Önerileri" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_GameId",
                table: "Reviews",
                column: "GameId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Reviews_GameId",
                table: "Reviews");

            migrationBuilder.DeleteData(
                table: "ForumCategories",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "ForumCategories",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "ForumCategories",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_GameId_UserId",
                table: "Reviews",
                columns: new[] { "GameId", "UserId" },
                unique: true);
        }
    }
}
