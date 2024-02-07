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
                var relativeUrl = Path.GetFullPath("wwwroot\\Upload\\images\\" + subImageDTO.ImagePath);
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
            string relativeSubImagePath = null;

            if (subImagesCreateDTO.SubImage != null && subImagesCreateDTO.SubImage.Length > 0)
            {
                var uploadsFolder = Path.Combine(environment.WebRootPath, "Upload", "images");
                var uniqueMainFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(subImagesCreateDTO.SubImage.FileName);
                var mainFilePath = Path.Combine(uploadsFolder, uniqueMainFileName);

                using (var fileStream = new FileStream(mainFilePath, FileMode.Create))
                {
                    await subImagesCreateDTO.SubImage.CopyToAsync(fileStream);
                }
                relativeSubImagePath = uniqueMainFileName;
            }

            var subImage = new SubImage { ProductId = productId, ImagePath = relativeSubImagePath };
            context.Add(subImage);
            await context.SaveChangesAsync();

            return Ok(new Response { Status = "Success", Message = "Tags added successfully" });

        }
    }
}
