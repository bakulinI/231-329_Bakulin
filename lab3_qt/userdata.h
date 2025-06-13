#ifndef USERDATA_H
#define USERDATA_H

#include <QString>
#include <QJsonObject>

class UserData {
public:
    int id;
    QString username;
    QString email;
    bool isActive;
    bool isStaff;

    UserData(int id, QString username, QString email, bool isActive, bool isStaff);
    UserData() : id(0), username(""), email(""), isActive(false), isStaff(false) {}

    static UserData fromJson(const QJsonObject &json);
};

#endif // USERDATA_H
