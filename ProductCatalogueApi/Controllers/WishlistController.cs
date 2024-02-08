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
        [Authorize] // Ensure user is authenticated
        public async Task<ActionResult<IEnumerable<ProductDTO>>> Get()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized();
            }

            var productDTOs = await context.Product
                .Where(p => context.Wishlist.Any(w => w.ProductId == p.ProductId && w.UserId == userId))
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

            return Ok(productDTOs);
        }

        [HttpPost("{productId}")]
        [Authorize] // Ensure user is authenticated
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
