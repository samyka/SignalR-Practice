using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SignalRBackend.Data;
using SignalRBackend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SignalRBackend.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly EmployeeDbContext _context;
        private readonly IHubContext<NotificationsHub, IHubClient> _hubContext;
        public NotificationsController( EmployeeDbContext context, IHubContext<NotificationsHub, IHubClient> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        // Get: api/Notifications/notifictioncounter
        [Route("notificationcounter")]
        [HttpGet]
        public async Task<ActionResult<NotificationsCounter>> GetNotifictionCounter()
        {
            return new NotificationsCounter()
            {
                Counter = await (from notifications in _context.Notifications select notifications).CountAsync()
            }; 
        }

        // Get: api/Notifications/notificatonmessage
        [Route("notificationmessage")]
        [HttpGet]
        public async Task<ActionResult<List<NotificationsMessage>>> GetNotificationMessage()
        {
            var messages = from
                          message in _context.Notifications
                          orderby
                          message.NotificationId descending
                          select new NotificationsMessage
                          {
                              EmployeeName = message.EmployeeName,
                              ActionNotice = message.ActionNotice
                          };
            return await messages.ToListAsync();
        }

        // Delete: api/Notifications/deletenotifications
        [HttpDelete]
        [Route("deletenotifications")]
        public async Task<IActionResult> DeleteNotification()
        {
            await _context.Database.ExecuteSqlRawAsync("TRUNCATE TABLE Notifications");
            await _context.SaveChangesAsync();
            await _hubContext.Clients.All.NotificationsHub();

            return Ok();

        }
    }
}
