using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductCatalogue.Authentication;
using ProductCatalogue.DbModels;
using ProductCatalogue.DTOs.SubImages;
using ProductCatalogue.Models;

namespace ProductCatalogue.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubImagesController : ControllerBase
    {
        private readonly ProductCatalogueContext context;
        private readonly IMapper mapper;
        private readonly IWebHostEnvironment environment;

        public SubImagesController(ProductCatalogueContext context, IMapper mapper, IWebHostEnvironment environment)
        {
            this.context = context;
            this.mapper = mapper;
            this.environment = environment;
        }

        [HttpGet("{productId}")]
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
                var relativeUrl = subImageDTO.ImagePath;
                subImageDTO.ImagePath = relativeUrl;
            }

            return subImageDTOs;
        }

        [HttpDelete("{imageId}")]
        public async Task<ActionResult> Delete(int imageId)
        {
            var subImage = await context.SubImage.FindAsync(imageId);

            if (subImage == null)
            {
                return NotFound();
            }
            context.SubImage.Remove(subImage);
            await context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("{productId}")]
        public async Task<ActionResult> Post(int productId, [FromForm] SubImagesCreateDTO subImagesCreateDTO)
        {
            if (subImagesCreateDTO.SubImages != null && subImagesCreateDTO.SubImages.Count > 0)
            {
                var uploadsFolder = @"E:\React Project\Product-Catalogue\Product Catalogue\src\assets\images";


                foreach (var image in subImagesCreateDTO.SubImages)
                {
                    var uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(image.FileName);
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await image.CopyToAsync(fileStream);
                    }

                    var subImage = new SubImage { ProductId = productId, ImagePath = uniqueFileName };
                    context.Add(subImage);
                }

                await context.SaveChangesAsync();

                return Ok(new Response { Status = "Success", Message = "Images added successfully" });
            }

            return BadRequest("No images provided.");
        }

    }
}
