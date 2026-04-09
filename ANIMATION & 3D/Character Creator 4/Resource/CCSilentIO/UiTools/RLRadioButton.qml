import QtQuick 2.5
import QtQuick.Controls 1.5
import QtQuick.Layouts 1.3
import QtQuick.Controls.Styles 1.4
import QtQml 2.2


RadioButton {

    property string checked_default : "../icon/RadioOn.svg"
    property string checked_hover : "../icon/RadioOn_hov.svg"
    property string checked_disable : "../icon/RadioOn_dis.svg"
    property string unchecked_default : "../icon/RadioOff.svg"
    property string unchecked_hover : "../icon/RadioOff_hov.svg"
    property string unchecked_disable : "../icon/RadioOff_dis.svg"

    style: RadioButtonStyle {
        indicator: Image {
            width: 18
            height: 18
            source: control.checked ? control.enabled ? control.hovered ? checked_hover : checked_default : checked_disable : control.enabled ? control.hovered ? unchecked_hover : unchecked_default : unchecked_disable
            mipmap: true
        }

        label: Text {
            id: text
            text: control.text
            color: enabled ? "#c8c8c8" : "#464646"
            font.family: "Arial"
            font.pixelSize: 12
            renderType: Text.NativeRendering
        }

        spacing: 6
   }
}

