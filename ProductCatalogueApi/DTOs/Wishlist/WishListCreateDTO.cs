namespace ProductCatalogue.DTOs.Wishlist
{
    public class WishListCreateDTO
    {
        public string UserId { get; set; } = null!;

        public int ProductId { get; set; }
    }
}
