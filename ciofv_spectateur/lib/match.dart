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
    // TODO: implement build
    throw UnimplementedError();
  }

}