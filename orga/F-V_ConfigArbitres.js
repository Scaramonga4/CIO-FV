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


function RecupEquipes(){
    db.collection("/Equipes").get().then((snapshot)=>{
        snapshot.docChanges().forEach((change) => {
            document.getElementById("vide").style.display = "none"
            let nom = change.doc.data().arbitre==null?"inconnu au bataillon":change.doc.data().arbitre;
            var arbitre = document.createElement("div");
            arbitre.id = nom;
            arbitre.draggable = true;
            arbitre.className = "Arbitre"
            arbitre.innerHTML = `<span pas-selectionnable="${nom}"></span>`;
            document.getElementById("list_Equipes").appendChild(arbitre);
        });
    }); 
}

function enregistreEquipes(){
    var poules = document.getElementsByClassName("poule");
    for(let i = 0; i < poules.length; i++) {
        const arbitres = poules[i].getElementsByClassName("Arbitre");
        let liste = []
        for (let j=0; j< arbitres.length; j++){
            liste.push(arbitres[j].id)
        }
        db.collection("/Poules").doc(poules[i].id).update({
            "arbitres": liste   
        }).then(() => {
            if(i == poules.length-1)return true; 
            console.log("Document successfully updated!");
        })
        .catch((error) => {
            console.error("Error updating document: ", error);
            return false
        });
    }
}


//--------------DEBUT----------------

RecupEquipes();

var poules = document.getElementsByClassName('poule');
var equipes = document.getElementsByClassName('Equipe');
for(var i = 0; i < poules.length; i++) {
  (function(index) {
    poules[index].ondragleave = function(event){
        event.preventDefault();
        this.classList.remove("Survole");
        if (PouleSurvollee == this.id)PouleSurvollee = null;
     }
    poules[index].ondragover= function(event){
        event.preventDefault();
        this.classList.add("Survole");
        PouleSurvollee = this.id;
    }
  })(i);
}

document.getElementById("list_Equipes").ondragover= function(event){
    event.preventDefault();
};

document.addEventListener("dragstart", function(event) {
    event.dataTransfer.setData("arbitre", event.target.id);
});

document.addEventListener("drop", function(event) {
    event.preventDefault();
    if ( event.target.classList.contains("poule")) {
      event.target.classList.remove("Survole");
      var data = event.dataTransfer.getData("arbitre");
      event.target.appendChild(document.getElementById(data));
    }else if(event.target.classList.contains("Liste_Equipes_defil")){
        var data = event.dataTransfer.getData("arbitre");
        event.target.appendChild(document.getElementById(data));
    }else{
        var data = event.dataTransfer.getData("arbitre");
        document.getElementById("list_Equipes").appendChild(document.getElementById(data));
    }
  });




function notifie(msg){
    var notif = document.getElementById("snackbar");
    notif.textContent=msg;
    notif.className = "show";
    setTimeout(function(){ notif.className = notif.className.replace("show", ""); }, 3000);
}

if(document.getElementsByClassName("Liste_Equipes_défil") == ""){
    document.getElementById("Confirm_pools").classList.remove("Cache");
    document.getElementById("Confirm_pools").classList.add("Affiche");
}


document.getElementById("conf_arb").addEventListener('click', function(e){
    if(document.getElementById("list_Equipes").childNodes.length<8){
        if(enregistreEquipes) document.location.href = "F-V_ConfigMatchs.html";
        else  notifie("Une erreur est survenue")  
    }else{
        notifie("Veuillez placer toutes les équipes dans une poule")
    }
})
