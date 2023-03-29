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


function RecupTerrains(){
    for (var indice = 0; indice<poules.length ;indice++){
        const indi = indice;
        db.collection("/Poules").doc(poules[indi]).get().then((docx)=>{
            console.log(docx.data().terrain)
            document.getElementById(poules[indi]).value = docx.data().terrain??"?"
        })
    }
}

function RecupParams(){
    db.collection("/Parametres").doc("Points").get().then((docx)=>{
        document.getElementById("victoire").value = docx.data().victoire??"3"
        document.getElementById("egalite").value = docx.data().egalite??"2"
        document.getElementById("defaite").value = docx.data().defaite??"1"
        document.getElementById("forfait").value = docx.data().forfait??"0"
    })
}

function Enregistre(){
    db.runTransaction((transaction) => {
        for (var indice = 0; indice<poules.length ;indice++){
            const indi = indice;
            const chemin = db.collection("/Poules").doc(poules[indi])
            transaction.update(chemin, {
                "terrain":document.getElementById(poules[indi]).value
            })
        }
        const chemin2 = db.collection("/Parametres").doc("Points")
        transaction.set(chemin2,{
            "victoire":document.getElementById("victoire").value,
            "egalite":document.getElementById("egalite").value,
            "defaite":document.getElementById("defaite").value,
            "forfait":document.getElementById("forfait").value
        })
        console.log(document.getElementById("forfait").value)
        const chemin3 = db.collection("Parametres").doc("etat")
        transaction.update(chemin3,{
            lancement:true
        })

        return Promise.resolve('transaction complete')
    }).then(() => {
        document.location.href = "F-V_tableau_bord.html";
        
    }).catch((error) => {
        console.log("Transaction failed: ", error);
    });;
    return false;
}

RecupTerrains();
RecupParams();

document.getElementById("menu").addEventListener("click",function(event){
    document.getElementById("maNavDeCote").style.width = "250px";
  document.getElementById("main").style.opacity = "50%";
  var dimmer = $('.noirceur');
  dimmer.show();
  });

  document.getElementById("closebtn").addEventListener('click',function (e) {
    document.getElementById("maNavDeCote").style.width = "0";
    document.getElementById("main").style.opacity = "100%";
    var dimmer = $('.noirceur');
    dimmer.hide();
  });