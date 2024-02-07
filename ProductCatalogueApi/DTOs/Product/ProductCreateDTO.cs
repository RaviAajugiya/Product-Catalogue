using Microsoft.AspNetCore.Http;
using ProductCatalogue.DTOs.Tags;
using System.Collections.Generic;

namespace ProductCatalogue.DTOs.Product
{
    public class ProductCreateDTO
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public IFormFile? MainImage { get; set; }
        public List<IFormFile>? SubImages { get; set; } // List of sub images as IFormFile
        public List<string>? SubImagePaths { get; set; } // List of sub image paths
        public string? MainImagePath { get; set; }

        public List<int> TagIds { get; set; }

    }
}
