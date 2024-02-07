using AutoMapper;
using ProductCatalogue.DbModels;
using ProductCatalogue.DTOs.Product;
using ProductCatalogue.DTOs.SubImages;
using ProductCatalogue.DTOs.Tags;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<Product, ProductDTO>();
        CreateMap<Product, ProductCreateDTO>().ReverseMap();

        CreateMap<ProductCreateDTO, Product>()
            .ForMember(dest => dest.MainImage, opt => opt.Ignore())
            .ForMember(dest => dest.SubImages, opt => opt.Ignore()); // Ignore the SubImages property

        CreateMap<Tag, TagDTO>();

        CreateMap<SubImage, SubImageDTO>();
        CreateMap<SubImagesCreateDTO, SubImage>();
    }
}
