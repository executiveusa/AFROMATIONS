import QtQuick 2.5
import QtQuick.Controls 1.5
import QtQml.Models 2.2
import QtQuick.Controls.Styles 1.4
import QtQuick.Layouts 1.3


TableView {
    Rectangle {
        id: rectangle1
        x: 0
        y: 0
        width: parent.width
        height: parent.height
        color: "transparent"
        border.width: 1
        border.color: "#464646"
    }
    style: TableViewStyle {
        textColor: "#505050"
        backgroundColor: "#282828"
        highlightedTextColor: "#505050"

        handle: Item {

            implicitWidth: styleData.horizontal ? control.width : 15
            implicitHeight: styleData.horizontal ? 15:control.height

            Rectangle {
                color: styleData.hovered ? "#82be0f" : styleData.pressed ? "#55641b" : "#505050"
                radius: 10
                anchors.fill: parent
                anchors.topMargin: styleData.horizontal ? 4 : 6
                anchors.leftMargin: styleData.horizontal ? 6 : 4
                anchors.rightMargin: styleData.horizontal ? 6 : 4
                anchors.bottomMargin: styleData.horizontal ? 4 : 6
            }
        }

        scrollBarBackground: Rectangle {
            color: "#282828"
            implicitWidth: styleData.horizontal ? control.width : 15
            implicitHeight: styleData.horizontal ? 15 : control.height
            border.color: "#505050"
            border.width: 1
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.bottom: parent.bottom
            anchors.topMargin : 0
            anchors.bottomMargin : 0
            anchors.leftMargin : 0
            anchors.rightMargin : 0
        }

        decrementControl: Rectangle {
            implicitWidth: 0
            implicitHeight:0
            color: "transparent"
        }

        incrementControl: Rectangle {
            implicitWidth: 0
            implicitHeight:0
            color: "transparent"
        }

        rowDelegate: Rectangle {
            height: 25;
            width: parent.width
            color: styleData.selected ? "#000000" : "#282828"
            border.width: 0
        }

        itemDelegate: Item {
            Text {
                x: 5
                anchors.verticalCenter: parent.verticalCenter
                color: enabled ? "#c8c8c8" : "#464646"
                elide: styleData.elideMode
                text: styleData.value
                font.family: "Arial"
                font.pixelSize: 11
                renderType: Text.NativeRendering
            }
        }

        headerDelegate: Rectangle {
            height: 25;
            width: parent.width
            color: "#282828"
            border.width: 1
            border.color: "#505050"
            Text {
                id: name
                x: 1
                y: 5
                width: parent.width
                text: styleData.value
                font.family: "Arial"
                font.pixelSize: 11
                color: enabled ? "#c8c8c8" : "#464646"
                renderType: Text.NativeRendering
            }
        }
    }


}


