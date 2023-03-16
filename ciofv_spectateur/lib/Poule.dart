import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import 'laPoste.dart';

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

  @override
  void initState() {
    super.initState();
    monPostier = laPoste(firebaseFirestore: db);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Poules')), //Appel de la class MyAppBar
      body:StreamBuilder<QuerySnapshot>(
        stream: monPostier.prendPoule(widget.poule),
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
                    child: Text(widget.nomPoule)
                ),
                Row(
                  children: [
                    Text(widget.Terrain,style:TextStyle(fontStyle: FontStyle.italic)),
                    Text("heure",style:TextStyle(fontStyle: FontStyle.italic))
                  ],
                ),
                ListView.builder(
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

  Widget construitMatch(int index, QueryDocumentSnapshot<Object?>? doc) {
    if (doc!=null){
      return Row(
        children: [
          Text("Equipe1"),
          Text("O:0"),
          Text("Equipe2")
        ],
      );
    }else{
      return Text("!ERREUR! donnée inaccessible");
    }
  }
}