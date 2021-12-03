using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SignalRBackend.Models
{
    public class Employees
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string EmployeeId { get; set; }
        public string EmployeeName { get; set; } 
        public string Department { get; set; }
        public string Designation {get; set ;}
        public string Gender { get; set; }
        public DateTime JoinDate { get; set; }
        public string PhoneNumber { get; set; }

    }
}
