using EBMSApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace EBMSApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : Controller
    {
        // Add your action methods here
        private readonly EBMSDBContext _context;
        public LoginController()
        {
            _context = new EBMSDBContext();
        }

        [HttpPost]
        [Route("login")]
        public JsonResult Login([FromBody] Login loginRequest)
        {
            var customer = _context.Customers
                .FirstOrDefault(c => c.EmailId == loginRequest.EmailId && c.Password == loginRequest.Password);

            if (customer == null)
            {
                return Json("Invalid CustomerID or password.");
            }
            else
            {
                customer.LastLogin = DateTime.Now;
                _context.SaveChanges();

            }

            // Generate token or any other login logic here

            return Json(customer.Role.ToString());
        }
    }
}
