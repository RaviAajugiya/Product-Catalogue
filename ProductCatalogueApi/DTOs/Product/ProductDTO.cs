using ProductCatalogue.DbModels;
using ProductCatalogue.DTOs.SubImages;
using ProductCatalogue.DTOs.Tags;
using System.Text.Json.Serialization;

namespace ProductCatalogue.DTOs.Product
{
    public class ProductDTO
    {
        public int ProductId { get; set; }

        public string Name { get; set; } = null!;

        public string? Description { get; set; }

        public decimal Price { get; set; }

        public string? MainImage { get; set; }

        public List<SubImageDTO>? SubImages { get; set; }
        public List<TagDTO>? Tags { get; set; }



    }
}
