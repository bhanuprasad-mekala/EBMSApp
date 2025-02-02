using EBMSApp.Models;
using EBMSApp.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace EBMSApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : Controller
    {
        private readonly EBMSDBContext _context;
        public CustomerController()
        {
            _context = new EBMSDBContext();
        }

        [HttpPost]
        [Route("addCustomer")]
        public JsonResult AddCustomer([FromBody] Customer customer)
        {
            SqlParameter[] sqlParameters = {
            new SqlParameter("@FirstName",customer.FirstName),
            new SqlParameter("@LastName", customer.LastName),
            new SqlParameter("@EmailID", customer.EmailId),
            new SqlParameter("@DateOfBirth", customer.DateOfBirth),
            new SqlParameter("@Address", customer.Address),
            new SqlParameter("@Pincode", customer.Pincode),
            new SqlParameter("@Role", customer.Role),
            new SqlParameter("@Password", customer.Password)
            };
            SqlParameter prmResult = new SqlParameter("@return_value", SqlDbType.Int);
            prmResult.Direction = ParameterDirection.Output;

            _context.Database.ExecuteSqlRaw("EXEC @return_value = AddCustomer @FirstName, @LastName, @EmailID, @DateOfBirth, @Address, @Pincode, @Role, @Password", 
                prmResult, sqlParameters[0], sqlParameters[1], sqlParameters[2], sqlParameters[3], sqlParameters[4], sqlParameters[5], sqlParameters[6], sqlParameters[7]);
            if(prmResult.Value.ToString() == "1")
            {
                return Json("Customer Added Successfully");
            }
            else if(prmResult.Value.ToString() == "-1")
            {
                return Json("Customer already exists with given Email ID");
            }
            else
            {
                return Json("Failed to add customer");
            }
        }

        [HttpGet]
        [Route("getAllCustomers")]
        public JsonResult GetAllCustomers()
        {
            return Json(_context.Customers.ToList());
        }

        [HttpPut]
        [Route("updateCustomer")]
        public JsonResult UpdateCustomer([FromBody] Customer customer)
        {
            SqlParameter[] sqlParameters = {
            new SqlParameter("@CustomerID", customer.CustomerId),
            new SqlParameter("@FirstName",customer.FirstName),
            new SqlParameter("@LastName", customer.LastName),
            new SqlParameter("@EmailID", customer.EmailId),
            new SqlParameter("@DateOfBirth", customer.DateOfBirth),
            new SqlParameter("@Address", customer.Address),
            new SqlParameter("@Pincode", customer.Pincode),
            new SqlParameter("@Role", customer.Role)
            };
            SqlParameter prmResult = new SqlParameter("@return_value", SqlDbType.Int);
            prmResult.Direction = ParameterDirection.Output;

            _context.Database.ExecuteSqlRaw("EXEC @return_value = UpdateCustomer @CustomerID, @FirstName, @LastName, @EmailID, @DateOfBirth, @Address, @Pincode, @Role",
                prmResult, sqlParameters[0], sqlParameters[1], sqlParameters[2], sqlParameters[3], sqlParameters[4], sqlParameters[5], sqlParameters[6], sqlParameters[7]);

            if (prmResult.Value.ToString() == "1")
            {
                return Json("Customer Details Updated Successfully");
            }
            else
            {
                return Json("Failed to add customer");
            }
        }

        [HttpDelete]
        [Route("deleteCustomer")]
        public JsonResult DeleteCustomer(long customerId)
        {
            var customer = _context.Customers.Find(customerId);
            if(customer != null)
            {
                _context.Customers.Remove(customer);
                _context.SaveChanges();
                return Json("Customer Deleted Successfully");
            }
            else
            {
                return Json("Customer not found!!");
            }
        }

        [HttpGet]
        [Route("sendEmail")]
        public JsonResult SendEmail(string to, string subject, string body)
        {
            EmailService.SendEmail(to, subject, body);
            return Json("Sent");
        }
    }
}
