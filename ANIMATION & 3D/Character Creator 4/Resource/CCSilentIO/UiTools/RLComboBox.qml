import QtQuick 2.5
import QtQuick.Controls 1.5
import QtQuick.Layouts 1.3
import QtQuick.Controls.Styles 1.4
import QtQml 2.2


ComboBox {

    style: ComboBoxStyle {

        background: Rectangle {
            width: parent.width
            height: 25
            color: "transparent"
            border.width: 1
            border.color: control.enabled ? "#505050" : "#464646"

            Image {
                x: parent.x + parent.width - 15
                y: parent.y + 10
                source: control.enabled ? "../icon/ArrowPath_B.svg" : "../icon/ArrowPath_B_dis.svg"
                sourceSize.width: 10
                sourceSize.height: 25
            }
        }

        label: Text {
            x: 5
            y: 1
            font.pixelSize: 12
            font.family: "Arial"
            color: control.enabled ? "#c8c8c8" : "#464646"
            text: control.currentText
            renderType: Text.NativeRendering
        }

        // drop-down customization here

        property Component __dropDownStyle: MenuStyle {

            __maxPopupHeight: 300
            __menuItemType: "comboboxitem"

            frame: Rectangle {              // background
                color: "#282828"
                border.width: 1
                border.color: "#505050"
            }

            itemDelegate.label:             // an item text
                Text {
                    verticalAlignment: Text.AlignVCenter
                    horizontalAlignment: Text.AlignHCenter
                    font.pixelSize: 12
                    font.family: "Arial"
                    text: styleData.text
                    color: "#c8c8c8"
                    renderType: Text.NativeRendering
                }

            itemDelegate.background:       // selection or hover of an item
                Rectangle {
                    color: styleData.selected ? "#505050" : "#282828"
                }

            __scrollerStyle: ScrollViewStyle {
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
    }
}

