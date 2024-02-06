namespace ProductCatalogue.DTOs.Product
{
    public class ProductCreateDTO
    {
        public string Name { get; set; } = null!;

        public string? Description { get; set; }

        public decimal Price { get; set; }

        public string? MainImage { get; set; }

    }
}
