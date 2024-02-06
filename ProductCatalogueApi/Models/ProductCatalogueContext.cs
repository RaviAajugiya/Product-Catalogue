using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using ProductCatalogue.Authentication;
using ProductCatalogue.DbModels;

namespace ProductCatalogue.Models
{
    public partial class ProductCatalogueContext : IdentityDbContext<ApplicationUser>
    {
        public ProductCatalogueContext()
        {
        }

        public ProductCatalogueContext(DbContextOptions<ProductCatalogueContext> options)
            : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }

        public DbSet<ProductTag> ProductTags { get; set; }

        public DbSet<SubImage> SubImages { get; set; }

        public DbSet<Tag> Tags { get; set; }

        public DbSet<Wishlist> Wishlists { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
