using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
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
    public class EmployeesController : ControllerBase 
    {
        private readonly EmployeeDbContext _context;
        private readonly IHubContext<NotificationsHub, IHubClient> _hubContext;     

        public EmployeesController(EmployeeDbContext context, IHubContext<NotificationsHub, IHubClient> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        // Get: api/Employees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employees>>> GetEmployee()
        {
            return await _context.Employees.ToListAsync();
        }

        // Get: api/Employees/3
        [HttpGet("{employeeId}")]
        public async Task<ActionResult<Employees>> GetEmployee(string employeeId)
        {
            var employee = await _context.Employees.FindAsync(employeeId);
            if (employee == null)
            {
                return NotFound();
            }
            return employee;
        }

        // Post: api/Employees
        [HttpPost]
        public async Task<ActionResult<Employees>> CreateEmployee(Employees employee)
        {
            employee.EmployeeId = Guid.NewGuid().ToString();
            _context.Employees.Add(employee);

            _context.Notifications.Add(new Notifications()
            {
                EmployeeName = employee.EmployeeName,
                ActionNotice = "Created"
            });

            try
            {
                await _context.SaveChangesAsync();
                await _hubContext.Clients.All.NotificationsHub();
            }
            catch (DbUpdateException)
            {
                if (_context.Employees.Any(e => e.EmployeeId == employee.EmployeeId))
                {
                    return Conflict();
                }
                else
                {
                    throw ;
                }
            }
            return CreatedAtAction("GetEmployee", new {employeeId = employee.EmployeeId }, employee);
        }
        
        // Put: api/Employees/3
        [HttpPut("{employeeId}")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateEmployee(string employeeId, Employees employee)
        {
            if (employeeId == employee.EmployeeId)
            {
                _context.Entry(employee).State = EntityState.Modified;

                Notifications notification = new Notifications()
                {
                    EmployeeName = employee.EmployeeName,
                    ActionNotice = "Updated"
                };
                _context.Notifications.Add(notification);

                try
                {
                    await _context.SaveChangesAsync();
                    await _hubContext.Clients.All.NotificationsHub();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!_context.Employees.Any(e => e.EmployeeId == employeeId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return Ok();
            }
            return BadRequest();
        }

        // Delete: api/Employees
        [HttpDelete("{employeeId}")]
        public async Task<IActionResult> DeleteEmployee(string employeeId)
        {
            var employee = await _context.Employees.FindAsync(employeeId);
            
            if (employee != null)
            {
                _context.Employees.Remove(employee);
                _context.Notifications.Add(new Notifications()
                {
                    EmployeeName = employee.EmployeeName,
                    ActionNotice = "Deleted!"
                });

                await _context.SaveChangesAsync();
                await _hubContext.Clients.All.NotificationsHub();

                return NoContent();
            }
            return NotFound();
        }
    }
}
