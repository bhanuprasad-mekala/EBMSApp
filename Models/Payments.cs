namespace EBMSApp.Models
{
    public class Payments
    {
        public long PaymentID { get; set; }
        public string? CustomerName { get; set; }
        public string? Month { get; set; }
        public int Year { get; set; }
        public string? PaymentType { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaymentDateTime { get; set; }
        public bool Status { get; set; }
    }
}
