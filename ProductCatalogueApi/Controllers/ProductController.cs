using System;
using System.IO;
using System.Threading.Tasks;
using AutoMapper;
using Azure.Core;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductCatalogue.DbModels;
using ProductCatalogue.DTOs.Product;
using ProductCatalogue.Models;
using Microsoft.AspNetCore.Http.Extensions;


namespace ProductCatalogue.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ProductCatalogueContext context;
        private readonly IMapper mapper;
        private readonly IWebHostEnvironment environment;

        public ProductController(ProductCatalogueContext context, IMapper mapper, IWebHostEnvironment environment)
        {
            this.context = context;
            this.mapper = mapper;
            this.environment = environment;
        }



        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> Get()
        {
            var products = await context.Product.ToListAsync();

            var productDTOs = mapper.Map<IEnumerable<ProductDTO>>(products);

            foreach (var productDTO in productDTOs)
            {
                var relativeUrl = Path.GetFullPath("wwwroot\\Upload\\images\\" + productDTO.MainImage);
                productDTO.MainImage = relativeUrl;
            }

            return Ok(productDTOs);
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromForm] ProductCreateDTO productCreateDTO)
        {
            string relativeMainImagePath = null;
            List<string> relativeSubImagePaths = new List<string>();

            // Process main image
            if (productCreateDTO.MainImage != null && productCreateDTO.MainImage.Length > 0)
            {
                var uploadsFolder = Path.Combine(environment.WebRootPath, "Upload", "images");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var uniqueMainFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(productCreateDTO.MainImage.FileName);
                var mainFilePath = Path.Combine(uploadsFolder, uniqueMainFileName);

                using (var fileStream = new FileStream(mainFilePath, FileMode.Create))
                {
                    await productCreateDTO.MainImage.CopyToAsync(fileStream);
                }

                // Store the relative path for main image
                relativeMainImagePath = uniqueMainFileName;
            }

            // Process sub images
            if (productCreateDTO.SubImages != null && productCreateDTO.SubImages.Count > 0)
            {
                foreach (var subImage in productCreateDTO.SubImages)
                {
                    var uploadsFolder = Path.Combine(environment.WebRootPath, "Upload", "images");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    var uniqueSubFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(subImage.FileName);
                    var subFilePath = Path.Combine(uploadsFolder, uniqueSubFileName);

                    using (var fileStream = new FileStream(subFilePath, FileMode.Create))
                    {
                        await subImage.CopyToAsync(fileStream);
                    }

                    // Store the relative path for sub image
                    relativeSubImagePaths.Add(uniqueSubFileName);
                }
            }

            // Set the relative paths in the DTO
            productCreateDTO.MainImagePath = relativeMainImagePath;
            productCreateDTO.SubImagePaths = relativeSubImagePaths;

            // Create the product entity
            var product = mapper.Map<Product>(productCreateDTO);
            context.Add(product);
            await context.SaveChangesAsync();
            return Ok();
        }

    }
}
