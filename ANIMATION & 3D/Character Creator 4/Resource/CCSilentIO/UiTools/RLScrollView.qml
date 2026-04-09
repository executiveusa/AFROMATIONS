import QtQuick 2.5
import QtQuick.Controls 1.5
import QtQml.Models 2.2
import QtQuick.Controls.Styles 1.4
import QtQuick.Layouts 1.3


ScrollView {

    style: ScrollViewStyle {

        handle: Item {
            implicitWidth: 15

            Rectangle {
                color: styleData.hovered ? "#82be0f" : styleData.pressed ? "#55641b" : "#505050"
                radius: 10
                anchors.fill: parent
                anchors.topMargin: 6
                anchors.leftMargin: 4
                anchors.rightMargin: 4
                anchors.bottomMargin: 6
            }
        }

        scrollBarBackground: Rectangle {
            implicitWidth: 15
            color:"transparent"
        }

        decrementControl: Rectangle {
            width: 15
            height: 5
            color:"transparent"
        }

        incrementControl: Rectangle {
            width: 15
            height: 5
            color:"transparent"
        }
    }
}


