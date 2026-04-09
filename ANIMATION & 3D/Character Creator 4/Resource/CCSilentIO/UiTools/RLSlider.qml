import QtQuick 2.5
import QtQuick.Controls 1.5
import QtQuick.Layouts 1.3
import QtQuick.Controls.Styles 1.4
import QtQml 2.2

Slider {

    property string handle_default: "../icon/Bollet.svg"
    property string handle_hover: "../icon/Bollet_hov.svg"
    property string handle_pressed: "../icon/Bollet_sel.svg"
    property string handle_disable: "../icon/Bollet_dis.svg"

    style: SliderStyle {

        groove: Rectangle {
            implicitWidth: control.width
            implicitHeight: 1
            color: control.enabled ? "#c8c8c8" : "#464646"
          }

        handle: Image {
            sourceSize.width: 14
            sourceSize.height: 14
            source: control.enabled ? control.pressed ? handle_pressed : control.hovered ? handle_hover : handle_default : handle_disable
        }
    }
}
