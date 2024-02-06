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

        public virtual DbSet<Product> Product { get; set; }

        public virtual DbSet<ProductTag> ProductTag { get; set; }

        public virtual DbSet<SubImage> SubImage { get; set; }

        public virtual DbSet<Tag> Tag { get; set; }

        public virtual DbSet<Wishlist> Wishlist { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AspNetUserLogin>()
                .HasKey(l => new { l.LoginProvider, l.ProviderKey });

            modelBuilder.Entity<AspNetUserToken>()
                .HasKey(t => new { t.UserId, t.LoginProvider, t.Name });
        }


    }
}
