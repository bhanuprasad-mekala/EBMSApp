namespace EBMSApp.Models
{
    public class PayBill
    {
        public string? EmailID { get; set; }
        public int Year { get; set; }
        public string? Month { get; set; }
        public string? PaymentType { get; set; }
        public double AmountPaid { get; set; }
    }
}
