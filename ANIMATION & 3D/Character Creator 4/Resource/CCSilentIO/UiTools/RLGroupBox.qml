import QtQuick 2.5
import QtQuick.Controls 1.5
import QtQuick.Layouts 1.3
import QtQuick.Controls.Styles 1.4
import QtQml 2.2


Item {

    id: groupBox
    property string    title

    Rectangle{

        x: parent.x
        y: parent.y
        width: parent.width
        height: parent.height
        border.color: "#505050"
        border.width: 1
        color: "transparent"
        anchors.fill: parent
}

    Rectangle {
        color: "#282828"
        Text {
            x: 5
            text: parent.parent.title
            color: enabled ? "#c8c8c8" : "#464646"
            font.family: "Arial"
            font.pixelSize: 12
            renderType: Text.NativeRendering
        }
        width: childrenRect.width + 10
        height: childrenRect.height
        anchors.top: parent.top
        anchors.topMargin: -8
        anchors.left: parent.left
        anchors.leftMargin: 10
    }
}
