﻿using System;
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
using Microsoft.AspNetCore.Authorization;


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
        public async Task<ActionResult<IEnumerable<ProductDTO>>> Get(
             [FromQuery] List<int>? filter,
             [FromQuery] int? minPrice,
             [FromQuery] int? maxPrice,
             [FromQuery] string? search)
        {
            IQueryable<Product> query = context.Product.Include(p => p.ProductTags);

            if (filter != null && filter.Any())
            {
                query = query.Where(p => p.ProductTags.Any(pt => filter.Contains(pt.TagId)));
            }

            if (minPrice.HasValue && maxPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice.Value && p.Price <= maxPrice.Value);
            }
            else if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice.Value);
            }
            else if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
            }

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p => p.Name.Contains(search));
            }
            int? dbMaxPrice = await context.Product.MaxAsync(p => (int?)p.Price);

            var productDTOs = await query
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
                                        Name = tag.Tag.Name
                                    })
                                    .ToList()
                })
                .ToListAsync();

            return Ok(new { MaxPrice = dbMaxPrice, Data = productDTOs });
        }


        [HttpGet("maxPrice")]
        public async Task<ActionResult> Get()
        {
            int? dbMaxPrice = await context.Product.MaxAsync(p => (int?)p.Price);
            return Ok(dbMaxPrice);
        }


        [HttpGet("{productId}")]
        public async Task<ActionResult<ProductDTO>> GetProductById(int productId)
        {
            var product = await context.Product
                .Include(p => p.SubImages)
                .Include(p => p.ProductTags)
                    .ThenInclude(pt => pt.Tag)
                .FirstOrDefaultAsync(p => p.ProductId == productId);

            if (product == null)
            {
                return NotFound();
            }

            var productDTO = mapper.Map<ProductDTO>(product);

            return Ok(productDTO);
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

        [Authorize(Roles = "Admin")]
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

        [Authorize(Roles = "Admin")]
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
                var uploadsFolder = @"E:\React Project\Product-Catalogue\Product Catalogue\src\assets\images";

                var uniqueMainFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(productUpdateDTO.MainImage.FileName);
                var mainFilePath = Path.Combine(uploadsFolder, uniqueMainFileName);

                using (var fileStream = new FileStream(mainFilePath, FileMode.Create))
                {
                    await productUpdateDTO.MainImage.CopyToAsync(fileStream);
                }

                product.MainImage = uniqueMainFileName;
            }

            var existingTags = await context.ProductTag.Where(tag => tag.ProductId == productId).ToListAsync();
            context.ProductTag.RemoveRange(existingTags);

            // Add new tags provided in the request
            foreach (var tagId in productUpdateDTO.TagIds)
            {
                var productTag = new ProductTag { ProductId = productId, TagId = tagId };
                context.ProductTag.Add(productTag);
            }

            await context.SaveChangesAsync();

            //Process sub images if included in the request
            //if (productUpdateDTO.SubImages != null && productUpdateDTO.SubImages.Count > 0)
            //{
            //    product.SubImages = [];
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

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult> Post([FromForm] ProductCreateDTO productCreateDTO)
        {
            string relativeMainImagePath = null;
            List<string> relativeSubImagePaths = new List<string>();

            // Process main image
            if (productCreateDTO.MainImage != null && productCreateDTO.MainImage.Length > 0)
            {
                var uploadsFolder = @"E:\React Project\Product-Catalogue\Product Catalogue\src\assets\images";
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
                    var uploadsFolder = @"E:\React Project\Product-Catalogue\Product Catalogue\src\assets\images";
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
