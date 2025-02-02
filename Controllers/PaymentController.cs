using EBMSApp.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace EBMSApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : Controller
    {
        private readonly EBMSDBContext _context;
        public PaymentController()
        {
            _context = new EBMSDBContext();
        }

        [HttpPost]
        [Route("PayBill")]
        public JsonResult PayBill([FromBody]PayBill payBill)
        {
            var customerID = _context.Customers.Where(x => x.EmailId == payBill.EmailID).FirstOrDefault().CustomerId;
            SqlParameter[] sqlParameters = {
            new SqlParameter("@CustomerID",customerID),
            new SqlParameter("@Year", payBill.Year),
            new SqlParameter("@Month", payBill.Month),
            new SqlParameter("@PaymentType", payBill.PaymentType),
            new SqlParameter("@AmountPaid", payBill.AmountPaid)
            };
            SqlParameter prmResult = new SqlParameter("@return_value", SqlDbType.Int);
            prmResult.Direction = ParameterDirection.Output;
            _context.Database.ExecuteSqlRaw("EXEC @return_value = PayBill @CustomerID, @Year, @Month, @PaymentType, @AmountPaid",
                prmResult, sqlParameters[0], sqlParameters[1], sqlParameters[2], sqlParameters[3], sqlParameters[4]);
            if(prmResult.Value.ToString() == "1")
            {
                return Json("Payment Successful!!");
            }
            else if(prmResult.Value.ToString() == "-1")
            {
                return Json("Bill not found");
            }
            else
            {
                return Json("Payment Failed!!");
            }
        }

        [HttpGet]
        [Route("getAllPayments")]
        public JsonResult GetAllPayments()
        {
            var payments = _context.Payments.ToList();
            List<Payments> paymentsList = new List<Payments>();
            payments.ForEach(payment =>
            {
                var customer = _context.Customers.Find(payment.CustomerId);
                var bill = _context.Bills.Find(payment.BillId);
                Payments pay = new Payments();
                pay.PaymentID = payment.PaymentId;
                pay.CustomerName = customer.FirstName + ", " + customer.LastName;
                pay.Month = bill.Month;
                pay.Year = bill.Year;
                pay.PaymentType = payment.PaymentType;
                pay.Amount = payment.AmountPaid;
                pay.PaymentDateTime = payment.PaymentDT;
                pay.Status = payment.Status;
                paymentsList.Add(pay);
            });
            return Json(paymentsList);
        }

        [HttpGet]
        [Route("getPayment")]
        public JsonResult GetPayment(string emailId)
        {
            var customerId = _context.Customers.Where(x => x.EmailId == emailId).FirstOrDefault().CustomerId;
            var payments = _context.Payments.Where(x => x.CustomerId == customerId).ToList();
            List<Payments> paymentsList = new List<Payments>();
            payments.ForEach(payment =>
            {
                var customer = _context.Customers.Find(payment.CustomerId);
                var bill = _context.Bills.Find(payment.BillId);
                Payments pay = new Payments();
                pay.PaymentID = payment.PaymentId;
                pay.CustomerName = customer.FirstName + ", " + customer.LastName;
                pay.Month = bill.Month;
                pay.Year = bill.Year;
                pay.PaymentType = payment.PaymentType;
                pay.Amount = payment.AmountPaid;
                pay.PaymentDateTime = payment.PaymentDT;
                pay.Status = payment.Status;
                paymentsList.Add(pay);
            });
            return Json(paymentsList);
        }
    }
}
