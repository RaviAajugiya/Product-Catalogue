using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using ProductCatalogue.Models;
using ProductCatalogue.Authentication;
using Syncfusion.HtmlConverter;
using Syncfusion.Pdf;
using AutoMapper;
using Microsoft.CodeAnalysis.Elfie.Serialization;
using NuGet.ContentModel;
using ProductCatalogue.DbModels;

namespace ProductCatalogue.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PdfController : ControllerBase
    {
        private readonly ProductCatalogueContext context;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IMapper mapper;

        public PdfController(ProductCatalogueContext context, UserManager<ApplicationUser> userManager, IMapper mapper)
        {
            this.context = context;
            this.userManager = userManager;
            this.mapper = mapper;
        }


        [HttpGet("wishlist-to-pdf")]
        public async Task<IActionResult> ConvertWishlistToPdf()
        {
            ApplicationUser currentUser = await userManager.GetUserAsync(HttpContext.User);

            if (currentUser == null)
            {
                return Unauthorized();
            }

            var wishlistProducts = context.Wishlist
                .Where(w => w.UserId == currentUser.Id)
                .Select(w => new
                {
                    ProductId = w.Product.ProductId,
                    Name = w.Product.Name,
                    Description = w.Product.Description,
                    Price = w.Product.Price,
                    MainImage = w.Product.MainImage,
                    SubImages = w.Product.SubImages.Select(si => new { si.SubImageId, si.ImagePath }).ToList(),
                    Tags = w.Product.ProductTags.Select(pt => new { pt.Tag.TagId, pt.Tag.Name }).ToList()
                })
                .ToList();

            // Read HTML template from file
            string htmlTemplatePath = "E:\\React Project\\Product-Catalogue\\ProductCatalogueApi\\Helper\\PdfTemplate.html";
            string htmlTemplate = await System.IO.File.ReadAllTextAsync(htmlTemplatePath);

            StringBuilder htmlContentBuilder = new StringBuilder();

            foreach (var product in wishlistProducts)
            {
                StringBuilder wishlistItemBuilder = new StringBuilder();
                wishlistItemBuilder.Append("<div class=\"wishlist-item\">");
                wishlistItemBuilder.Append($"<h2>{product.Name}</h2>");
                wishlistItemBuilder.Append($"<p>Description: {product.Description}</p>");
                wishlistItemBuilder.Append($"<p>Price: {product.Price}</p>");
                wishlistItemBuilder.Append($"<img src='E:\\React Project\\Product-Catalogue\\Product Catalogue\\src\\assets\\images\\{product.MainImage}' alt='{product.Name}' />");
                wishlistItemBuilder.Append("</div>");

                htmlContentBuilder.Append(wishlistItemBuilder.ToString());
                htmlContentBuilder.Append("<hr>");
            }

            string htmlContent = htmlTemplate.Replace("{{WishlistItems}}", htmlContentBuilder.ToString());

            // At this point, htmlContent should contain the dynamically generated HTML content with wishlist items.

            // Now, proceed with converting the HTML content to PDF using Syncfusion's HtmlToPdfConverter.

            HtmlToPdfConverter htmlConverter = new HtmlToPdfConverter();

            PdfDocument document = htmlConverter.Convert(htmlContent, "");

            MemoryStream stream = new MemoryStream();

            document.Save(stream);

            stream.Position = 0;

            return File(stream, "application/pdf", "Wishlist.pdf");
        }



    }
}
