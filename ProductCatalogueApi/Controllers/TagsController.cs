using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductCatalogue.Authentication;
using ProductCatalogue.DbModels;
using ProductCatalogue.DTOs.Tags;
using ProductCatalogue.Models;

namespace ProductCatalogue.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagsController : ControllerBase
    {
        private readonly ProductCatalogueContext context;
        private readonly IMapper mapper;

        public TagsController(ProductCatalogueContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        //Add multiple tags in form of array
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] TagAddDTO tags)
        {
            foreach (var tagName in tags.Name)
            {
                var tagExists = await context.Tag.AnyAsync(tag => tag.Name == tagName);

                if (tagExists)
                {
                    return Ok(new Response { Status = "Error", Message = "Tag Already Exists" });
                }

                var tag = new Tag { Name = tagName };
                context.Add(tag);
            }

            await context.SaveChangesAsync();

            return Ok(new Response { Status = "Success", Message = "Tags added successfully" });
        }


        [HttpPost("AssignTags/{id}")]
        public async Task<ActionResult> AssignTags(int id, [FromBody] List<int> tagIds)
        {
            var productTagsToDelete = await context.ProductTag.Where(productTag => productTag.ProductId == id).ToListAsync();
            context.ProductTag.RemoveRange(productTagsToDelete);


            foreach (var tagId in tagIds)
            {
                var ProductTag = new ProductTag { ProductId = id, TagId = tagId };
                context.Add(ProductTag);
            }

            await context.SaveChangesAsync();

            return Ok(new Response { Status = "Success", Message = "Tags Assigned successfully" });
        }

    }
}
