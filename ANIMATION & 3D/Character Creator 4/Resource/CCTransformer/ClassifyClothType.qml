import QtQuick 2.5
import QtQuick.Controls 1.5
import QtQuick.Layouts 1.3
import CharacterCreator.QmlInterface 1.0
import CharacterCreator.QmlEnumPathType 1.0
import CharacterCreator.QmlEnumNodeType 1.0

Rectangle
{
    id: classifyClothTypeProfile
	
	property var hairSkinBoneIds: [15]
	property var glovesSkinBoneIds: [11,14]
	property var shoesSkinBoneIds: [4,7]
    property var clothSkinBoneIds: [1,2,5,8,9,12,18,19,20,23,24,25,26,27,28,29,30,31]

    function classifyClothType( kQSkinIds )
    {
        var kClothType = 1

        var bHairSkin = false
        if( kQSkinIds.length === 1 && kQSkinIds[ 0 ] === hairSkinBoneIds[ 0 ] )
        {
            bHairSkin = true;
        }

        var bGlovesSkin = false
        for( var i = 0; i < glovesSkinBoneIds.length; ++i )
        {
            for ( var j = 0; j < kQSkinIds.length; ++j )
            {
                if( kQSkinIds[ j ] === glovesSkinBoneIds[ i ] )
                {
                    bGlovesSkin = true;
                    break
                }
            }
        }

        var bShoesSkin = false
        for( var i = 0; i < shoesSkinBoneIds.length; ++i )
        {
            for ( var j = 0; j < kQSkinIds.length; ++j )
            {
                if( kQSkinIds[ j ] === shoesSkinBoneIds[ i ] )
                {
                    bShoesSkin = true;
                    break
                }
            }
        }

        var bClothSkin = false
        for( var i = 0; i < clothSkinBoneIds.length; ++i )
        {
            for ( var j = 0; j < kQSkinIds.length; ++j )
            {
                if( kQSkinIds[ j ] === clothSkinBoneIds[ i ] )
                {
                    bClothSkin = true;
                    break
                }
            }
        }
        console.log( bHairSkin )
        console.log( bGlovesSkin )
        console.log( bShoesSkin )
        console.log( bClothSkin )

        if( bHairSkin )
        {
            kClothType = 11
        }
        else if( bClothSkin )
        {
            kClothType = 1
        }
        else if( bGlovesSkin )
        {
            kClothType = 9
        }
        else if( bShoesSkin )
        {
            kClothType = 8
        }
        else if( kQSkinIds.length === 0 )
        {
            kClothType = 5
        }
		
		return kClothType
    }
}
