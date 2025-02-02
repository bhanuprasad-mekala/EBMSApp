using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace EBMSApp.Models
{
    public partial class Bill
    {
        public Bill()
        {
            Payments = new HashSet<Payment>();
        }

        public long BillId { get; set; }
        public long CustomerId { get; set; }
        public string Month { get; set; } = null!;
        public int Year { get; set; }
        public int NoOfUnits { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal UnpaisAmount { get; set; }
        [JsonIgnore]
        public virtual Customer? Customer { get; set; } = null!;
        [JsonIgnore]
        public virtual ICollection<Payment> Payments { get; set; }
    }
}
