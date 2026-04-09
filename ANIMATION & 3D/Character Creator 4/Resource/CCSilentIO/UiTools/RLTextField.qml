import QtQuick 2.5
import QtQuick.Controls 1.5
import QtQuick.Layouts 1.3
import QtQuick.Controls.Styles 1.4
import QtQml 2.2


TextField {
    property var setPlaceholderTextColor;


    style: TextFieldStyle {
        font.family: "Arial"
        textColor: enabled ? "#c8c8c8" : "#464646"
        placeholderTextColor: setPlaceholderTextColor;
        background: Rectangle {
            radius: 0
            border.color: enabled ? "#505050" : "#464646"
            border.width: 1
            color: "#282828"
        }
    }
}
