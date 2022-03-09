//Variables 
const table = document.querySelector('.table');
const info = document.querySelector('.info');
const ImagePath ="url(https://github.com/Albert-FFS/Game_001_Memory/tree/master/src/media/face.webp)";
const Image = [
    {num:'0',   x:'-0px',    y:'-0px',    title:'Broken Bigoron Sword'},
    {num:'1',   x:'-100px',  y:'-0px',    title:'Bow'},
    {num:'2',   x:'-200px',  y:'-0px',    title:'Eye of Truth'},
    {num:'3',   x:'-300px',  y:'-0px',    title:'Master Sword'},
    {num:'4',   x:'-0px',    y:'-100px',  title:'Slingshot'},
    {num:'5',   x:'-100px',  y:'-100px',  title:'Pegasus Boots'},
    {num:'6',   x:'-200px',  y:'-100px',  title:'Hyrule Shield'},
    {num:'7',   x:'-300px',  y:'-100px',  title:'Gold Gauntlets'},
    {num:'8',   x:'-0px',    y:'-200px',  title:'Book of Mudora'},
    {num:'9',   x:'-100px',  y:'-200px',  title:'Blue Rupee'},
    {num:'10',  x:'-200px',  y:'-200px',  title:'Triforce'},
    {num:'11',  x:'-300px',  y:'-200px',  title:'Red Pocion'}
];
let st;
const soundsEffect =[
    {path:'https://github.com/Albert-FFS/Game_001_Memory/tree/master/src/media/zelda_navi_listen.mp3'},
    {path:'https://github.com/Albert-FFS/Game_001_Memory/tree/master/src/media/zelda_secret.mp3'},
    {path:'https://github.com/Albert-FFS/Game_001_Memory/tree/master/src/media/pokemon_snap_wrong.mp3'},
    {path:'https://github.com/Albert-FFS/Game_001_Memory/tree/master/src/media/zelda_win.mp3'}
];
const audio = document.querySelector('audio');
//Game Engine
function Loop() {
    State.Start();
}
window.requestAnimationFrame(Loop);
//Game States
const State = {
    Start: ()=>{
        State.Menu();
    },
    Menu: ()=>{
        table.innerHTML = `
        <div class="Menu">
            <h2>Menu Principal</h2>
            <input type="button" value="Start" onClick="State.Game()"/>
            <input type="button" value="About" onClick="alert('Creado por Rafael Alberto')"/>
        </div>`;
    },
    Game:()=>{
        GameObj.StartGame();
        st =setInterval(()=>{
            GameObj.Time ++;
            GameObj.UpdateInfo();
        },1000);
    },
    WinScreen:()=>{
    }
}
//Game Object
const GameObj ={
    Pairs : [],
    CardsList :[],
    PairsList :[],
    RoundState :0,
    Card1:'',
    Card2:'',
    Score:0,
    Time:0,
    GetRandomNumber : (n)=>{
        return Math.floor(Math.random()*n);
    },
    SetRandom : (List,Long)=>{
        let n = GameObj.GetRandomNumber(Long);
        let out =true;
        while (out) {
            if(List.includes(n)){
                // console.log('Buscando otro numero a '+n);
                n=GameObj.GetRandomNumber(Long);
            }else{
                out=false;
            }
        }
        return n;
    },
    SetCardList: ()=>{
        for (let i = 0; i < 6; i++) {
            const n=GameObj.SetRandom(GameObj.CardsList,12);
            GameObj.CardsList.push(n);
            GameObj.CardsList.push(n);
        }
    },
    SetPairList: ()=>{
        for (let i = 0; i < 12; i++) {
            GameObj.PairsList.push(GameObj.SetRandom(GameObj.PairsList,12));
        }
    },
    StartGame:()=>{
        GameObj.PlaySoundEffect(soundsEffect[0].path);
        GameObj.SetCardList();
        GameObj.SetPairList();
        GameObj.LoadCard();
    },
    LoadCard :()=>{
        let nodes='';
        for (let i = 0; i < 12; i++) {
            nodes += `<div id="c${i}" class="card" onClick="GameObj.ClickCard(this.id)"></div>`;
        }
        table.innerHTML= nodes;
        GameObj.LoadImages();
    },
    LoadImages :()=>{
        for (let i = 0; i < 12; i++) {
            const item= GameObj.GetIndex(GameObj.PairsList,i);
            const DataPic =Image[GameObj.CardsList[item]];
            table.childNodes[i].style.background =`${ImagePath} ${DataPic.x} ${DataPic.y}`;
            // table.childNodes[i].before();
            // table.childNodes[i].title = DataPic.title;
        }
    },
    CheckPairs :(card1, card2)=>{
        const c1=GameObj.CardsList[GameObj.GetIndex(GameObj.PairsList,card1)];
        const c2=GameObj.CardsList[GameObj.GetIndex(GameObj.PairsList,card2)];
        if(c1==c2){
            GameObj.Pairs.push(card1);
            GameObj.Pairs.push(card2);
            GameObj.FindPairs(table.childNodes[card1],table.childNodes[card2]);
            GameObj.PlaySoundEffect(soundsEffect[1].path);
            alert(`${Image[c1].title}`);
        }else{
            // alert('No Coincide');
            GameObj.PlaySoundEffect(soundsEffect[2].path);
            setTimeout(GameObj.ReturnCard(table.childNodes[card1],table.childNodes[card2]),500);
        }
        GameObj.CheckIfWins();
    },
    CheckIfWins : ()=>{
        if(GameObj.Pairs.length ===12){
            GameObj.PlaySoundEffect(soundsEffect[3].path);
            alert('GANASTE');
            clearInterval(st);
        }
    },
    ReturnCard :(CardObj1,CardObj2)=>{
        setTimeout(()=>{
            CardObj1.classList.remove('Active');
            CardObj2.classList.remove('Active');
        },500);
    },
    GetIndex:(array,value)=>{
        return array.findIndex((index)=>{
            return index ==value;
        });
    },
    ClickCard :(id)=>{
        let n;
        if(id.length ===3){
            n = `${id[1]}${id[2]}`; 
        }else{
            n = id[1];
        }
        if(GameObj.Pairs.includes(n)){
            alert('Ya se encuentra'); 
        }else{
            GameObj.AsignCard(n);
        }
        GameObj.Score ++;
    },
    AsignCard :(value) =>{
        GameObj.Toggle(table.childNodes[value]);
        if(GameObj.RoundState == 0){
            GameObj.Card1= value;
            GameObj.RoundState = 1;
        }else{
            if(GameObj.Card1 == value){
                alert('Es la misma carta');
            }else{
                GameObj.Card2= value;
                GameObj.RoundState = 0;
                GameObj.CheckPairs(GameObj.Card1,GameObj.Card2);
            }
        }
    },
    Toggle :(CardObj)=>{
        CardObj.classList.add('Active');
        // console.log(CardObj);
    },
    FindPairs : (CardObj1,CardObj2)=>{
        CardObj1.classList.add('Find');
        CardObj2.classList.add('Find');
    },
    UpdateInfo:()=>{
        const text = `<h3>SCORE:${GameObj.Score}</h3><h3>TIME:${GameObj.Time}</h3>`;
        info.innerHTML=text;
    },
    PlaySoundEffect:(url)=>{
        audio.src = url;
        audio.play();
    }
};
