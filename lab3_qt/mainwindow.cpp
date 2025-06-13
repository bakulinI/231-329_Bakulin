#include "mainwindow.h"
#include "./ui_mainwindow.h"
#include "userdata.h"
#include "clientinterface.h"
#include <QDebug>

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    ui->setupUi(this);
}

MainWindow::~MainWindow()
{
    delete ui;
}
// Методы для работы с API
// Получить одного пользователя (по ID)
void MainWindow::on_get_1_event_clicked()
{
    ClientInterface *client = ClientInterface::getInstance("http://127.0.0.1:8000/");
    UserData user = client->GetUser(1);

    qDebug() << "Получен пользователь ID=1:";
    qDebug() << "Username:" << user.username;
    qDebug() << "Email:" << user.email;
}

// Получить всех пользователей
void MainWindow::on_get_events_clicked()
{
    ClientInterface *client = ClientInterface::getInstance("http://127.0.0.1:8000/");
    client->GetUsers();
}

// Удалить пользователя с ID = 7
void MainWindow::on_delete_button_clicked()
{
    ClientInterface *client = ClientInterface::getInstance("http://127.0.0.1:8000/");
    client->DeleteUser(7);
}

// Создать нового пользователя
void MainWindow::on_create_clicked()
{
    ClientInterface *client = ClientInterface::getInstance("http://127.0.0.1:8000/");
    client->CreateUser();
}

// Обновить пользователя с ID = 3
void MainWindow::on_update_clicked()
{
    ClientInterface *client = ClientInterface::getInstance("http://127.0.0.1:8000/");
    client->UpdateUser(3);
}
