using AutoMapper;
using ProductCatalogue.DbModels;
using ProductCatalogue.DTOs.Product;
using ProductCatalogue.DTOs.Tags;
using System.IO;

namespace ProductCatalogue.Helper
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Product, ProductDTO>();
            CreateMap<Product, ProductCreateDTO>().ReverseMap();

            CreateMap<Tag, TagDTO>();
            CreateMap<Product, TagCreateDTO>().ReverseMap();

        }
    }
}
