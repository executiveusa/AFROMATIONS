/****************************************************************************
**
**  目的：結合Qt quick 內建 coltrols type Slider & SpinBox 成為一個 component
**  使用：將SliderValue.qml加到資源檔(.qrc)裡面或丟到同層目錄下
**  例如：
SliderValue {
    min : -100
    max : 100
    value : 50
    updateValueWhileDragging : false
    spinBoxActiveFocusOnPress : false
    sliderActiveFocusOnPress : true
    suffix : "cm"
    prefix : "@"
    sliderStyle : CustomSliderStyle{}
    spinBoxStyle : CustomSpinBoxStyle{}
    onEditFinished : print("--------Edit finished--------"+value)
}
****************************************************************************/
import QtQuick 2.5
import QtQuick.Controls 1.5
import QtQuick.Layouts 1.3
import QtQuick.Controls.Styles 1.4
import QtQml 2.2

Item
{
    id : sliderValue
    width: 0
    height: 37
    //shared property
    property string objectName
    property real   max     : 1             //設定最大值，預設1
    property real   min     : 0             //設定最小值，預設0
    property real   value   : 0             //設定目前值，預設0
    property real   defaultValue   : 0      //設定預設値，預設0
    property real   stepSize: 1             //設定跳動數值大小，預設1
    property real   oldValue                //用來記錄舊的value值
                                            //防止開dialog時，slider從0->最小值的valueChange
    property bool   blockFirstValueChange: true
    property string   text                  //設定標題文字
    Component.onCompleted   :
    {
        slider.value = sliderValue.value
        spinBox.value = sliderValue.value
        oldValue = sliderValue.value
    }
    //set spinBox property
    property int    decimals: 0             //設定spinBox小數精確度，預設0
    property string suffix                  //設定spinBox後置字元，預設空字串
    property string prefix                  //設定spinBox前置字元，預設空字串
    property font   font                    //設定spinBox字體相關，預設空
    property int    horizontalAlignment        :1
    property bool   spinBoxActiveFocusOnPress  :true
    property int    spinboxwidth:55
    //set slider property
    property bool   sliderActiveFocusOnPress   :false
    property bool   updateValueWhileDragging   :true    //設定slider是否在拖動時更新數值，預設true
    property bool   tickmarksEnabled           :false   //設定slider 刻度條，預設false
    property alias  sliderPressed              :slider.pressed

    //set style
    property Component sliderStyle  : SliderStyle{}
    //signal
    signal editFinished()
    //function
    function setValue( myValue )
    {
        if ( myValue < min ) {
            myValue = min;
        } else if ( myValue > max ) {
            myValue = max;
        }

        sliderValue.value = myValue;
        slider.value = myValue;
        spinBox.value = myValue;
        sliderValue.oldValue = myValue;
    }

    function getValue(){
        return value;
    }

    //timer
    property int interval:250
    property int defaultCount : 2

    Timer
    {
        id : timer
        interval: sliderValue.interval
        repeat: true
        triggeredOnStart: false
        property int count:sliderValue.defaultCount
        Component.onCompleted: {
            this.running = false
        }
        onTriggered:
        {
            count --
            if( count == 0 )
            {
                if( sliderValue.value != sliderValue.oldValue )
                {
                    editFinished()
                }
                count = sliderValue.defaultCount
                sliderValue.oldValue = sliderValue.value
                running = false
            }
        }
    }

    ColumnLayout{
        id: columLayout1
        x: 0
        y: 0
        width: sliderValue.width
        height: 37
        spacing: 0

        Label{
            id: label
            width: sliderValue.width
            height: 15
            text: sliderValue.text
            font.pixelSize: 12
            wrapMode: Text.WordWrap
            transformOrigin: Item.Center
            color: sliderValue.enabled ? "#c8c8c8" : "#464646"
            font.family: "Arial"
            MouseArea {
                anchors.fill: parent
                hoverEnabled: true
                onDoubleClicked: {
                    slider.value = sliderValue.defaultValue
                }
            }
        }

        RowLayout {
            id: rowLayout1
            x: 0
            y: 18
            width: 300
            height: 25
            spacing: 10

            RLSpinBox
            {
                anchors.leftMargin: 10
                anchors.left: slider.right
                id                 : spinBox
                width: spinboxwidth
                maximumValue       : sliderValue.max
                minimumValue       : sliderValue.min
                stepSize           : sliderValue.stepSize
                decimals           : sliderValue.decimals
                suffix             : sliderValue.suffix
                prefix             : sliderValue.prefix
                horizontalAlignment: sliderValue.horizontalAlignment
                activeFocusOnPress : sliderValue.spinBoxActiveFocusOnPress
                value              : sliderValue.value
                //enabled            : enabled

                onValueChanged:
                {
                    sliderValue.value = spinBox.value
                    slider.value = spinBox.value
                }

                onEditingFinished  :
                {
                    if( sliderValue.value != sliderValue.oldValue )
                    {
                        sliderValue.editFinished()
                        sliderValue.oldValue = sliderValue.value
                    }
                }

                Keys.onPressed: {
                    if( event.key === Qt.Key_Shift ) {
                        stepSize = ( max - min ) / 20
                        event.accepted;
                    }
                    else if ( event.key === Qt.Key_Enter || event.key === Qt.Key_Return ) {
                        sliderValue.value = spinBox.value
                        slider.value = spinBox.value
                        spinBox.focus = false
                        slider.focus = true
                    }
                }

                Keys.onReleased: {
                    stepSize = sliderValue.stepSize
                    event.accepted
                }
            }

            RLSlider
            {
                Layout.fillWidth: true
                anchors.left: parent.left
                anchors.leftMargin: 0
                width: sliderValue.width - spinBox.width - 15
                id                       : slider
                activeFocusOnPress       : sliderValue.sliderActiveFocusOnPress
                maximumValue             : sliderValue.max
                minimumValue             : sliderValue.min
                stepSize                 : sliderValue.stepSize
                updateValueWhileDragging : sliderValue.updateValueWhileDragging
                tickmarksEnabled         : sliderValue.tickmarksEnabled
                value                    : sliderValue.value
                //enabled                  : enabled
                //style                    : sliderValue.sliderStyle

                onValueChanged:
                {
                    sliderValue.value = slider.value
                    spinBox.value = slider.value
                    if( slider.value != sliderValue.defaultValue ){
                        slider.handle_default = "../icon/Bollet_sel.svg"
                    }
                    else{
                        slider.handle_default = "../icon/Bollet.svg"
                    }
                }
                onPressedChanged:
                {
                    slider.focus = true;
                    if( !pressed && sliderValue.value != sliderValue.oldValue )
                    {
                        sliderValue.editFinished()
                        sliderValue.oldValue = sliderValue.value
                    }
                }
            }
        }
    }



    onValueChanged:
    {
        timer.count = sliderValue.defaultCount
        if( slider.pressed )
        {
            timer.running = false
        }
        else
        {
            timer.running = true
        }
    }
}
