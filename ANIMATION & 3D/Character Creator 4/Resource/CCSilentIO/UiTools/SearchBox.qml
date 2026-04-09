/****************************************************************************
**
** Copyright (C) 2015 The Qt Company Ltd.
** Contact: http://www.qt.io/licensing/
**
** This file is part of the examples of the Qt Toolkit.
**
** $QT_BEGIN_LICENSE:BSD$
** You may use this file under the terms of the BSD license as follows:
**
** "Redistribution and use in source and binary forms, with or without
** modification, are permitted provided that the following conditions are
** met:
**   * Redistributions of source code must retain the above copyright
**     notice, this list of conditions and the following disclaimer.
**   * Redistributions in binary form must reproduce the above copyright
**     notice, this list of conditions and the following disclaimer in
**     the documentation and/or other materials provided with the
**     distribution.
**   * Neither the name of The Qt Company Ltd nor the names of its
**     contributors may be used to endorse or promote products derived
**     from this software without specific prior written permission.
**
**
** THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
** "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
** LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
** A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
** OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
** SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
** LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
** DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
** THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
** (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
** OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE."
**
** $QT_END_LICENSE$
**
****************************************************************************/

import QtQuick 2.0

Rectangle {
    id: focusScope
    border.color: "#505050"
    color: "#282828"
    property string text



    Image {
        id: img
        anchors { left: parent.left; leftMargin: 5; rightMargin: 8; verticalCenter: parent.verticalCenter }
        source: "../icon/Search.svg"
        width: 20
        height: 20
    }

    Text {
        id: typeSomething
        anchors.fill: parent;
        anchors.leftMargin: 25
        verticalAlignment: Text.AlignVCenter
        text: "Search..."
        color: "#505050"
        font.italic: false
        font.family: "Arial"
        font.pixelSize: 12
    }

    MouseArea {
        anchors.fill: parent
        onClicked: { focusScope.focus = true; Qt.inputMethod.show(); }
    }

    TextInput {
        id: textInput
        objectName: "searchText"
        inputMethodHints: Qt.ImhNoPredictiveText
        anchors { left: img.right; leftMargin: 0; right: parent.right; rightMargin: 8; verticalCenter: parent.verticalCenter }
        focus: false
        selectByMouse: true
        color: "#c8c8c8"
        font.family: "Arial"
        font.pixelSize: 12
        onTextChanged: {
            focusScope.text = text
        }
    }

    Image {
        id: clear
        anchors { right: parent.right; rightMargin: 8; verticalCenter: parent.verticalCenter }
        source: "../icon/Delete.svg"
        width: 20
        height: 20
        visible: false

        MouseArea {
            anchors.fill: parent
            onClicked: { textInput.text = ''; textInput.focus = false; /*textInput.openSoftwareInputPanel();*/ }
        }
    }

    states: State {
        name: "hasText"; when: textInput.text != ''
        PropertyChanges { target: typeSomething; visible: false }
        PropertyChanges { target: clear; visible: true }
    }

    transitions: [
        Transition {
            from: ""; to: "hasText"
            NumberAnimation { exclude: typeSomething; properties: "opacity" }
        },
        Transition {
            from: "hasText"; to: ""
            NumberAnimation { properties: "opacity" }
        }
    ]
}
