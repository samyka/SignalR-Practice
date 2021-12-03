using System.Threading.Tasks;

namespace SignalRBackend.Models
{
    public interface IHubClient
    {
        Task NotificationsHub();
    }
}