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

var decalagePosition = [0,0];
var div_equipe;
var isDown = false;
var PouleSurvollee;



function RecupEquipes(){
    db.collection("/Equipes").onSnapshot((snapshot)=>{
        snapshot.docChanges().forEach((change) => {
            var classe = change.doc.data().classe==null?"inconnu au bataillon":change.doc.data().classe;
            console.log("Changement équipes?: ", change.doc.id);
            if (change.type === "added") {
                document.getElementById("vide").style.display = "none"
                var Equipe = document.createElement("div");
                Equipe.id = change.doc.id,
                Equipe.draggable = true;
                Equipe.className = "Equipe";
                Equipe.innerHTML = `<span pas-selectionnable="${classe}"></span>`;
                /*Equipe.addEventListener('mousedown', function(e) {   //ajoute l'écouteur.
                    isDown = true;    //l'utilisateur clique sur la div
                    div_equipe = this;
                    decalagePosition = [
                        div_equipe.offsetLeft - e.clientX,   //décalage en abscisse avec la souris
                        div_equipe.offsetTop - e.clientY      // décalage en ordonnée avec la souris
                    ];
                    
                    div_equipe.style.position = "absolute";
                    div_equipe.style.left = (e.clientX + decalagePosition [0]) + 'px';   
                    div_equipe.style.top  = (e.clientY + decalagePosition [1]) + 'px';
                }, true);*/
                console.log(change.doc.data().poule)
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

function enregistreEquipes(){
    var equipes = document.getElementsByClassName("Equipe");
    for(var i = 0; i < equipes.length; i++) {
        (function(index) {
            const parent = equipes[index].parentNode;
            db.collection("Equipes").doc(equipes[index].id).update({
                poule: parent.id == "list_Equipes"? null:parent.id
            })
            .then(() => {
                if(index = equipes.length-1)return True; 
                console.log("Document successfully updated!");
            })
            .catch((error) => {
                return false
                console.error("Error updating document: ", error);
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
        console.log('au dessus:',this.id)
        this.classList.add("Survole");
        PouleSurvollee = this.id;
    }
  })(i);
}

document.addEventListener("dragstart", function(event) {
    event.dataTransfer.setData("Equipe", event.target.id);
    console.log(event.target.className)
});

document.addEventListener("drop", function(event) {
    event.preventDefault();
    console.log(event.target.className)
    if ( event.target.classList.contains("poule")) {
      event.target.classList.remove("Survole");
      var data = event.dataTransfer.getData("Equipe");
      event.target.appendChild(document.getElementById(data));
    }else{
        var data = event.dataTransfer.getData("Equipe");
        document.getElementById("list_Equipes").appendChild(document.getElementById(data));
    }
  });


for(var i = 0; i < equipes.length; i++) {
    (function(index) {
      equipes[index].addEventListener('mousedown', function(e) {   //ajoute l'écouteur. Les paramètres sont: le type d'évènement que tu écoutes (ici souris qui clique) et une fonction qui dit ce qu'il faut faire, et un booléen, je sais pas trop à quoi il sert.
        isDown = true;    //l'utilisateur clique sur la div
        div_equipe = this;
        div_equipe.style.position = "absolute";
        decalagePosition = [
            div_equipe.offsetLeft - e.clientX,   //décalage en abscisse avec la souris
            div_equipe.offsetTop - e.clientY      // décalage en ordonnée avec la souris
        ];
    }, true);
    })(i);
}

function notifie(msg){
    var notif = document.getElementById("snackbar");
    notif.textContent=msg;
    notif.className = "show";
    setTimeout(function(){ notif.className = notif.className.replace("show", ""); }, 3000);
}

document.addEventListener('mouseup', function() {
    if (isDown){
        isDown = false;
        console.log("poule survolee: ",PouleSurvollee)
        if (PouleSurvollee != null)document.getElementById(PouleSurvollee).appendChild(div_equipe);
        else document.getElementById("list_Equipes").appendChild(div_equipe);
        div_equipe.style.position = "unset";
    }

    //document.getElementById(PouleSurvollee).appendChild(div_equipe);
    //setParent(document.getElementById('div_equipe'), document.getElementById("div_pool"));
    //document.getElementsByClassName("Equipe").display = unset;

}, true);

document.addEventListener('mousemove', function(event) {
    event.preventDefault();
    if (isDown) {
        var positionSouris= {
            x : event.clientX,   //abscisse actuelle de la souris
            y : event.clientY    //ordonnéeactuelle de la souris
        };
        //nouvelle position de la div, tenant compte du décalage
        div_equipe.style.left = (positionSouris.x + decalagePosition [0]) + 'px';   
        div_equipe.style.top  = (positionSouris.y + decalagePosition [1]) + 'px';
    }
}, true);

if(document.getElementsByClassName("Liste_Equipes_défil") == ""){
    document.getElementById("Confirm_pools").classList.remove("Cache");
    document.getElementById("Confirm_pools").classList.add("Affiche");
}

document.getElementById("enr_poules").addEventListener('click', function(e){
    if(enregistreEquipes())notifie("Enregistré !")
    else notifie("Une erreur est survenue")
    
})

document.getElementById("conf_poules").addEventListener('click', function(e){
    if(enregistreEquipes){
        console.log(document.getElementById("list_Equipes").childNodes.length)
        if (document.getElementById("list_Equipes").childNodes.length<8)document.location.href = "F-V_ConfigMatchs.html";
        else notifie("Veuillez placer toutes les équipes dans une poule")   
    }else{
        notifie("Une erreur est survenue")
    }
})
