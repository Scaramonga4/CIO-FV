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
        body: Padding(padding: const EdgeInsets.all(8),
          child:ListView(
          children: [
            Center(
              child:
            Padding(
              padding: EdgeInsets.fromLTRB(5,10,5,10),
                child:Text(widget.Terrain,style: TextStyle(fontSize: 22))),),
            Center(
              child:
            Padding(
              padding: EdgeInsets.fromLTRB(5,10,5,20),
               child:Text("heure de début: "+heure,style: TextStyle(fontSize: 17, fontStyle: FontStyle.italic)),
            ),),
            Container(
              width: double.infinity,
              child:Row(
                children: [
                  new Expanded(child: Text(equipe_1.classe.toString(), style: TextStyle(fontSize: 20),textAlign: TextAlign.center,), flex: 1,),
                  new Expanded(child: const Text(" VS ", style:TextStyle(fontSize: 20),textAlign: TextAlign.center,), flex: 0,),
                  new Expanded(child: Text(equipe_2.classe.toString(), style:TextStyle(fontSize: 20),textAlign: TextAlign.center,), flex: 1,)
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
            Row(
              children: <Widget>[
                Container(
                  padding: const EdgeInsets.all(8),
                  child: Text(equipe_1.devise.toString(), textAlign: TextAlign.center,style: TextStyle(fontStyle : FontStyle.italic,fontSize: 18)),
                ),
                Container(
                  padding: const EdgeInsets.all(8),
                  child: Text(equipe_2.devise.toString(), textAlign: TextAlign.center,style: TextStyle(fontStyle : FontStyle.italic,fontSize: 18)),
                ),]),
            Row(
              children:<Widget>[
                new Expanded(child:Text("Capitaine: "+equipe_1.capitaine.toString(), textAlign: TextAlign.center,style: TextStyle(fontSize: 18),),flex: 1,),
                new Expanded(child:Text("Capitaine: "+equipe_2.capitaine.toString(), textAlign: TextAlign.center,style: TextStyle(fontSize: 18),),flex: 1,),
                ]),
            Container(
            padding: const EdgeInsets.all(8),
            decoration: new BoxDecoration(color: Colors.blue[200],borderRadius: BorderRadius.all(Radius.circular(10))),
            child:Row(
              children:<Widget>[
                new Expanded(child:Text("Joueurs : \n"+equipe_1.joueurs.toString(),style: TextStyle(fontSize: 18),)),
                new Expanded(child:Text("Joueurs : \n"+equipe_2.joueurs.toString(),style: TextStyle(fontSize: 18),),),
              ],
            ))
        ])
    ));
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
              score1 = score["Equ1"].toString()??"0";
              score2 = score["Equ2"].toString()??"0";
            });
            litEquipe(event.data()!["equipes"]??{"Equ1":"inconnu","Equ2":"inconnu"});
          }
        },
        onError: (error) => print("Listen failed: $error"),
    );
  }

  Future<void> litEquipe(equipes) async {
    String equ1 =equipes["Equ1"]??"inconnu";
    String equ2 =equipes["Equ2"]??"inconnu";
    final snap = await monPostier.prendEquipe(equ1);
    if(snap!=null){
      setState(() {
        equipe_1 = snap.data()!;
      });
    }
    final snap2 = await monPostier.prendEquipe(equ2);
    if(snap2!=null){
      setState(() {
        equipe_2 = snap2.data()!;
      });
    }
  }
}