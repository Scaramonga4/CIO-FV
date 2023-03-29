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
var arbitres;
var liste_equipes = {};
var poule_equipe = {}
var mesSelecteurs = {};

function RecupEquipes(indice){
    db.collection("/Equipes").where("poule", "==", poules[indice]).get().then((snapshot)=>{
        snapshot.docChanges().forEach(function(change, indi, liste) {
            console.log("lit",change.doc.data().classe)
            if (change.type === "added") {
                liste_equipes[change.doc.id] = change.doc.data().classe??"inconnu au bataillon"
                poule_equipe[change.doc.id] = indice
            }
            if (change.type === "modified") {
                //A FAIRE
            }
            if (change.type === "removed") {
                //A FAIRE
            }
            if (indi === liste.length - 1)RecupMatchs(indice);
        });
        if(snapshot.length==null){
            document.getElementById(poules[indice]).innerHTML = "";
        }
        
    }); 
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

function RecupMatchs(indice){
    document.getElementById(poules[indice]).innerHTML = "";
    var selct1 = selct.cloneNode(true);
    for (var cle in liste_equipes){
        if (poule_equipe[cle]==indice){
            var op = document.createElement("option")
            op.text = liste_equipes[cle];
            selct1.appendChild(op);
        }
    }
    mesSelecteurs[indice] = selct1;
    db.collection("/Poules").doc(poules[indice]).collection("matchs").get().then((snapshot)=>{
        snapshot.docChanges().forEach(function(change, indi, liste) {
            var match = change.doc.data();
            console.log(match)
            if (change.type === "added") {
                var monMatch = document.createElement("div");
                monMatch.id = change.doc.id,
                monMatch.className = "match";
                var equ1 = selct1.cloneNode(true);
                var equ2 = selct1.cloneNode(true);
                if (match.equipes.Equ1!=null)equ1.value = liste_equipes[match.equipes.Equ1];
                if (match.equipes.Equ2!=null)equ2.value = liste_equipes[match.equipes.Equ2];
                equ1.classList+=" 1"
                equ2.classList+=" 2"
                monMatch.appendChild(equ1);
                monMatch.appendChild(p.cloneNode(true))
                monMatch.appendChild(equ2)
                document.getElementById(poules[indice]).appendChild(monMatch);
            }
            if (change.type === "modified") {
                //document.getElementById(change.doc.id).innerHTML = classe;
            }
            if (change.type === "removed") {
                document.getElementById(change.doc.id).remove();
            }
        })
    })
}

function enr_matchs(){
    var mesMatchs = document.getElementsByClassName("match")
    for(const match of mesMatchs){
        var parent = match.parentNode
        let Mequ1 = match.getElementsByClassName("1")[0]
        let equ1 = Mequ1.options[Mequ1.selectedIndex].text
        let Mequ2 = match.getElementsByClassName("2")[0]
        let equ2 = Mequ2.options[Mequ2.selectedIndex].text
        //console.log(match, parent)
        if (match.id!= null && match.id!=""){
            db.collection("/Poules").doc(parent.id).collection("matchs").doc(match.id).set({
                "equipes" : {
                    "Equ1": equ1 == defaut.text?null:getKeyByValue(liste_equipes,equ1),
                    "Equ2": equ2 == defaut.text?null:getKeyByValue(liste_equipes,equ2)
                }
            })
        }else{
            db.collection("/Poules").doc(parent.id).collection("matchs").add({
                "equipes" : {
                    "Equ1": equ1 == defaut.text?null:getKeyByValue(liste_equipes,equ1),
                    "Equ2": equ2 == defaut.text?null:getKeyByValue(liste_equipes,equ2)
                },
                "heure" : "",
                "passage" : 0,
                score: {"Equ1": 0, "Equ2": 0},
                "termine":0,
                "commentaire":"",
                "verif":false
            }).then((value)=> {
                console.log(value)
                match.id = value.id
            })

        }
    }

    for (var indice = 0; indice<poules.length; indice++){

    }
}



//------DEBUT----

var selct = document.createElement("select");
var p = document.createElement("p")
p.innerHTML = " VS "
selct.classList.add("selecteur");
var defaut = document.createElement("option");
defaut.text = "--:--"
selct.appendChild(defaut);

for (var indice = 0; indice<poules.length ;indice++){
    mesSelecteurs[indice] = selct.cloneNode(true);
    RecupEquipes(indice);
}
//RecupMatchs(indicePoule);


var mesBoutons = document.getElementsByClassName("fantome");
console.log(mesBoutons)
for(var i = 0; i < mesBoutons.length; i++) {
    (function(index) {
      mesBoutons[index].addEventListener('click', function(e){
        var monMatch = document.createElement("div");
        var p = document.createElement("p")
        var sel1 = mesSelecteurs[index].cloneNode(true);
        var sel2 = mesSelecteurs[index].cloneNode(true);
        sel1.classList += " 1"
        sel2.classList += " 2"
        p.innerHTML = " VS "
        monMatch.className = "match";
        monMatch.appendChild(sel1);
        monMatch.appendChild(p)
        monMatch.appendChild(sel2);
        document.getElementById(poules[index]).appendChild(monMatch);
    })
    })(i);
  }

  document.getElementById("enr_poules").addEventListener('click', function(e){
    enr_matchs();
  })

  document.getElementById("conf_poules").addEventListener('click', function(e){
    enr_matchs();
    document.location.href = "F-V_Lancement.html";
  })