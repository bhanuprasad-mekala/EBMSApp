using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace EBMSApp.Models
{
    public partial class Payment
    {
        public long PaymentId { get; set; }
        public long CustomerId { get; set; }
        public long BillId { get; set; }
        public string PaymentType { get; set; } = null!;
        public decimal AmountPaid { get; set; }
        public DateTime PaymentDT { get; set; }
        public bool Status { get; set; }
        [JsonIgnore]
        public virtual Bill Bill { get; set; } = null!;
        [JsonIgnore]
        public virtual Customer PaymentNavigation { get; set; } = null!;
    }
}
