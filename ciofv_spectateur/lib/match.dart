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
  String heure = "--h--";
  String Equ1 = "Equipe 1";
  String Equ2 = "Equipe 2";
  String score1 = "--:--";
  String score2 = "--:--";

  @override
  void initState() {
    super.initState();
    monPostier = laPoste(firebaseFirestore: db);
    litMatchs();
    litEquipe();
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
        body: Column(
          children: [
            Padding(
              padding: EdgeInsets.fromLTRB(5,10,5,10),
                child:Text(widget.Terrain,style: TextStyle(fontSize: 22))),
            Padding(
              padding: EdgeInsets.fromLTRB(5,10,5,10),
               child:Text("heure de début: ",style: TextStyle(fontSize: 19, fontStyle: FontStyle.italic)),
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
            )
        ])
    );
  }

  litMatchs(){
    var snap = monPostier.prendMatch(widget.nomPoule, widget.idMatch);
    snap.listen(
        (event) {
          if (event.get("heure")!=null) {
            final x = event.get('heure') as Timestamp;
            final maDate = DateTime.parse(x.toDate().toString());
            setState(() {
              heure = maDate.hour.toString()+ "h"+maDate.minute.toString();
            });
          }else {
            heure =  "--:--";
          }
          Map<String, dynamic> score = event.get("score") ?? {"Equ1": 0, "Equ2": 0};
          setState(() {
            print(score1);
            print(score2);
            score1 = score["Equ1"]??"0";
            score2 = score["Equ2"]??"0";
          });
        },
        onError: (error) => print("Listen failed: $error"),
    );
  }

  void litEquipe() {
    
  }
}