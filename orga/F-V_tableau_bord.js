var firebaseConfig = {
    apiKey: "AIzaSyD2NNpUFGt88AKCKOjZgH3j9af4KzafAh8",
    authDomain: "fete-du-volley.firebaseapp.com",
    projectId: "fete-du-volley",
    storageBucket: "fete-du-volley.appspot.com",
    messagingSenderId: "884762562507",
    appId: "1:884762562507:web:9b54cbcf59507e1904304e"
};
  
  
firebase.initializeApp(firebaseConfig); //initialise le projet
const db = firebase.firestore();

const poules = ["Poule_A","Poule_B","Poule_C","Poule_D","Poule_E","Poule_F"]
var liste_equipes = {};
var poule_equipe = {}

var mesMatchsAConfirmer = {}

function RecupEquipes(){
    db.collection("/Equipes").get().then((snapshot)=>{
        console.log("lit",snapshot)
        snapshot.docChanges().forEach(function(change, indi, liste) {
            if (change.type === "added") {
                liste_equipes[change.doc.id] = change.doc.data().classe??"inconnu au bataillon"
                //poule_equipe[change.doc.id] = indice
            }
            if (change.type === "modified") {
                //A FAIRE
            }
            if (change.type === "removed") {
                //A FAIRE
            }
            if (indi === liste.length - 1)recuperationDesMatchs();
        });
        if(snapshot.length==null){
            //document.getElementById(poules[indice]).innerHTML = "";
        }
        
    }); 
}
function recuperationDesMatchs(){
    var equipe = document.createElement("span");
    var typeMatch = document.createElement("div");
    var p = document.createElement("p")
    p.innerHTML = "vs"
    equipe.className = "Equipe marge"
    typeMatch.className = "matchClick";
    document.getElementById("matchs_pas_termine").innerHTML = ""
    document.getElementById("matchs_valide").innerHTML = ""
    document.getElementById("matchs_termine").innerHTML = ""
    for (var indice = 0; indice<poules.length ;indice++){
        const maP = poules[indice]
        db.collection("/Poules").doc(maP).collection("matchs").get().then((snapshot)=>{
            snapshot.docChanges().forEach((change) => {
                var match = change.doc.data();
                if (change.type === "added") {
                    var monMatch = typeMatch.cloneNode(true);
                    monMatch.id = change.doc.id;
                    var Score1 = document.createElement("p");
                    var Score2 = document.createElement("p");
                    Score1.className+=" 1"
                    Score2.className+=" 2"
                    var equ1 = equipe.cloneNode(true);
                    var equ2 =  equipe.cloneNode(true);
                    Score1.innerHTML = match.score.Equ1??"--:--"
                    Score2.innerHTML = match.score.Equ2??"--:--"
                    equ1.innerHTML = liste_equipes[match.equipes.Equ1];
                    equ2.innerHTML = liste_equipes[match.equipes.Equ2];
                    monMatch.appendChild(equ1)
                    monMatch.appendChild(Score1)
                    monMatch.appendChild(p.cloneNode(true))
                    monMatch.appendChild(Score2)
                    monMatch.appendChild(equ2) 
                    console.log(maP)
                    monMatch.addEventListener("click", function(e){
                        ouvreMatch(maP,monMatch.id);
                    })
                    if (match.termine??0 != 0){
                        colorie(equ1,equ2,match.termine??4)
                        if(match.verif??false){
                            document.getElementById("matchs_termine").appendChild(monMatch)
                        }else{
                            document.getElementById("matchs_valide").appendChild(monMatch)
                            mesMatchsAConfirmer[change.doc.id] = change.doc.data();
                        }
                    }else{
                        document.getElementById("matchs_pas_termine").appendChild(monMatch)
                    }
                }
                if (change.type === "modified") {
                    console.log(change.doc.id)
                    var monMatch = document.getElementById(change.doc.id);
                    monMatch.getElementsByClassName(1)[0].innerHTML = match.score.Equ1??"--:--"
                    monMatch.getElementsByClassName(2)[0].innerHTML = match.score.Equ2??"--:--"
                    if (match.termine??0 != 0){
                        if(match.verif??false){
                            document.getElementById("matchs_termine").appendChild(monMatch)
                        }else{
                            colorie(equ1,equ2,match.termine??4)
                            document.getElementById("matchs_valide").appendChild(monMatch)
                        }
                    }
                }
                if (change.type === "removed") {
                    var monMatch = document.getElementById(change.doc.id);
                    monMatch.parentNode.removeChild(monMatch);
                }
            });
        });
    }
}

function colorie(equ1,equ2,res){
    switch (res){
        case 1, 5:
            equ1.style.background = "#00FF00"
            equ2.style.background = "red"
            break;
        case 2, 4:
            equ1.style.background = "red"
            equ2.style.background = "#00FF00"
            break;
        default:
            equ1.style.background = "red"
            equ2.style.background = "red"
    }
}

function ouvreMatch(poule, id){
    document.getElementById("pop_match").style.display='block';
    console.log(poule,id)
    db.collection("Poules").doc(poule).collection("matchs").doc(id).get().then((value)=>{
        console.log(value)
        var mach = value.data();
        document.getElementById("score1").value = mach.score.Equ1??"-1"
        document.getElementById("score2").value = mach.score.Equ2??"-1"
        document.getElementById("equ1").innerHTML = liste_equipes[mach.equipes.Equ1];
        document.getElementById("equ2").innerHTML = liste_equipes[mach.equipes.Equ2];
        const mesbtnRadios = document.getElementsByClassName("rad")
        for (let i = 0; i<mesbtnRadios.length; i++){
            mesbtnRadios[i].checked=false;
        }
        if ((mach.termine??0 >0) && (mach.termine??0 <5)){
            mesbtnRadios[(mach.termine??0) +1].checked = true;
        }
        if (mach.verif??false)document.getElementById("verif").checked=true
        else document.getElementById("verif").checked=false
    })
}


RecupEquipes();