using System;
using System.Collections.Generic;

namespace ProductCatalogue.DbModels;

public partial class ProductTag
{
    public int ProductTagId { get; set; }

    public int ProductId { get; set; }

    public int TagId { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual Tag Tag { get; set; } = null!;
}
