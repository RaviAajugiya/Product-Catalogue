using System;
using System.Collections.Generic;

namespace ProductCatalogue.DbModels;

public partial class SubImage
{
    public int SubImageId { get; set; }

    public int? ProductId { get; set; }

    public string? ImagePath { get; set; }

    public virtual Product? Product { get; set; }
}
