using System.Net.Mail;
using System.Net;

namespace EBMSApp.Services
{
    public class EmailService
    {
        public static void SendEmail(string to, string subject, string body)
        {
            var fromAddress = new MailAddress("bhanuprasad.mekala@outlook.com", "EBMS Admin");
            var toAddress = new MailAddress(to);
            const string fromPassword = "Bhanu@7386";

            var smtp = new SmtpClient
            {
                Host = "smtp.outlook.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
            };

            using (var message = new MailMessage(fromAddress, toAddress)
            {
                Subject = subject,
                Body = body
            })
            {
                smtp.Send(message);
            }
        }
    }
}
