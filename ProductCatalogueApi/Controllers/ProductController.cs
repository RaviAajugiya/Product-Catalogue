using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductCatalogue.DbModels;
using ProductCatalogue.DTOs.Product;
using ProductCatalogue.Models;
using System.Diagnostics.Metrics;

namespace ProductCatalogue.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ProductCatalogueContext context;
        private readonly IMapper mapper;

        public ProductController(ProductCatalogueContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        //[HttpGet]
        //public async Task<ActionResult<List<ProductDTO>>> Get()
        //{
        //    var products = await context.Products.ToListAsync();
        //    var productDTOs = mapper.Map<List<ProductDTO>>(products);
        //    return productDTOs;
        //}

        //[HttpPost]
        //public async Task<ActionResult> Post([FromBody] ProductCreateDTO productCreateDTO)
        //{
        //    var product = mapper.Map<Product>(productCreateDTO);
        //    context.Add(product);
        //    await context.SaveChangesAsync();
        //    return Ok();
        //}

    }
}
