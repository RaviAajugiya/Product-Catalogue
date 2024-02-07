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
using ProductCatalogue.DTOs.SubImages;
using ProductCatalogue.DTOs.Tags;
using ProductCatalogue.Authentication;


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
            var productDTOs = await context.Product
                .Select(product => new ProductDTO
                {
                    ProductId = product.ProductId,
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price,
                    MainImage = product.MainImage,
                    SubImages = context.SubImage
                                    .Where(subImg => subImg.ProductId == product.ProductId)
                                    .Select(subImg => new SubImageDTO
                                    {
                                        SubImageId = subImg.SubImageId,
                                        ImagePath = subImg.ImagePath

                                    })
                                    .ToList(),
                    Tags = context.ProductTag
                                    .Where(tag => tag.ProductId == product.ProductId)
                                    .Select(tag => new TagDTO
                                    {
                                        TagId = tag.TagId,
                                        Name = tag.Tag.Name // Assuming there's a navigation property from ProductTag to Tag called "Tag"
                                    })
                                    .ToList()
                })
                .ToListAsync();

            return Ok(productDTOs);
        }



        [HttpGet("subimage/{productId}")]
        public async Task<ActionResult<List<SubImageDTO>>> GetSubImages(int productId)
        {
            var subImages = await context.SubImage.Where(s => s.ProductId == productId).ToListAsync();

            if (!subImages.Any())
            {
                return NotFound();
            }

            var subImageDTOs = mapper.Map<List<SubImageDTO>>(subImages);

            foreach (var subImageDTO in subImageDTOs)
            {
                var relativeUrl = Path.GetFullPath("wwwroot\\Upload\\images\\" + subImageDTO.ImagePath);
                subImageDTO.ImagePath = relativeUrl;
            }

            return subImageDTOs;
        }

        [HttpDelete("{productId}")]
        public async Task<ActionResult> Delete(int productId)
        {
            var product = await context.Product.FindAsync(productId);

            if (product == null)
            {
                return NotFound();
            }
            context.Product.Remove(product);
            await context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPatch("{productId}")]
        public async Task<ActionResult> Patch(int productId, [FromForm] ProductCreateDTO productUpdateDTO)
        {
            var product = await context.Product.Include(p => p.SubImages).FirstOrDefaultAsync(p => p.ProductId == productId);

            if (product == null)
            {
                return NotFound();
            }

            // Update properties of the existing product
            mapper.Map(productUpdateDTO, product);

            // Process main image if included in the request
            if (productUpdateDTO.MainImage != null && productUpdateDTO.MainImage.Length > 0)
            {
                var uploadsFolder = Path.Combine(environment.WebRootPath, "Upload", "images");
                var uniqueMainFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(productUpdateDTO.MainImage.FileName);
                var mainFilePath = Path.Combine(uploadsFolder, uniqueMainFileName);

                using (var fileStream = new FileStream(mainFilePath, FileMode.Create))
                {
                    await productUpdateDTO.MainImage.CopyToAsync(fileStream);
                }

                product.MainImage = uniqueMainFileName;
            }

            // Process sub images if included in the request
            //if (productUpdateDTO.SubImages != null && productUpdateDTO.SubImages.Count > 0)
            //{
            //    product.SubImages = []
            //    foreach (var subImage in productUpdateDTO.SubImages)
            //    {
            //        var uploadsFolder = Path.Combine(environment.WebRootPath, "Upload", "images");
            //        var uniqueSubFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(subImage.FileName);
            //        var subFilePath = Path.Combine(uploadsFolder, uniqueSubFileName);

            //        using (var fileStream = new FileStream(subFilePath, FileMode.Create))
            //        {
            //            await subImage.CopyToAsync(fileStream);
            //        }

            //        // Store the relative path for sub image
            //        var subImageEntity = new SubImage { ProductId = productId, ImagePath = uniqueSubFileName };
            //        product.SubImages.Add(subImageEntity);
            //    }
            //}

            await context.SaveChangesAsync();

            return Ok();
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

            var product = mapper.Map<Product>(productCreateDTO);
            product.MainImage = relativeMainImagePath;
            context.Add(product);
            await context.SaveChangesAsync();

            int productId = product.ProductId;


            var productTagsToDelete = await context.ProductTag.Where(productTag => productTag.ProductId == productId).ToListAsync();
            context.ProductTag.RemoveRange(productTagsToDelete);


            foreach (var tagId in productCreateDTO.TagIds)
            {
                var ProductTag = new ProductTag { ProductId = productId, TagId = tagId };
                context.Add(ProductTag);
            }

            await context.SaveChangesAsync();


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

                // Map SubImagesCreateDTO to SubImage and add to context
                foreach (var subImagePath in relativeSubImagePaths)
                {
                    var subImage = new SubImage { ProductId = productId, ImagePath = subImagePath };
                    context.Add(subImage);
                }

                await context.SaveChangesAsync();
            }

            return Ok(new Response { Status = "Success", Message = "Tags added successfully" });

        }

    }
}
