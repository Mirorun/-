// Official links checked on 2026-10-20; no audio or third-party artwork is bundled.
// Source records and editing instructions: PHASE8.md. Duration is null when unverified.
const art=name=>'assets/music/'+name+'.svg';
export const jpopPlaylists=[
 {id:'often',title:'자주 듣는 노래',description:'걷다가도 다시 찾는 멜로디',artwork:art('often')},
 {id:'night',title:'밤에 듣는 노래',description:'불을 낮추고, 천천히',artwork:art('night')},
 {id:'practice',title:'연습실',description:'다시 한 번, 처음부터',artwork:art('practice')},
 {id:'liked',title:'좋아요 표시한 곡',description:'마음에 남은 노래들',artwork:art('liked')}
];
export const jpopAlbums=[
 {id:'eve',title:'Eve',artist:'Eve',description:'아티스트 모음',artwork:art('often')},
 {id:'natori',title:'なとり',artist:'なとり',description:'아티스트 모음',artwork:art('night')},
 {id:'kenshi',title:'米津玄師',artist:'米津玄師',description:'아티스트 모음',artwork:art('practice')},
 {id:'chiikawa',title:'ちいかわ',artist:'ハチワレ · パジャマパーティーズ',description:'함께 듣는 노래',artwork:art('liked')},
 {id:'vaundy',title:'Vaundy',artist:'Vaundy',description:'아티스트 모음',artwork:art('often')}
];
// id, title, artist, album, official video id, playlist membership, release year.
const rows=[
 ['eve-drama','ドラマツルギー','Eve','文化','jJzw1h5CR-I',['often','practice','liked'],2017],
 ['eve-kaikai','廻廻奇譚','Eve','廻人','1tk1pqwrOys',['often','practice'],2020],
 ['eve-nonsense','ナンセンス文学','Eve','文化','OskXF3s0UT8',['often','practice'],2017],
 ['eve-heart','心予報','Eve','Smile','dJf4wCdLU18',['often','night','liked'],2020],
 ['eve-bokurano','ぼくらの','Eve','ぼくらの','exOi_zsOHwM',['often','practice'],2023],
 ['natori-overdose','Overdose','なとり','劇場','H08YWE4CIFQ',['often','night','liked'],2022],
 ['natori-friday','フライデー・ナイト','なとり','劇場','4Pls29qqg6Y',['often','night'],2023],
 ['natori-saru','猿芝居','なとり','劇場','bjYG08Cdix4',['often','practice'],2023],
 ['natori-zero','絶対零度','なとり','絶対零度','LFoyXEFaz2Q',['practice','liked'],2024],
 ['kenshi-lemon','Lemon','米津玄師','STRAY SHEEP','SX_ViT4Ra7k',['often','night','liked'],2018],
 ['kenshi-kick','KICK BACK','米津玄師','KICK BACK','M2cckDmNLMI',['often','practice'],2022],
 ['kenshi-loser','LOSER','米津玄師','BOOTLEG','Dx_fKPBPYUI',['practice'],2016],
 ['kenshi-peace','ピースサイン','米津玄師','BOOTLEG','9aJVr5tTTWk',['practice','liked'],2017],
 ['kenshi-kanden','感電','米津玄師','STRAY SHEEP','UFQEttrn6CQ',['often','night'],2020],
 ['chiikawa-pajama','パジャマパーティーズのうた','パジャマパーティーズ','パジャマパーティーズのうた','LzzW_TBL558',['liked'],2024],
 ['vaundy-kaiju','怪獣の花唄 (LIVE)','Vaundy','LIVE at BUDOKAN','lYLa6zyjhSI',['practice','often'],2022]
];
export const jpopSongs=rows.map(([id,title,artist,album,videoId,playlistIds,releaseYear])=>{
 const albumId=id.split('-')[0],collection=jpopAlbums.find(a=>a.id===albumId);
 return {id,title,artist,album,albumId,artwork:collection?.artwork||'assets/music-artwork.svg',duration:null,youtubeUrl:'https://www.youtube.com/watch?v='+videoId,playlistIds,releaseYear};
});
jpopSongs.push({id:'chiikawa-hitorigotsu',title:'ひとりごつ',artist:'ハチワレ（CV.田中誠人）',album:'HITORIGOTSU',albumId:'chiikawa',artwork:art('liked'),duration:null,youtubeUrl:'',officialUrl:'https://nex-tone.link/A00100543',playlistIds:['night','liked'],releaseYear:2022});
