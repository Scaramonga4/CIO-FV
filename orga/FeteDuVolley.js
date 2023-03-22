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


var Nombre_Equipes = 0;


function RecupEquipes(){
    db.collection("/Equipes").onSnapshot((snapshot)=>{
        snapshot.docChanges().forEach((change) => {
            var classe = change.doc.data().classe==null?"inconnu au bataillon":change.doc.data().classe;
            console.log("Changement équipes?: ", change.doc.id);
            if (change.type === "added") {
                document.getElementById("vide").style.display = "none"
                Nombre_Equipes++;
                document.getElementById("Nombre_Equipes").innerHTML = Nombre_Equipes;
                const Equipe = `<li class=maChips id="${change.doc.id}">${classe} <span class="closebtn" onclick="suprEquipe(this.parentElement.id)">&times;</span></li>`;
                document.getElementById("Liste_Equipes").innerHTML += Equipe;
            }
            if (change.type === "modified") {
                document.getElementById(change.doc.id).innerHTML = classe;
            }
            if (change.type === "removed") {
                Nombre_Equipes -= 1;
                document.getElementById("Nombre_Equipes").innerHTML = Nombre_Equipes;
                document.getElementById(change.doc.id).remove();
            }
        });
        if (Nombre_Equipes ==0){
            document.getElementById("vide").style.display = "block"
        }
    })
}

function Enregistre_equipe(){
    const nom = document.getElementById("entre_nom_equipe");
    const devise = document.getElementById("entre_devise");
    const mesJoueurs = document.getElementById("liste_joueurs").childNodes;
    const arbitre = document.getElementById("entre_arbitre");
    const capitaine = document.getElementById("entre_capitaine");
    var joueurs = []
    for (let i = 0; i <mesJoueurs.length; i++){
        if ( mesJoueurs[i].nodeName =="DIV")joueurs.push(mesJoueurs[i].id)
    }
    console.log("Document mis à jour",drapeau);
    if (drapeau==="NOUV"){
        db.collection("Equipes").add({
            "classe": nom.value,
            "devise": devise.value,
            "nom_participant": joueurs,
            "arbitre": arbitre.value,
            "capitaine":capitaine.value,
            "defaites":0,
            "victoires":0,
            "egalites":0,
            "poule":null,
            "classement":null,
            "passage":null,
        }).then((docRef) => {
            nom.value = ""
            devise.value = ""
            document.getElementById("liste_joueurs").innerHTML = "";
            document.getElementById("entre_joueur").value="";
            notifie("Enregistré !");
            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            notifie("Une erreur est survenue !");
            console.error("Error adding document: ", error);
        });
    }else{
        db.collection("Equipes").doc(drapeau).update({
            "classe": nom.value,
            "devise": devise.value,
            "nom_participant": joueurs,
            "arbitre": arbitre.value,
            "capitaine":capitaine.value,
            "defaites":0,
            "victoires":0,
            "egalites":0,
            "poule":null,
            "classement":null,
            "points":0,
        }).then(() => {
            nom.value = ""
            devise.value = ""
            document.getElementById("liste_joueurs").innerHTML = "";
            document.getElementById("entre_joueur").value="";
            notifie("Enregistré !");
            console.log("Document mis à jour",drapeau);
        })
        .catch((error) => {
            notifie("Une erreur est survenue !");
            console.error("Error adding document: ", error);
        });
    }
    
    document.getElementById('pop_nouv').style.display='none'
    return false;
}

function suprEquipe(id){
    db.collection("Equipes").doc(id).delete().then(() => {
        notifie("Equipe Supprimée")
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}

function nouvJoueur(nom){
    var listJoueurs = document.getElementById("liste_joueurs");
    var nouvDiv = document.createElement("div");
    nouvDiv.id=(nom)
    nouvDiv.className="maChips"
    nouvDiv.innerHTML=`${nom} <span class="closebtn" onclick="this.parentElement.style.display='none'">&times;</span>`;
    listJoueurs.appendChild(nouvDiv);
}

function Confirm_Equipe() {
    document.location.href = "F-V_ConfigPoules.html";
}

function notifie(msg){
    var notif = document.getElementById("snackbar");
    notif.textContent=msg;
    notif.className = "show";
    setTimeout(function(){ notif.className = notif.className.replace("show", ""); }, 3000);
}

function modifieEquipe(doc){
    var datum = doc.data();
    console.log("Modifie equipe: ", datum);
    document.getElementById("entre_nom_equipe").value = (datum.classe!=null?datum.classe:"");
    document.getElementById("entre_devise").value = (datum.devise!=null?datum.devise:"");
    document.getElementById("entre_capitaine").value = (datum.capitaine!=null?datum.capitaine:"");
    document.getElementById("entre_arbitre").value = (datum.arbitre!=null?datum.arbitre:"");
    if (datum.nom_participant!=null){
        for (let i = 0; i<datum.nom_participant.length;i++){
            nouvJoueur(datum.nom_participant[i])
        }
    }
    drapeau = doc.id;
    document.getElementById('pop_nouv').style.display='block'
}

//--------DEBUT---------------
var drapeau = null;

RecupEquipes();

$("#plus_joueur").click(function() {
    const nom = document.getElementById("entre_joueur").value
    document.getElementById("entre_joueur").value ="";
    nouvJoueur(nom);
});

$("#btn_nouv_equ").click(function() {
    drapeau = 'NOUV'; 
    document.getElementById("action_equ").innerHTML = "Nouvelle Equipe";
    document.getElementById('pop_nouv').style.display='block';
    document.getElementById("liste_joueurs").innerHTML = "";
    document.getElementById("entre_joueur").value="";
    document.getElementById("entre_devise").value="";
    document.getElementById("entre_capitaine").value ="";
    document.getElementById("entre_arbitre").value = "";
    document.getElementById("entre_nom_equipe").value="";
})

$("#Liste_Equipes").on("click", ".maChips", function(event){
    const id = this.id;
    db.collection("Equipes").doc(id).get().then((doc)=>{
        if (doc.exists) {
            document.getElementById("action_equ").innerHTML = "Modifier l'équipe";
            document.getElementById("liste_joueurs").innerHTML = "";
            modifieEquipe(doc)
        } else {
            notifie("Une erreur est survenue :/");
        }
    })
})