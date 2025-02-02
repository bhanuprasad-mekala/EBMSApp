using EBMSApp.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using System.Data;

namespace EBMSApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BillsController : Controller
    {
        private readonly EBMSDBContext _context;
        public BillsController()
        {
            _context = new EBMSDBContext();
        }

        [HttpPost]
        [Route("addBill")]
        public JsonResult AddBill([FromBody] Bill bill)
        {
            SqlParameter[] sqlParameters = {
            new SqlParameter("@CustomerID",bill.CustomerId),
            new SqlParameter("@Month", bill.Month),
            new SqlParameter("@Year", bill.Year),
            new SqlParameter("@NoOfUnits", bill.NoOfUnits),
            new SqlParameter("@TotalAmount", bill.TotalAmount)
            };
            SqlParameter prmResult = new SqlParameter("@return_value", SqlDbType.Int);
            prmResult.Direction = ParameterDirection.Output;

            _context.Database.ExecuteSqlRaw("EXEC @return_value = AddBill @CustomerID, @Month, @Year, @NoOfUnits, @TotalAmount",
                prmResult, sqlParameters[0], sqlParameters[1], sqlParameters[2], sqlParameters[3], sqlParameters[4]);
            if (prmResult.Value.ToString() == "1")
            {
                return Json("Bill Added Successfully");
            }
            else if (prmResult.Value.ToString() == "-1")
            {
                return Json("Bill already exists");
            }
            else
            {
                return Json("Failed to add bill");
            }
        }

        [HttpGet]
        [Route("getAllBills")]
        public JsonResult GetAllBills()
        {
            return Json(_context.Bills.ToList());
        }

        [HttpPut]
        [Route("updateBill")]
        public JsonResult UpdateBill([FromBody] Bill bill)
        {
            var bills = _context.Bills.Find(bill.BillId);
            if (bills == null)
            {
                return Json("Bill is not found");
            }
            else
            {
                bills.NoOfUnits = bill.NoOfUnits;
                bills.TotalAmount = bill.TotalAmount;
                if (bills.UnpaisAmount == 0)
                {
                    bills.UnpaisAmount = bill.TotalAmount;
                }
                else
                {
                    bills.UnpaisAmount = bill.TotalAmount - bills.UnpaisAmount;
                }
                _context.SaveChanges();
                return Json("Bill Updated Successfully");
            }
        }

        [HttpGet]
        [Route("getBillByID")]
        public JsonResult GetBillsByID(string emailId)
        {
            var customerId = _context.Customers.Where(x => x.EmailId == emailId).FirstOrDefault().CustomerId;
            return Json(_context.Bills.Where(x => x.CustomerId == customerId).ToList());
        }

        [HttpGet]
        [Route("generateBill")]
        public DataSet GenerateBill(long billId)
        {
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();
            var bill = _context.Bills.Find(billId);

            DataRow dr = dt.NewRow();
            dr[0] = bill.BillId;
            dr[1] = bill.CustomerId;
            dr[2] = bill.Month;
            dr[3] = bill.Year;
            dr[4] = bill.NoOfUnits;
            dr[5] = bill.TotalAmount;
            dt.Rows.Add(dr);
            ds.Tables.Add(dt);
            return ds;
        }
    }
}
