using AutoMapper;
using Microsoft.AspNetCore.Authorization;
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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TagDTO>>> GetTags()
        {
            var tags = await context.Tag
                .Select(tag => new TagDTO
                {
                    TagId = tag.TagId,
                    Name = tag.Name
                })
                .ToListAsync();
            return tags;
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var tag = await context.Tag.FindAsync(id);

            if (tag == null)
            {
                return NotFound();
            }
            context.Tag.Remove(tag);
            await context.SaveChangesAsync();
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] TagAddDTO tags)
        {
            var newTags = new List<Tag>();

            foreach (var tagName in tags.Name)
            {
                var tagExists = await context.Tag.AnyAsync(tag => tag.Name == tagName);

                if (tagExists)
                {
                    return Ok(new Response { Status = "Error", Message = "Tag Already Exists" });
                }

                var tag = new Tag { Name = tagName };
                context.Add(tag);
                newTags.Add(tag); // Add the newly created tag to the list
            }

            await context.SaveChangesAsync();

            return Ok(new { Status = "Success", Message = "Tags added successfully", NewTags = newTags });
        }


        [Authorize(Roles = "Admin")]

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
