using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace EBMSApp.Models
{
    public partial class Customer
    {
        public Customer()
        {
            Bills = new HashSet<Bill>();
        }

        public long CustomerId { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string EmailId { get; set; } = null!;
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; } = null!;
        public decimal Pincode { get; set; }
        public string Role { get; set; } = null!;
        public string Password { get; set; } = null!;
        public DateTime CreatedOn { get; set; }
        public DateTime? LastLogin { get; set; }
        [JsonIgnore]
        public virtual Payment? Payment { get; set; }
        [JsonIgnore]
        public virtual ICollection<Bill> Bills { get; set; }
    }
}
