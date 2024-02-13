using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductCatalogue.Authentication;
using ProductCatalogue.DTOs.Product;
using ProductCatalogue.DTOs.SubImages;
using ProductCatalogue.DTOs.Tags;
using ProductCatalogue.DTOs.Wishlist;
using ProductCatalogue.Models;

namespace ProductCatalogue.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class WishlistController : ControllerBase
    {
        private readonly ProductCatalogueContext context;
        private readonly IMapper mapper;

        public WishlistController(ProductCatalogueContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> Get()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized();
            }

            var wishlistProducts = await context.Wishlist
                .Where(w => w.UserId == userId)
                .Select(w => new ProductDTO
                {
                    ProductId = w.Product.ProductId,
                    Name = w.Product.Name,
                    Description = w.Product.Description,
                    Price = w.Product.Price,
                    MainImage = w.Product.MainImage,
                    SubImages = w.Product.SubImages.Select(si => new SubImageDTO
                    {
                        SubImageId = si.SubImageId,
                        ImagePath = si.ImagePath
                    }).ToList(),
                    Tags = w.Product.ProductTags.Select(pt => new TagDTO
                    {
                        TagId = pt.Tag.TagId,
                        Name = pt.Tag.Name
                    }).ToList()
                })
                .ToListAsync();

            return Ok(wishlistProducts);
        }


        [HttpDelete("{productId}")]
        [Authorize]
        public async Task<IActionResult> Delete(int productId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized();
            }

            var wishlistItem = await context.Wishlist
                .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);

            if (wishlistItem == null)
            {
                return NotFound();
            }

            context.Wishlist.Remove(wishlistItem);
            await context.SaveChangesAsync();

            return Ok(new Response { Status = "Success", Message = "Product removed from wishlist successfully" });
        }




        [HttpPost("{productId}")]
        [Authorize]
        public async Task<IActionResult> Post(int productId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized();
            }

            var wishlist = new Wishlist
            {
                ProductId = productId,
                UserId = userId
            };

            context.Add(wishlist);
            await context.SaveChangesAsync();

            return Ok(new Response { Status = "Success", Message = "Product added to wishlist successfully" });
        }
    }
}
