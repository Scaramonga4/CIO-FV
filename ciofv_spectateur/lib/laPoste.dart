import 'package:cloud_firestore/cloud_firestore.dart';

class laPoste {

  final FirebaseFirestore firebaseFirestore;

  laPoste({
    required this.firebaseFirestore,
  });

  Stream<QuerySnapshot> prendNomPoules(String poule){
    final PouleRef = firebaseFirestore.collection("Equipes");
    final demande = PouleRef.where("poule", isEqualTo:poule);
    return demande.snapshots();
  }

  Stream<QuerySnapshot<Map<String, dynamic>>> prendPoule(String poule){
    return firebaseFirestore.collection("Poules").doc(poule).collection("matchs").snapshots();
  }

  Future<List<String>> getTerrains(List<String> listePoules) async {
    List<String> mesTerrains = [];
    for (String po in listePoules){
      final x = await firebaseFirestore.collection("Poules").doc(po).snapshots() as Map<String, dynamic>;;
      mesTerrains.add(x["terrains"]!=null?x["terrains"]:"terrain indisponible");
    }
    return mesTerrains;
  }

  Future<List<String>> getNomsPoules(List<String> listePoules) async {
    List<String> mesPoules = [];
    for (String po in listePoules){
      final x = await firebaseFirestore.collection("Poules").doc(po).snapshots() as Map<String, dynamic>;;
      mesPoules.add(x["poule"]!=null?x["poule"]:"poule indisponible");
    }
    return mesPoules;
  }

}
