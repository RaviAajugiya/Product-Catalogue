using ProductCatalogue.DbModels;
using ProductCatalogue.Models;
using System;
using System.Collections.Generic;

public partial class Wishlist
{
    public int WishlistId { get; set; }

    public string UserId { get; set; } = null!;

    public int ProductId { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual AspNetUser User { get; set; } = null!;
}
