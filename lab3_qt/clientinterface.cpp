#include "clientinterface.h"
#include "userdata.h"
#include <QObject>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include <QDebug>
#include <QEventLoop>
#include <QDateTime>

ClientInterface* ClientInterface::existing_object = nullptr;

UserData ClientInterface::GetUser(const unsigned int id)
{
    QNetworkRequest request;
    request.setUrl(QUrl("http://127.0.0.1:8000/api/users/" + QString::number(id) + "/"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

    QNetworkReply *reply = m_client->get(request);

    QEventLoop eventLoop;
    QObject::connect(reply, &QNetworkReply::finished, &eventLoop, &QEventLoop::quit);
    eventLoop.exec();

    QByteArray responseData = reply->readAll();

    QJsonDocument jsonDoc = QJsonDocument::fromJson(responseData);

    UserData user;
    if (jsonDoc.isObject()) {
        user = UserData::fromJson(jsonDoc.object());
    } else {
        qDebug() << "Ошибка: Ожидался JSON-объект!";
    }

    qDebug() << "Пользователь:" << user.username << "| Email:" << user.email
             << "| Активен:" << user.isActive << "| Сотрудник:" << user.isStaff;

    reply->deleteLater();
    return user;
}

void ClientInterface::GetUsers()
{
    QNetworkRequest request;
    request.setUrl(QUrl("http://127.0.0.1:8000/api/users/"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

    QNetworkReply *reply = m_client->get(request);

    QEventLoop eventLoop;
    QObject::connect(reply, &QNetworkReply::finished, &eventLoop, &QEventLoop::quit);
    eventLoop.exec();

    QByteArray responseData = reply->readAll();
    QJsonDocument jsonDoc = QJsonDocument::fromJson(responseData);

    QList<UserData> users;

    if (jsonDoc.isArray()) {
        QJsonArray jsonArray = jsonDoc.array();
        for (const QJsonValue &value : jsonArray) {
            if (value.isObject()) {
                users.append(UserData::fromJson(value.toObject()));
            }
        }
    } else {
        qDebug() << "Ошибка: Ожидался JSON-массив!";
    }

    qDebug() << "Получено пользователей:" << users.size();
    for (const UserData &user : users) {
        qDebug() << "ID:" << user.id << "| Username:" << user.username
                 << "| Email:" << user.email << "| Active:" << user.isActive
                 << "| Staff:" << user.isStaff;
    }

    reply->deleteLater();
}

void ClientInterface::DeleteUser(const unsigned int id)
{
    QUrl url("http://127.0.0.1:8000/api/users/" + QString::number(id) + "/");
    QNetworkRequest request(url);
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

    QNetworkReply *reply = m_client->deleteResource(request);

    QEventLoop eventLoop;
    QObject::connect(reply, &QNetworkReply::finished, &eventLoop, &QEventLoop::quit);
    eventLoop.exec();

    QByteArray responseData = reply->readAll();

    if (reply->error() == QNetworkReply::NoError) {
        qDebug() << "Пользователь успешно удалён. ID:" << id;
    } else {
        qDebug() << "Ошибка при удалении пользователя:" << reply->errorString();
        qDebug() << "Ответ сервера:" << responseData;
    }

    reply->deleteLater();
}

void ClientInterface::CreateUser()
{
    QString unique = QString::number(QDateTime::currentSecsSinceEpoch());

    QJsonObject json;
    json["username"] = "newuser_" + unique;
    json["email"] = "newuser_" + unique + "@example.com";
    json["password"] = "StrongPass123";
    json["role"] = 1;
    json["is_active"] = true;
    json["is_staff"] = false;

    QJsonDocument doc(json);
    QByteArray data = doc.toJson();

    QUrl url("http://127.0.0.1:8000/api/users/");
    QNetworkRequest request(url);
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

    QNetworkReply *reply = m_client->post(request, data);

    QEventLoop eventLoop;
    QObject::connect(reply, &QNetworkReply::finished, &eventLoop, &QEventLoop::quit);
    eventLoop.exec();

    QByteArray responseData = reply->readAll();

    if (reply->error() == QNetworkReply::NoError) {
        qDebug() << "Пользователь успешно создан!";
        qDebug() << "Ответ сервера:" << responseData;
    } else {
        qDebug() << "Ошибка при создании пользователя:" << reply->errorString();
        qDebug() << "Ответ сервера:" << responseData;
    }

    reply->deleteLater();
}

void ClientInterface::UpdateUser(const unsigned int id)
{
    QJsonObject json;
    json["email"] = "updateduser@example.com";
    json["is_staff"] = true;
    json["role"] = 1;

    QJsonDocument doc(json);
    QByteArray data = doc.toJson();

    QUrl url("http://127.0.0.1:8000/api/users/" + QString::number(id) + "/");
    QNetworkRequest request(url);
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

    QNetworkReply *reply = m_client->sendCustomRequest(request, "PATCH", data);

    QEventLoop eventLoop;
    QObject::connect(reply, &QNetworkReply::finished, &eventLoop, &QEventLoop::quit);
    eventLoop.exec();

    QByteArray responseData = reply->readAll();

    if (reply->error() == QNetworkReply::NoError) {
        qDebug() << "Пользователь успешно обновлён!";
        qDebug() << "Ответ сервера:" << responseData;
    } else {
        qDebug() << "Ошибка при обновлении пользователя:" << reply->errorString();
        qDebug() << "Ответ сервера:" << responseData;
    }

    reply->deleteLater();
}
