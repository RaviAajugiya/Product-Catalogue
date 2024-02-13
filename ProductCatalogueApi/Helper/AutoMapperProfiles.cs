using AutoMapper;
using ProductCatalogue.DbModels;
using ProductCatalogue.DTOs.Product;
using ProductCatalogue.DTOs.SubImages;
using ProductCatalogue.DTOs.Tags;
using ProductCatalogue.DTOs.Wishlist;

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

        CreateMap<Wishlist, WishListCreateDTO>().ReverseMap();
        CreateMap<Wishlist, WishlistDTO>();


        CreateMap<SubImage, SubImageDTO>();
        CreateMap<SubImagesCreateDTO, SubImage>();

        CreateMap<ProductTag, TagDTO>();
        CreateMap<Product, ProductDTO>()
            .ForMember(dest => dest.Tags, opt => opt.MapFrom(src =>
                src.ProductTags.Select(pt => pt.Tag).Select(tag => new TagDTO
                {
                    TagId = tag.TagId,
                    Name = tag.Name
                }).ToList()
            ));

    }
}
