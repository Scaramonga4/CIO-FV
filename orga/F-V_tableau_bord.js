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
var finale;
var liste_equipes = {};
var poule_equipe = {}
var drapeau = ""
var drapeau2 = ""
var mesMatchsAConfirmer = {}
var idEqu1= ""
var idEqu2 = ""

function RecupEquipes(){
    if(finale==null){
        db.collection("/Equipes").get().then((snapshot)=>{
            console.log("lit",snapshot)
            snapshot.docChanges().forEach(function(change, indi, liste) {
                if (change.type === "added") {
                    liste_equipes[change.doc.id] = change.doc.data().classe??"inconnu au bataillon"
                }
                if (indi === liste.length - 1)recuperationDesMatchs();
            });
        });
    }else{
        db.collection("/Equipes").where("finale", "==", finale).get().then((snapshot)=>{
            console.log("litF",snapshot)
            snapshot.docChanges().forEach(function(change, indi, liste) {
                if (change.type === "added") {
                    liste_equipes[change.doc.id] = change.doc.data().classe??"inconnu au bataillon"
                }
                if (indi === liste.length - 1)recuperationDesMatchs();
            });
        });
    }
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
        console.log(poules[indice])
        const maP = poules[indice]
        let chemin;
        if (finale==null) chemin="/Poules/"+maP+"/matchs"
        else chemin = "/Poules/finale/"+finale
        db.collection(chemin).get().then((snapshot)=>{
            snapshot.docChanges().forEach((change) => {
                console.log(change.doc.data())
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
                    monMatch.addEventListener("click",function(e){ouvreMatch(maP,monMatch.id)},false)
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
        if (finale!=null)break;
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
    if (finale==null)drapeau = "Poules/"+poule+"/matchs/"+id;
    else drapeau = "Poules/finale/"+finale+"/"+id;
    drapeau2 = id;
    db.doc(drapeau).get().then((value)=>{
        var mach = value.data();
        idEqu1 = mach.equipes.Equ1
        idEqu2 = mach.equipes.Equ2
        document.getElementById("score1").value = mach.score.Equ1??"-1"
        document.getElementById("score2").value = mach.score.Equ2??"-1"
        document.getElementById("equ1").innerHTML = liste_equipes[idEqu1];
        document.getElementById("equ2").innerHTML = liste_equipes[idEqu2];
        const mesbtnRadios = document.getElementsByClassName("rad")
        for (let i = 0; i<mesbtnRadios.length; i++){
            mesbtnRadios[i].checked=false;
        }
        if ((mach.termine??0 >0) && (mach.termine??0 <5)){
            mesbtnRadios[(mach.termine??0) -1].checked = true;
        }
        if (mach.verif??false){
            drapeau2 = "";
            document.getElementById("verif").checked=true
        }
        else {
            drapeau2 = "id";
            document.getElementById("verif").checked=false
        }
    })
}


function changeMatch(){
    let termine = 0;
    const mesbtnRadios = document.getElementsByClassName("rad")
        for (let i = 0; i<mesbtnRadios.length; i++){
            if(mesbtnRadios[i].checked==true)termine = i+1
        }
    if (document.getElementById("verif").checked && drapeau2.length>0){
        
        db.collection("Equipes").doc(idEqu1).update({
            "victoires":firebase.firestore.FieldValue.increment(termine==1?1:0),
            "egalite":firebase.firestore.FieldValue.increment(termine==3?1:0),
            "defaites":firebase.firestore.FieldValue.increment((termine!=3 && termine!=1)?1:0),
            "goalaverage":firebase.firestore.FieldValue.increment(document.getElementById("score1").value-document.getElementById("score2").value)
        })
    }
    db.doc(drapeau).update({
        "score":{
            "Equ1":document.getElementById("score1").value,
            "Equ2":document.getElementById("score2").value
        },
        "termine":termine,
        "verif":document.getElementById("verif").checked

    }).then(() => {
        notifie("Enregistré !")
    })
    .catch((error) => {
        // The document probably doesn't exist.
        notifie("Une erreur est survenue")
        console.error("Error updating document: ", error);
    });
    document.getElementById('pop_match').style.display='none'
    return false;
}


function notifie(msg){
    var notif = document.getElementById("snackbar");
    notif.textContent=msg;
    notif.className = "show";
    setTimeout(function(){ notif.className = notif.className.replace("show", ""); }, 3000);
}


/*ICI-------------------*/

if (sessionStorage.getItem("poules")!=null){
    finale = sessionStorage.getItem("poules")
}
RecupEquipes();


document.getElementById("vers_finale").addEventListener("click",function(e){
    db.collection("Parametres").doc("etat").update({
        "finale":true
    }).then(()=>{
        document.location.href = "F-V_ConfigFinale.html";
    })
})

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