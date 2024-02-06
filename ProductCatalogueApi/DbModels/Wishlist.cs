using System;
using System.Collections.Generic;

namespace ProductCatalogue.DbModels;

public partial class Wishlist
{
    public int WishlistId { get; set; }

    public string UserId { get; set; } = null!;

    public int ProductId { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual AspNetUser User { get; set; } = null!;
}
