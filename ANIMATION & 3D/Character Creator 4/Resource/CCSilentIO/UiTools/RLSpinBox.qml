import QtQuick 2.5
import QtQuick.Controls 1.5
import QtQuick.Layouts 1.3
import QtQuick.Controls.Styles 1.4
import QtQml 2.2


SpinBox {

    property string upArrow_default : "../icon/ArrowSpinner_T.svg"
    property string upArrow_pressed : "../icon/ArrowSpinner_T_sel.svg"
    property string upArrow_disabled : "../icon/ArrowSpinner_T_dis.svg"
    property string downArrow_default : "../icon/ArrowSpinner_B.svg"
    property string downArrow_pressed : "../icon/ArrowSpinner_B_sel.svg"
    property string downArrow_disabled : "../icon/ArrowSpinner_B_dis.svg"

    font.family: "Arial"
    font.pixelSize: 12

    style: SpinBoxStyle {

        background: Rectangle {
            id: spinbox
            implicitWidth: control.width
            implicitHeight: 25
            color: "#282828"
            border.color: control.enabled ? "#505050" : "#464646"
        }

        incrementControl: Item {
            implicitWidth: padding.right
            enabled: value != maximumValue
            Rectangle{
                anchors.centerIn: parent
                anchors.verticalCenterOffset: 0
                anchors.horizontalCenterOffset: 4
                height: 13
                width: 15
                border.width: 1
                border.color: control.enabled ? "#505050" : "#464646"
                color: styleData.upEnabled ? styleData.upPressed ? "#c8c8c8" : styleData.upHovered ? "#505050" : "transparent" : "transparent"
                visible: true
            }

            Image {

                anchors.centerIn: parent
                anchors.verticalCenterOffset: 0
                anchors.horizontalCenterOffset: 4
                sourceSize.width: 7
                sourceSize.height: 5
                source: enabled ? styleData.upEnabled ?  styleData.upPressed ? upArrow_pressed : styleData.upHovered ? upArrow_default : upArrow_default : upArrow_default : upArrow_disabled
                visible: true
            }
        }

        decrementControl: Item {
            implicitWidth: padding.right
            enabled: value != minimumValue
            Rectangle{
                anchors.centerIn: parent
                anchors.verticalCenterOffset: 0
                anchors.horizontalCenterOffset: 4
                height: 13
                width: 15
                border.width: 1
                border.color: control.enabled ? "#505050" : "#464646"
                color: styleData.downEnabled ? styleData.downPressed ? "#c8c8c8" : styleData.downHovered ? "#505050" : "transparent" : "transparent"
                visible: true
            }

            Image {

                anchors.centerIn: parent
                anchors.verticalCenterOffset: 0
                anchors.horizontalCenterOffset: 4
                sourceSize.width: 7
                sourceSize.height: 5
                source: enabled ? styleData.downEnabled ? styleData.downPressed ? downArrow_pressed : styleData.downHovered ? downArrow_default : downArrow_default : downArrow_default : downArrow_disabled
                visible: true
            }
        }
        textColor : control.enabled ? "#c8c8c8" : "#464646"
        horizontalAlignment: Qt.AlignLeft
    }
}


