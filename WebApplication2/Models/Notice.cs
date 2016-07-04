using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication2.Models
{
    public class Notice
    {
        public bool NotificationServer { get; set; } = false;
        public string Notification { get; set; }
        public  DateTime Time { get; set; }
    }
}