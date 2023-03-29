import 'package:ciofv_spectateur/EquipeDeClasse.dart';
import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import 'laPoste.dart';

class Match extends StatefulWidget{

  final String poule;
  final String idMatch;
  final String Terrain;
  final String nomPoule;

  const Match({Key? key, required this.poule, required this.Terrain, required this.nomPoule, required this.idMatch}) : super(key: key);

  @override
  State<Match> createState() => _Match();

}

class _Match extends State<Match>{

  FirebaseFirestore db = FirebaseFirestore.instance;
  late laPoste monPostier;
  late double ppadding = 0;
  late double hauteur = 100;
  EquipeDeClasse equipe_1 = EquipeDeClasse();
  EquipeDeClasse equipe_2 = EquipeDeClasse();
  String heure = "--h--";
  String Equ1 = "Equipe 1";
  String Equ2 = "Equipe 2";
  String score1 = "--:--";
  String score2 = "--:--";
  String devise1 = "devise";
  String devise2 = "devise";
  String capitaine1 ="";
  String capitaine2 ="";

  @override
  void initState() {
    super.initState();
    monPostier = laPoste(firebaseFirestore: db);
    litMatchs();
    Future.delayed(Duration.zero, () {
      setState(() {
        ppadding = MediaQuery.of(context).size.width/30;
        hauteur = MediaQuery.of(context).size.height;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(title: const Text('Poules')), //Appel de la class MyAppBar
        body: ListView(
          children: [
            Padding(
              padding: EdgeInsets.fromLTRB(5,10,5,10),
                child:Text(widget.Terrain,style: TextStyle(fontSize: 22))),
            Padding(
              padding: EdgeInsets.fromLTRB(5,10,5,20),
               child:Text("heure de début: "+heure,style: TextStyle(fontSize: 17, fontStyle: FontStyle.italic)),
            ),
            Container(
              width: double.infinity,
              child:Row(
                children: [
                  new Expanded(child: Text(Equ1, style: TextStyle(fontSize: 20),textAlign: TextAlign.center,), flex: 1,),
                  new Expanded(child: const Text(" VS ", style:TextStyle(fontSize: 20),textAlign: TextAlign.center,), flex: 0,),
                  new Expanded(child: Text(Equ2 , style:TextStyle(fontSize: 20),textAlign: TextAlign.center,), flex: 1,)
                ],
            )),
          Padding(
              padding: EdgeInsets.fromLTRB(5,10,5,10),
              child:Container(
              width: double.infinity,
              child:Row(
                children: [
                  new Expanded(child: Text(score1, style: TextStyle(fontSize: 24,fontWeight: FontWeight.bold),textAlign: TextAlign.center,), flex: 1,),
                  new Expanded(child: const Text(" : ", style:TextStyle(fontSize: 20),textAlign: TextAlign.center,), flex: 0,),
                  new Expanded(child: Text(score2 , style:TextStyle(fontSize: 24, fontWeight: FontWeight.bold),textAlign: TextAlign.center,), flex: 1,),
                ],)
              )
            ),
            GridView.count(
              childAspectRatio: 4.0,
              physics: ScrollPhysics(),
              shrinkWrap: true,
              padding: const EdgeInsets.all(20),
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
              crossAxisCount: 2,
              children: <Widget>[
                Container(
                  padding: const EdgeInsets.all(8),
                  child: Text("Devise", textAlign: TextAlign.center,style: TextStyle(fontStyle : FontStyle.italic,fontSize: 18)),
                ),
                Container(
                  padding: const EdgeInsets.all(8),
                  child: Text('Devise', textAlign: TextAlign.center,style: TextStyle(fontStyle : FontStyle.italic,fontSize: 18)),
                ),
                Container(
                  padding: const EdgeInsets.all(8),
                  color: Colors.teal[300],
                  child: const Text('X ou rien'),
                ),
                Container(
                  padding: const EdgeInsets.all(8),
                  color: Colors.teal[400],
                  child: const Text('Ben voyons'),
                ),
                Container(
                  padding: const EdgeInsets.all(8),
                  color: Colors.teal[500],
                  child: const Text('Compo'),
                ),
                Container(
                  padding: const EdgeInsets.all(8),
                  color: Colors.teal[600],
                  child: const Text('meilleure compo'),
                ),
              ],
            )
        ])
    );
  }

  litMatchs(){
    var snap = monPostier.prendMatch(widget.poule, widget.idMatch);
    snap.listen(
        (event) {
          print(event.exists);
          if(event.exists){
            print('ok2');
            if (event.data()!.containsKey("heure") && event.data()!["heure"]!=null) {
              final x = event.data()!['heure'] as Timestamp;
              final maDate = DateTime.parse(x.toDate().toString());
              setState(() {
                heure = maDate.hour.toString()+ "h"+maDate.minute.toString();
              });
            }else {
              heure =  "--:--";
            }
            Map<String, dynamic> score = event.data()!["score"] ?? {"Equ1": 0, "Equ2": 0};
            setState(() {
              print(score1);
              print(score2);
              score1 = score["Equ1"]??"0";
              score2 = score["Equ2"]??"0";
            });
            litEquipe(event.data()!["equipes"]??{"Equ1":"inconnu","Equ2":"inconnu"});
          }
        },
        onError: (error) => print("Listen failed: $error"),
    );
  }

  void litEquipe(equipes) {
    String equ1 =equipes["Equ1"];
    String equ2 =equipes["Equ2"];
    var snap = monPostier.prendEquipe(equ1);
    snap.then((DocumentSnapshot doc) {
        final data = doc.data() as Map<String, dynamic>;
        setState(() {
          Equ1 = data["classe"]??"inconnu au bataillon";
          devise1 = data["devise"]??"...";
        });
      },
      onError: (e) => print("Error getting document: $e"),
    );
    var snap2 = monPostier.prendEquipe(equ2);
    snap2.then((DocumentSnapshot doc) {
      final data = doc.data() as Map<String, dynamic>;
      setState(() {
        print('ok');
        Equ2 = data["classe"]??"inconnu au bataillon";
        devise2 = data["devise"]??"...";
      });
    },
      onError: (e) => print("Error getting document: $e"),
    );
  }
}