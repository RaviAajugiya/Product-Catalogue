namespace ProductCatalogue.DTOs.SubImages
{
    public class SubImagesCreateDTO
    {
        public int? ProductId { get; set; }
        public List<IFormFile> SubImages { get; set; } // List of IFormFile for multiple images
    }
}
