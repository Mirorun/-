import {tracks as legacyTracks} from '../data.js';
export const albums=[{id:'album-1',title:'샘플 앨범 01',artist:'가상 아티스트',artwork:'assets/music-artwork.svg',description:'이미지와 음악 정보를 교체할 수 있는 샘플 앨범입니다.'},{id:'album-2',title:'샘플 앨범 02',artist:'가상 아티스트',artwork:'assets/music-artwork.svg',description:'교체용 가상 앨범'}];
export const playlists=[{id:'saved',title:'보관한 노래',description:'기존 샘플 곡을 모아 둔 플레이리스트',artwork:'assets/music-artwork.svg'},{id:'afternoon',title:'느린 오후',description:'교체용 샘플 플레이리스트',artwork:'assets/music-artwork.svg'}];
// Existing three titles/artists/durations are retained. No audio is included.
export const songs=legacyTracks.map((t,i)=>({id:'track-'+(i+1),title:t.title,artist:t.artist,album:albums[i===2?1:0].title,albumId:i===2?'album-2':'album-1',artwork:'assets/music-artwork.svg',duration:t.duration,youtubeUrl:'',playlistIds:i===1?['saved']:['saved','afternoon']}));
