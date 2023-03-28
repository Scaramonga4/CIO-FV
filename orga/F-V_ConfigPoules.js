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
            var classe = change.doc.data().classe==null?"inconnu au bataillon":change.doc.data().classe;
            if (change.type === "added") {
                document.getElementById("vide").style.display = "none"
                var Equipe = document.createElement("div");
                Equipe.id = change.doc.id,
                Equipe.draggable = true;
                Equipe.className = "Equipe";
                Equipe.innerHTML = `<span pas-selectionnable="${classe}"></span>`;
                if (change.doc.data().poule!=null)document.getElementById(change.doc.data().poule).appendChild(Equipe);
                else document.getElementById("list_Equipes").appendChild(Equipe);
            }
            if (change.type === "modified") {
                document.getElementById(change.doc.id).innerHTML = classe;
            }
            if (change.type === "removed") {
                document.getElementById(change.doc.id).remove();
            }
        });
    }); 
}

function enregistreEquipes(fin = false){
    var equipes = document.getElementsByClassName("Equipe");
    for(var i = 0; i < equipes.length; i++) {
        (function(index) {
            const parent = equipes[index].parentNode;
            db.collection("Equipes").doc(equipes[index].id).update({
                poule: parent.id == "list_Equipes"? null:parent.id
            })
            .then(() => {
                if(index == equipes.length-1){
                    notifie("Enregistré !");
                    if (fin){
                        if (document.getElementById("list_Equipes").childNodes.length<8) document.location.href = "F-V_ConfigArbitres.html";
                        else notifie("Veuillez placer toutes les équipes dans une poule")   
                    }
                }
            })
            .catch((error) => {
                notifie("Une erreur est survenue")
                console.log("Error updating document: ", error);
                return false
            });
        })(i); 
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
    event.dataTransfer.setData("Equipe", event.target.id);
});

document.addEventListener("drop", function(event) {
    event.preventDefault();
    if ( event.target.classList.contains("poule")) {
      event.target.classList.remove("Survole");
      var data = event.dataTransfer.getData("Equipe");
      event.target.appendChild(document.getElementById(data));
    }else if(event.target.classList.contains("Liste_Equipes_defil")){
        var data = event.dataTransfer.getData("Equipe");
        event.target.appendChild(document.getElementById(data));
    }else if (event.target.parentNode.classList.contains("poule")){
        event.target.parentNode.classList.remove("Survole");
        var data = event.dataTransfer.getData("Equipe");
        event.target.parentNode.appendChild(document.getElementById(data));
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

if(document.getElementsByClassName("Liste_Equipes_défil") == ""){
    document.getElementById("Confirm_pools").classList.remove("Cache");
    document.getElementById("Confirm_pools").classList.add("Affiche");
}

document.getElementById("enr_poules").addEventListener('click', function(e){
    if(enregistreEquipes());
})

document.getElementById("conf_poules").addEventListener('click', function(e){
    enregistreEquipes(true)
})
