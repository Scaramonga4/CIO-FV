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

var phaseAct = "";
var nbequipes = 0;

function RecupIdFinale(){
    db.collection("/Poules").doc("finale").get().then((snap) =>{
        phaseAct = snap.data().phase??""
    }).then(()=>RecupEquipes())
}

function RecupEquipes(){
    const equ1 = document.createElement("div")
    const equ2 = document.createElement("div")
    const p = document.createElement("p")
    const terrain = document.createElement("input")
    equ1.className = "contient 1"
    equ2.className = "contient 2"
    p.innerHTML = " VS "
    terrain.placeholder = "Terrain"
    terrain.className = "t"

    db.collection("/Equipes").where("finale", "==", phaseAct).get().then((snapshot)=>{
        snapshot.docChanges().forEach((change) => {
            nbequipes++
            var classe = change.doc.data().classe==null?"inconnu au bataillon":change.doc.data().classe;
            if (change.type === "added") {
                document.getElementById("vide").style.display = "none"
                var Equipe = document.createElement("div");
                Equipe.id = change.doc.id,
                Equipe.draggable = true;
                Equipe.className = "Equipe";
                Equipe.innerHTML = `<span pas-selectionnable="${classe}"></span>`;
                document.getElementById("list_Equipes").appendChild(Equipe);
            }
            if(nbequipes%2==0){
                let mach = document.createElement("div");
                mach.className = "radio"
                const equ1B = equ1.cloneNode(true)
                const equ2B = equ2.cloneNode(true)
                equ1B.ondragover= function(event){
                    event.preventDefault();
                    this.classList.add("Survole");
                }
                equ1B.ondragleave = function(event){
                    event.preventDefault();
                    this.classList.remove("Survole");
                }
                
                equ2B.ondragleave = function(event){
                    event.preventDefault();
                    this.classList.remove("Survole");
                }
                equ2B.ondragover= function(event){
                    event.preventDefault();
                    this.classList.add("Survole");
                }
                mach.appendChild(equ1B)
                mach.appendChild(p.cloneNode(true))
                mach.appendChild(equ2B)
                mach.appendChild(terrain.cloneNode(true))
                document.getElementsByClassName("liste_match_finale")[0].appendChild(mach)
            }
        });
    }); 

}

document.getElementById("list_Equipes").ondragover= function(event){
    event.preventDefault();
};

document.addEventListener("dragstart", function(event) {
    event.dataTransfer.setData("Equipe", event.target.id);
});

document.addEventListener("drop", function(event) {
    event.preventDefault();
    if ( !event.target.classList.contains("plein")) {
      event.target.classList.remove("Survole");
      var data = event.dataTransfer.getData("Equipe");
      event.target.appendChild(document.getElementById(data));
      event.target.className+=" plein"
    }else{
        var data = event.dataTransfer.getData("Equipe");
        document.getElementById("list_Equipes").appendChild(document.getElementById(data));
    }
  });

  function notifie(msg){
    var notif = document.getElementById("snackbar");
    notif.textContent=msg;
    notif.className = "show";
    setTimeout(function(){ notif.className = notif.className.replace("show", ""); }, 3000);
}

RecupIdFinale();

document.getElementById("lance_phase").addEventListener("click",function(e){
    const mesMatchs = document.getElementsByClassName("radio")
    const mesContient = document.getElementsByClassName("contient")
    for (let i =0; i<mesContient.length; i++){
        if (mesContient[i].innerHTML==""){
            notifie("Un match vide, quelle horreur!")
            return false;
        }
    }
    console.log(mesMatchs)
    for (let i=0; i<mesMatchs.length; i++){
        const equ1 = mesMatchs[i].getElementsByClassName("1")[0].getElementsByClassName("Equipe")[0].id
        const equ2 = mesMatchs[i].getElementsByClassName("2")[0].getElementsByClassName("Equipe")[0].id
        const terrain = mesMatchs[i].getElementsByClassName("t")[0].value;
        db.collection("/Poules").doc("finale").collection(phaseAct).add({
            "equipes" : {
                "Equ1": equ1??"erreur",
                "Equ2": equ2??"erreur"
            },
            "terrain": terrain,
            "heure" : null,
            "passage" : null,
            score: {"Equ1": 0, "Equ2": 0},
            "termine":0,
            "commentaire":"",
            "verif":false
        }).then(()=>{
            notifie("Lancement!")
            sessionStorage.setItem("poules",phaseAct)
            document.location.href = "F-V_tableau_bord.html";
        }).catch((error) => {
            notifie("une erreur est survenue")
            console.log("Transaction failed: ", error);
        });
    }
})

