using System.Collections.Generic;
using System;

namespace GamePriceTracker.Domain.Entities
{
    public class Game
    {
        public int Id { get; set; } 

        public required string Title { get; set; }

        public required string Publisher { get; set; }

        public DateTime ReleaseDate { get; set; }


        public string? ImageUrl { get; set; } 

        public ICollection<PriceEntry> PriceEntries { get; set; } = new List<PriceEntry>(); 

        public int PlatformId { get; set; } 
        public Platform Platform { get; set; } = null!;
    }
}