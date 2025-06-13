#ifndef CLIENTINTERFACE_H
#define CLIENTINTERFACE_H

#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QNetworkRequest>
#include "userdata.h"
#include <QUrl>
#include <QEventLoop>


#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include <QJsonValue>

class ClientInterface {

public:
    static ClientInterface * getInstance(const QString & root_url) {
        //check if objects of clientinterface exists
        if (existing_object == nullptr) {
            if (existing_object == nullptr) {
                existing_object = new ClientInterface(root_url);
            }
        }
        return existing_object;
    }

    UserData GetUser(unsigned int id);
    void DeleteUser(unsigned int id);
    void UpdateUser(unsigned int id);
    void CreateUser();
    void GetUsers();

    ~ClientInterface() {
        delete m_client;
    }

    static void removeInstance() {
        if (existing_object)
            delete existing_object;
        existing_object = nullptr;
    }

private:
    static ClientInterface * existing_object;
    ClientInterface(const QString & root_url)
        :m_root_url(root_url)
    {
        m_client = new QNetworkAccessManager();
    }
    QNetworkAccessManager *m_client = nullptr;

    QString m_root_url;
};

#endif
