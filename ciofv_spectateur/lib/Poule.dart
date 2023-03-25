import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import 'laPoste.dart';
import 'match.dart';

class Poule extends StatefulWidget{

  final String poule;
  final String Terrain;
  final String nomPoule;

  const Poule({Key? key, required this.poule, required this.Terrain, required this.nomPoule}) : super(key: key);

  @override
  State<Poule> createState() => _Poule();

}

class _Poule extends State<Poule>{

  FirebaseFirestore db = FirebaseFirestore.instance;
  late laPoste monPostier;
  late double ppadding = 0;
  late double hauteur = 100;

  @override
  void initState() {
    super.initState();
    monPostier = laPoste(firebaseFirestore: db);
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
      body:FutureBuilder<QuerySnapshot>(
        future: monPostier.prendPoule(widget.poule),
        builder: (BuildContext context,
        AsyncSnapshot<QuerySnapshot> snapshot) {
          if (snapshot.hasData) {
            return Column(
              children: [
                Padding(
                    padding: const EdgeInsets.only(
                      left: 40,
                      top: 5,
                      right: 40,
                      bottom: 5,
                    ),
                    child: Text(widget.nomPoule, style: TextStyle(fontSize: 20),)
                ),
                Center(
                  child:Text("terrain: "+widget.Terrain,style:TextStyle(fontSize:16, fontStyle: FontStyle.italic)),
                  ),

                ListView.builder(
                scrollDirection: Axis.vertical,
                shrinkWrap: true,
                itemCount: snapshot.data?.docs.length,
                itemBuilder: (context, index) =>
                construitMatch(index, snapshot.data?.docs[index]))
              ],
            );
          }
          else{
            return const Center(
              child: CircularProgressIndicator(
                //color: AppCouleur.charge,
              ),
            );
          }
        }
      )

    );
  }

  Widget construitMatch(int index, DocumentSnapshot? doc) {
    if (doc != null) {
      Map<String, dynamic> score = doc.get("score") ?? {"Equ1": 0, "Equ2": 0};
      final etat = doc.get("termine") ?? 0;
      var date;
      if (doc.get("heure")!=null) {
        final x = doc.get('heure') as Timestamp;
        final maDate = DateTime.parse(x.toDate().toString());
        date = maDate.hour.toString()+ "h"+maDate.minute.toString();
      }else {
       date =  "--:--";
      }
        return FutureBuilder(
            future: monPostier.nomEquipes(
                doc.get("equipes") ?? {"Equ1": "null", "Equ2": "null"}),
            builder: (context, AsyncSnapshot<Map<String, dynamic>> snapshot) {
              if (snapshot.connectionState == ConnectionState.done) {
                Map<String, dynamic> equipes = snapshot.data as Map<String, dynamic>;
                return Padding(
                    padding: EdgeInsets.all(5),
                    child:GestureDetector(
                        onTap: ()=> Navigator.of(context).push(versMonMatch(doc.id)),
                        child:Container(
                    decoration: new BoxDecoration(
                        borderRadius: new BorderRadius.circular(16.0),
                        gradient: LinearGradient(
                            begin: Alignment.topRight,
                            end: Alignment.bottomLeft,
                            colors:[
                              etat==0?Colors.grey:etat==1?Colors.green:Colors.red,
                              etat==0?Colors.grey:etat==2?Colors.green:Colors.red,
                            ],
                          stops: [0.45,0.55]
                        )
                    ),
                    child:Padding(
                    padding: EdgeInsets.all(ppadding),
                        child: Row(
                      mainAxisAlignment: MainAxisAlignment.center, //Center Row contents horizontally,
                      crossAxisAlignment: CrossAxisAlignment.center, //Center Row contents vertically,
                      children: [
                        new Expanded(child: Text(equipes["Equ1"] ?? "Equipe1"),flex:1),
                        new Expanded(child: Text((score["Equ1"] ?? "donnée indisponible").toString() +
                            ":" +
                            (score["Equ2"] ?? "donnée indisponible").toString()),flex: 0,),
                        new Expanded(child: Text(equipes["Equ2"] ?? "Equipe2", textAlign:TextAlign.center),flex:1),
                        new Expanded(child: Text(date, style: TextStyle(fontStyle: FontStyle.italic),), flex:0)
                      ],
                    )))));
              } else if (snapshot.connectionState == ConnectionState.none) {
                return Text("Données inaccessibles");
              }
              return CircularProgressIndicator();
            });
      }
    return Text("Données inaccessibles");
  }

  Route versMonMatch(String id) {
    return PageRouteBuilder(
      pageBuilder: (context, animation, secondaryAnimation) =>  Match(poule: widget.poule,nomPoule: widget.nomPoule,Terrain: widget.Terrain,idMatch: id,),
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        const begin = Offset(0.0, 1.0);
        const end = Offset.zero;
        const curve = Curves.ease;
        var tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));

        return SlideTransition(
          position: animation.drive(tween),
          child: child,
        );
      },
    );
  }
}