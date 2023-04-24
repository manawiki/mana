New-Item -Path '.\Output' -ItemType Directory
New-Item -Path '.\Output\materials' -ItemType Directory
Copy-Item -Path '.\spriteoutput\itemfigures\*.png' -Destination '.\Output\materials'
(Get-ChildItem -File '.\Output\materials') | rename-item -newname { "ItemIcon_" + $_.name }



New-Item -Path '.\Output\characters' -ItemType Directory
Copy-Item -Path '.\spriteoutput\avataricon\*.png' -Destination '.\Output\characters'

New-Item -Path '.\Output\characters\roundicon' -ItemType Directory
Copy-Item -Path '.\spriteoutput\avatarroundicon\*.png' -Destination '.\Output\characters\roundicon'
(Get-ChildItem -File '.\Output\characters\roundicon') | rename-item -newname { $_.BaseName + "-roundicon" + $_.Extension }

New-Item -Path '.\Output\characters\iconteam' -ItemType Directory
Copy-Item -Path '.\spriteoutput\avatariconteam\*B.png' -Destination '.\Output\characters\iconteam'

New-Item -Path '.\Output\characters\battledetailicon' -ItemType Directory
Copy-Item -Path '.\spriteoutput\avatarbattledetailicon\*.png' -Destination '.\Output\characters\battledetailicon'
(Get-ChildItem -File '.\Output\characters\battledetailicon') | rename-item -newname { $_.BaseName + "-battledetailicon" + $_.Extension }

New-Item -Path '.\Output\characters\avatarcutinfigures' -ItemType Directory
Copy-Item -Path '.\spriteoutput\AvatarCutinFigures\*.png' -Destination '.\Output\characters\avatarcutinfigures'
(Get-ChildItem -File '.\Output\characters\avatarcutinfigures') | rename-item -newname { $_.BaseName + "-avatarcutinfigures" + $_.Extension }

New-Item -Path '.\Output\characters\avatarcutinbg' -ItemType Directory
Copy-Item -Path '.\spriteoutput\AvatarCutinBg\*.png' -Destination '.\Output\characters\avatarcutinbg'
(Get-ChildItem -File '.\Output\characters\avatarcutinbg') | rename-item -newname { $_.BaseName + "-avatarcutinbg" + $_.Extension }

New-Item -Path '.\Output\characters\avatarimgfront' -ItemType Directory
Copy-Item -Path '.\spriteoutput\AvatarImgFront\*.png' -Destination '.\Output\characters\avatarimgfront'
(Get-ChildItem -File '.\Output\characters\avatarimgfront') | rename-item -newname { $_.BaseName + "-avatarimgfront" + $_.Extension }

New-Item -Path '.\Output\characters\avatardrawcard' -ItemType Directory
Copy-Item -Path '.\spriteoutput\AvatarDrawCard\*.png' -Destination '.\Output\characters\avatardrawcard'
(Get-ChildItem -File '.\Output\characters\avatardrawcard') | rename-item -newname { $_.BaseName + "-avatardrawcard" + $_.Extension }



New-Item -Path '.\Output\traces' -ItemType Directory
Copy-Item -Path '.\ui\atlas\atlasfiles\SkillIcon_*.png' -Destination '.\Output\traces'



New-Item -Path '.\Output\lightcones' -ItemType Directory
Copy-Item -Path '.\spriteoutput\ItemIcon\LightConeIcons\*.png' -Destination '.\Output\lightcones'
(Get-ChildItem -File '.\Output\lightcones') | rename-item -newname { $_.BaseName + "-lightconeicon" + $_.Extension }

New-Item -Path '.\Output\lightcones\full' -ItemType Directory
Copy-Item -Path '.\spriteoutput\lightconemaxfigures\*.png' -Destination '.\Output\lightcones\full'
(Get-ChildItem -File '.\Output\lightcones\full') | rename-item -newname { $_.BaseName + "-lightcone" + $_.Extension }



New-Item -Path '.\Output\relics' -ItemType Directory
Copy-Item -Path '.\spriteoutput\RelicFigures\*.png' -Destination '.\Output\relics'



New-Item -Path '.\Output\enemies' -ItemType Directory
Copy-Item -Path '.\spriteoutput\MosterIcon\*.png' -Destination '.\Output\enemies'

New-Item -Path '.\Output\enemies\full' -ItemType Directory
Copy-Item -Path '.\spriteoutput\MonsterFigure\*.png' -Destination '.\Output\enemies\full'
(Get-ChildItem -File '.\Output\enemies\full') | rename-item -newname { $_.BaseName + "-monsterfigure" + $_.Extension }



New-Item -Path '.\Output\achievements' -ItemType Directory
Copy-Item -Path '.\spriteoutput\Achievement\*.png' -Destination '.\Output\achievements'



New-Item -Path '.\Output\paths' -ItemType Directory
Copy-Item -Path '.\spriteoutput\avatarprofessiontattoo\profession\*.png' -Destination '.\Output\paths'
Copy-Item -Path '.\spriteoutput\professioniconsmall\*.png' -Destination '.\Output\paths'

ii ".\Output"
