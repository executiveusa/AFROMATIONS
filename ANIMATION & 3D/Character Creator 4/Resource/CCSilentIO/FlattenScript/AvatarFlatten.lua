function OnQueryMorphID()
    return ###Object#Type###, ###Object#UID###, "Flatten";
end

function OnQueryControllers()
    local sliderTable = {};
    sliderTable[ 1 ] = { uId = "", displayName = ###Object#Name###; minimumValue = 0; maximumValue = 100; defaultValue = 0; 
                         direction = 0; step = 1; enabled = true; path = { "Head" }; type = "integer_slider"; 
                         leftIcon = ""; rightIcon = ""; targetObject = "";
                         controlPart = Head; };
    return sliderTable;
end

function OnControlValueChanged( uId, sliderValue )
    local filePath1 = ###File#Path1###;
    local filePath2 = ###File#Path2###;

    if ( filePath1 ~= "" ) then
        SetMorphFileWeight( filePath1, sliderValue / 100 );
    end
    if ( filePath2 ~= "" ) then
        SetMorphFileWeight( filePath2, sliderValue / 100 );
    end
end