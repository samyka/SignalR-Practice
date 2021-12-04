using Microsoft.EntityFrameworkCore;
using SignalRBackend.Models;

namespace SignalRBackend.Data
{
    public class EmployeeDbContext : DbContext
    {
        public EmployeeDbContext (DbContextOptions<EmployeeDbContext> options) : base(options) { }

        public DbSet<Employees> Employees { get; set; }
        public DbSet<Notifications> Notifications { get; set; }
    }
}
