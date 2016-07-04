using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using WebApplication2.Models;

namespace WebApplication2.Hubs
{
    public class ChatHub : Hub
    {
        static List<User> Users = new List<User>();
        static Notice new_notice = new Notice();


        // Отправка сообщений
        public void Send(string name, string message)
        {
            Clients.All.addMessage(name, message);
        }

        //отправляем уведомление
        public void Sendnotice(string Notification, DateTime time)
        {
            if (DateTime.Now < time)
            {
                new_notice.Notification = Notification;
                new_notice.NotificationServer = true;
                new_notice.Time = time;
                string date = "Осталось: " + (new_notice.Time - DateTime.Now).Days + " дней " + (new_notice.Time - DateTime.Now).Hours + " часов " + (new_notice.Time - DateTime.Now).Minutes + "  минут ";
                Clients.Others.Message(Notification, date);
            }
        }
        // Подключение нового пользователя
        public void Connect(string userName)
        {
            var id = Context.ConnectionId;


            if (!Users.Any(x => x.ConnectionId == id))
            {
                Users.Add(new User { ConnectionId = id, Name = userName });

                // Посылаем сообщение текущему пользователю
                Clients.Caller.onConnected(id, userName, Users);

                // Посылаем сообщение всем пользователям, кроме текущего
                Clients.AllExcept(id).onNewUserConnected(id, userName);

                if (new_notice.NotificationServer)//проверям включено ли уведомление
                {
                    if (DateTime.Now < new_notice.Time)
                    {
                        string date = "Осталось: " + (new_notice.Time - DateTime.Now).Days + " дней " + (new_notice.Time - DateTime.Now).Hours + " часов " + (new_notice.Time - DateTime.Now).Minutes + "  минут ";
                        Clients.Caller.Message(new_notice.Notification, date);
                    }
                    else
                    {
                        new_notice.NotificationServer = false;
                    }
                }
            }
        }

        // Отключение пользователя
        public override System.Threading.Tasks.Task OnDisconnected(bool stopCalled)
        {
            var item = Users.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            if (item != null)
            {
                Users.Remove(item);
                var id = Context.ConnectionId;
                Clients.All.onUserDisconnected(id, item.Name);
            }

            return base.OnDisconnected(stopCalled);
        }
    }
}