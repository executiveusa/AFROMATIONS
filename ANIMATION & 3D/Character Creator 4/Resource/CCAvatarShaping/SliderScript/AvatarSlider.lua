function OnQueryMorphID()
    return ###Object#Type###, ###Object#FileUID###, ###Object#UserStr###, ###Object#SliderUID###;
end

function OnQueryControllers()
    local sliderTable = {};
    sliderTable[ ###Object#SliderIndex### ] = { uId = ###Object#SliderUID###, displayName = ###Object#Name###; minimumValue = ###Object#MinValue###; maximumValue = ###Object#MaxValue###; defaultValue = ###Object#DefaultValue###; 
                         direction = 0; step = 1; enabled = true; path = { ###Object#TreePath### }; type = ###Object#SliderType###; 
                         leftIcon = ###Object#LeftIcon###; rightIcon = ""; targetObject = ""; CanEdit = ###Object#Edit###;
                         controlPart = ###Object#ControlPart###; };
    return sliderTable;
end

function OnControlValueChanged( uId, sliderValue )

    if ( uId == ###Object#SliderUID### ) then
		###Object#MorphData###
	end
end