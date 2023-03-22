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
var indicePoule = 0;
var arbitres;
var liste_equipes = {};
var selct1;

function RecupEquipes(indice){
    db.collection("/Equipes").where("poule", "==", poules[indice]).onSnapshot((snapshot)=>{
        snapshot.docChanges().forEach(function(change, indi, liste) {
            console.log("Changement équipes?: ", change.doc.id, indi, liste.length);
            if (change.type === "added") {
                liste_equipes[change.doc.id] = change.doc.data().classe??"inconnu au bataillon"
            }
            if (change.type === "modified") {
                //A FAIRE
            }
            if (change.type === "removed") {
                //A FAIRE
            }
            if (indi === liste.length - 1)RecupMatchs(indice);
        });
    }); 
}

function RecupMatchs(indice){
    document.getElementById("liste_matchs").innerHTML = "";
    selct1 = document.createElement("select");
    var p = document.createElement("p")
    p.innerHTML = " VS "
    selct1.classList.add("selecteur");
    var defaut = document.createElement("option");
    defaut.text = "--:--"
    selct1.appendChild(defaut);
    for (var cle in liste_equipes){
        var op = document.createElement("option")
        op.text = liste_equipes[cle];
        selct1.appendChild(op);
    }
    console.log(selct1,liste_equipes)
    db.collection("/Poules").doc(poules[indice]).collection("matchs").onSnapshot((snapshot)=>{
        snapshot.docChanges().forEach(function(change, indi, liste) {
            var match = change.doc.data();
            if (change.type === "added") {
                var monMatch = document.createElement("div");
                monMatch.id = change.doc.id,
                monMatch.className = "match";
                var equ1 = selct1.cloneNode(true);
                var equ2 = selct1.cloneNode(true);
                if (match.equipes.Equ1!=null)equ1.value = liste_equipes[match.equipes.Equ1];
                if (match.equipes.Equ2!=null)equ2.value = liste_equipes[match.equipes.Equ2];
                monMatch.appendChild(equ1);
                monMatch.appendChild(p.cloneNode(true))
                monMatch.appendChild(equ2)
                document.getElementById("liste_matchs").appendChild(monMatch);
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



//------DEBUT----

RecupEquipes(indicePoule);
//RecupMatchs(indicePoule);

document.getElementById("nouv_match").addEventListener('click', function(e){
    var monMatch = document.createElement("div");
    var p = document.createElement("p")
    p.innerHTML = " VS "
    monMatch.className = "match";
    monMatch.appendChild(selct1.cloneNode(true));
    monMatch.appendChild(p)
    monMatch.appendChild(selct1.cloneNode(true));
    document.getElementById("liste_matchs").appendChild(monMatch);
})