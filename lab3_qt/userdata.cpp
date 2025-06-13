#include "userdata.h"

UserData::UserData(int id, QString username, QString email, bool isActive, bool isStaff)
    : id(id), username(username), email(email), isActive(isActive), isStaff(isStaff) {}
// JSON в объект
UserData UserData::fromJson(const QJsonObject &json) {
    return UserData(
        json["id"].toInt(),
        json["username"].toString(),
        json["email"].toString(),
        json["is_active"].toBool(),
        json["is_staff"].toBool()
        );
}
