import QtQuick 2.5
import QtQuick.Controls 1.5
import QtQuick.Layouts 1.3
import QtQuick.Controls.Styles 1.4
import QtQml 2.2


CheckBox {

    property string checked_default : "../icon/CheckOn_sel.svg"
    property string checked_hover : "../icon/CheckOn_hov.svg"
    property string checked_disable : "../icon/CheckOn_dis.svg"
    property string unchecked_default : "../icon/CheckOff.svg"
    property string unchecked_hover : "../icon/CheckOff_hov.svg"
    property string unchecked_disable : "../icon/CheckOff_dis.svg"

    property bool bold : false

    style: CheckBoxStyle {

        indicator: Image {
            sourceSize.width: 18
            sourceSize.height: 18
            source: control.checked ? control.hovered ? checked_hover : control.enabled ? checked_default : checked_disable :
                    control.hovered ? unchecked_hover : control.enabled ? unchecked_default : unchecked_disable
        }

        label: Text {
            id: text
            text: control.text
            color: control.enabled ? "#c8c8c8" : "#464646"
            font.family: "Arial"
            font.pixelSize: 12
            font.bold : bold
            wrapMode: Text.Wrap
            renderType: Text.NativeRendering
        }

        spacing: 6
    }
}
