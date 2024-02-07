namespace ProductCatalogue.DTOs.SubImages
{
    public class SubImagesCreateDTO
    {
        public int? ProductId { get; set; }
        public IFormFile? SubImage { get; set; }
        public string? SubImagePath { get; set; }
    }
}
