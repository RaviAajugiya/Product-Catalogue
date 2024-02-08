namespace ProductCatalogue.DTOs.Wishlist
{
    public class WishlistDTO
    {
        public int WishlistId { get; set; }

        public string UserId { get; set; } = null!;

        public int ProductId { get; set; }
    }
}
