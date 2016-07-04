$(function () {

    $('#chatBody').hide();
    $('#enablemessage').hide();
    $('#loginBlock').show();
    // Ссылка на автоматически-сгенерированный прокси хаба
    var chat = $.connection.chatHub;
    // Объявление функции, которая хаб вызывает при получении сообщений
    chat.client.addMessage = function (name, message) {
        // Добавление сообщений на веб-страницу 
        $('#chatroom').append('<p><b>' + htmlEncode(name)
            + '</b>: ' + htmlEncode(message) + '</p>');
    };
    //функция создания окна сообщения
    chat.client.Message = function(Notification, time) {
        {
            $('.success').append('<div class="close">☓</div>');
            $('.success').append('<p>' + htmlEncode(Notification+time) + ' </p>');
            $('.success').fadeIn('slow');
            $('.success').css('top', ($(window).height() - $('.success').outerHeight()) / 2 + 'px');
            $('.success').css('left', ($(window).width() - $('.success').outerWidth()) / 2 + 'px');
            function windowClose() {
                $('.success').fadeOut('slow');
            };
            setTimeout(function () { windowClose() }, 40000);
            $('.close').click(function () {
                windowClose();
            });
        };
    };
    // Функция, вызываемая при подключении нового пользователя
    chat.client.onConnected = function (id, userName, allUsers) {
        $('#loginBlock').hide();
        $('#chatBody').show();
        // установка в скрытых полях имени и id текущего пользователя
        $('#hdId').val(id);
        $('#username').val(userName);
        $('#header').html('<h3>Добро пожаловать, ' + userName + '</h3>');

        // Добавление всех пользователей
        for (i = 0; i < allUsers.length; i++) {

            AddUser(allUsers[i].ConnectionId, allUsers[i].Name);
        }
    }

    // Добавляем нового пользователя
    chat.client.onNewUserConnected = function (id, name) {

        AddUser(id, name);
    }

    // Удаляем пользователя
    chat.client.onUserDisconnected = function (id, userName) {

        $('#' + id).remove();
    }

    // Открываем соединение
    $.connection.hub.start().done(function () {

        $('#sendmessage').click(function () {
            // Вызываем у хаба метод Send
            chat.server.send($('#username').val(), $('#message').val());
            $('#message').val('');
        });

        // обработка логина, событие
        $("#btnLogin").click(function () {

            var name = $("#txtUserName").val();

            if (name == "admin") {
                $('#enablemessage').show();
            }
            else {
                if (name.length > 0) {

                    chat.server.connect(name);

                    if (name == "admin") {
                        $('#enablemessage').show();
                    }
                }


                else {
                    alert("Введите имя");
                }
            }
        });
        $("#btnmessage").click(function () {

            chat.server.sendnotice($('#txtmessage').val(), $('#time').val());
            $('#enablemessage').hide();

        });
    });
});
// Кодирование тегов
function htmlEncode(value) {
    var encodedValue = $('<div />').text(value).html();
    return encodedValue;
}
//Добавление нового пользователя
function AddUser(id, name) {

    var userId = $('#hdId').val();

    if (userId != id) {

        $("#chatusers").append('<p id="' + id + '"><b>' + name + '</b></p>');
    }
}