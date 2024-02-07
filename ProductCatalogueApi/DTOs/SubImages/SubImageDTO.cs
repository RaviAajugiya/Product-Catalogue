using System.Text.Json.Serialization;

namespace ProductCatalogue.DTOs.SubImages
{
    public class SubImageDTO
    {
        public int SubImageId { get; set; }

        [JsonIgnore]
        public int? ProductId { get; set; }

        public string? ImagePath { get; set; }
    }
}
