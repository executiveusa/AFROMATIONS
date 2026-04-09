import QtQuick 2.5
import QtQuick.Layouts 1.3
import QtQuick.Controls 1.5
import QtQuick.Controls.Styles 1.4


ToolButton {

    property string icon
    property string hoverIcon: icon
    property string pressedIcon
    property string checkedIcon
    property string disableIcon
    property int iconWidth: 23
    property int iconHeight: 23

    style: ButtonStyle {

        background: Rectangle {
            border.width: 1
            border.color: control.enabled ? "#505050" : "#464646"
            color: control.enabled ? control.checked ? "#c8c8c8" : control.pressed ? "#c8c8c8" : control.hovered ? "#505050" : "transparent" : "transparent"

            Image {
                source: control.enabled ? control.checked ? checkedIcon : control.pressed ? control.pressedIcon : control.hovered ? hoverIcon : control.icon : control.disableIcon
                sourceSize.height: iconHeight
                sourceSize.width: iconWidth
                anchors.horizontalCenter: parent.horizontalCenter
                anchors.verticalCenter: parent.verticalCenter
            }
        }
    }
}


