local mainFrame;
local watermarkPackFrame
local watermarkSimFrame
local texturePack = "images/Pack.png";
local textureSim = "images/Simulation.png";
local watermarkPack = "images/WatermarkPack.png"
local watermarkSim = "images/WatermarkSim.png"

local screenWidth = 0;
local screenHeight = 0;

local xPos = 0;
local yPos = 0;

local frameWidth = 5;

local mode = 0;

local rRed =
{
	BoundLeft = 0;
	BoundRight = frameWidth - 1;
	BoundTop =0;
	BoundBottom = frameWidth - 1;
}

local rWatermark =
{
    BoundLeft = 0;
	BoundRight = 245;
	BoundTop =0;
	BoundBottom = 60;
}

function Initialize()
	IncludeApi( "UserInterface" );
	IncludeApi( "CommandControl" );
    RegisterEvent( "OnViewSizeChange" );
    
		
    mainFrame = CLuaFrame();
    watermarkPackFrame = CLuaFrame();
    watermarkSimFrame = CLuaFrame();
    --mainFrame:SetTexture( GetUiImage( texture ) );
    mainFrame:SetRect( 0, 0, screenWidth, screenHeight );
    AssignMainGUI( mainFrame:GetFrameId() );
    
	OnViewSizeChange( GetViewSize() );
	
    mainFrame:AddChild( watermarkPackFrame:GetFrameId() );
    mainFrame:AddChild( watermarkSimFrame:GetFrameId() );
    
    --[[
    CreateCommand( "Normal Mode", "NormalMode" );
    CreateCommand( "Pack Mode", "PackMode" );
    CreateCommand( "Simulation Mode", "SimulationMode" );
    --]]
end

function AppendText ( _mode )
    -- 0 is Normal
    -- 1 is Pack Mode
    -- 2 is Simulation Mode
    xPos = 0;
    yPos = 0;
    mode = _mode;
    if ( mode == 0 ) then
        NormalMode();
    elseif ( mode == 1 ) then
        PackMode();
    elseif ( mode == 2 ) then
        SimulationMode();
    else
        NormalMode();
    end
end

function NormalMode()
    mode = 0;
    ClearAllDecal();
end

function ClearAllDecal()
	mainFrame:ClearDecal();
    watermarkPackFrame:ClearDecal();
    watermarkSimFrame:ClearDecal();
end

function PackMode()
    mode = 1;
    ClearAllDecal();
    mainFrame:SetTexture( GetUiImage( texturePack ) );
    --DebugMsg( screenWidth );
    mainFrame:SetRect( 0, 0, screenWidth, screenHeight );
    
    local tempScreenWidth = screenWidth;
    local tempScreenHeight = screenHeight;
    
    while ( tempScreenWidth > 0 ) do
		mainFrame:AddDecal( rRed, xPos, 0 );
        mainFrame:AddDecal( rRed, xPos, screenHeight - frameWidth );
		xPos = xPos + 1;
		tempScreenWidth = tempScreenWidth - 1;
	end

    while ( tempScreenHeight > 0 ) do
        mainFrame:AddDecal( rRed, 0, yPos );
        mainFrame:AddDecal( rRed, screenWidth - frameWidth, yPos );
        yPos = yPos + 1;
		tempScreenHeight = tempScreenHeight - 1;
	end
  
	watermarkPackFrame:SetTexture( GetUiImage(watermarkPack) );
	watermarkPackFrame:SetRect( screenWidth-270, 25, 245, 60 );
	watermarkPackFrame:AddDecal( rWatermark, 0, 0 );
    
end

function SimulationMode()
    mode = 2;
    ClearAllDecal();
    mainFrame:SetTexture( GetUiImage( textureSim ) );
    --DebugMsg( screenWidth );
    mainFrame:SetRect( 0, 0, screenWidth, screenHeight );
    
    local tempScreenWidth = screenWidth;
    local tempScreenHeight = screenHeight;
    
    while ( tempScreenWidth > 0 ) do
		mainFrame:AddDecal( rRed, xPos, 0 );
        mainFrame:AddDecal( rRed, xPos, screenHeight - frameWidth );
		xPos = xPos + 1;
		tempScreenWidth = tempScreenWidth - 1;
	end

    while ( tempScreenHeight > 0 ) do
        mainFrame:AddDecal( rRed, 0, yPos );
        mainFrame:AddDecal( rRed, screenWidth - frameWidth, yPos );
        yPos = yPos + 1;
		tempScreenHeight = tempScreenHeight - 1;
	end
    
	watermarkSimFrame:SetTexture( GetUiImage(watermarkSim) );
	watermarkSimFrame:SetRect( screenWidth-270, 25, 245, 60 );
	watermarkSimFrame:AddDecal( rWatermark, 0, 0 );
    
end

function OnViewSizeChange( _w, _h )
    xPos = 0;
    yPos = 0;
    screenWidth = _w;
    screenHeight = _h;
    AppendText( mode );
end

function OnViewSizeChange( _w, _h )
    xPos = 0;
    yPos = 0;
    screenWidth = _w;
    screenHeight = _h;
    AppendText( mode );
end

function OnMouseEnter()

end