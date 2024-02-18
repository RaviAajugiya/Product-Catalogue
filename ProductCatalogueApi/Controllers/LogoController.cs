using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProductCatalogue.Models;
using System;
using System.IO;
using System.Threading.Tasks;

namespace ProductCatalogue.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogoController : ControllerBase
    {
        private readonly ProductCatalogueContext _context;
        private readonly IMapper _mapper;
        private readonly string _uploadsFolder;

        public LogoController(ProductCatalogueContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            _uploadsFolder = @"E:\React Project\Product-Catalogue\Product Catalogue\src\assets\logo";
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadLogo(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            try
            {
                // Ensure the uploads folder exists
                Directory.CreateDirectory(_uploadsFolder);

                // Validate that the file is a PNG image
                if (Path.GetExtension(file.FileName).ToLower() != ".png")
                {
                    return BadRequest("Only PNG files are allowed.");
                }

                // Construct the file path with a fixed file name "logo"
                var fileName = "logo.png";
                var filePath = Path.Combine(_uploadsFolder, fileName);

                // If the file already exists, delete it
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }

                // Save the file to the uploads folder
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                return Ok(new { FileName = fileName, FilePath = filePath });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error uploading file: " + ex.Message);
            }
        }
    }
}
