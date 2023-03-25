import 'package:cloud_firestore/cloud_firestore.dart';

class laPoste {

  final FirebaseFirestore firebaseFirestore;

  laPoste({
    required this.firebaseFirestore,
  });

  Future<QuerySnapshot<Map<String, dynamic>>> prendNomPoules(String poule){
    final PouleRef = firebaseFirestore.collection("Equipes");
    final demande = PouleRef.where("poule", isEqualTo:poule);
    return demande.get();
  }

  Future<QuerySnapshot<Map<String, dynamic>>> prendPoule(String poule){
    return firebaseFirestore.collection("Poules").doc(poule).collection("matchs").get();
  }

  Future<List<String>> getTerrains(List<String> listePoules) async {
    List<String> mesTerrains = [];
    for (String po in listePoules){
      await firebaseFirestore.collection("Poules").doc(po).get().then((DocumentSnapshot doc) {
        final x = doc.data() as Map<String, dynamic>;
        mesTerrains.add(x["terrain"] ?? "terrain indisponible");
      },
        onError: (e) => print("Error getting document: $e"),
      );
    }
    return mesTerrains;
  }

  Future <Map<String,dynamic>> nomEquipes(Map<String,dynamic> ids) async{
    final res = ids;
    await firebaseFirestore.collection("Equipes").doc(ids["Equ1"]).get().then((DocumentSnapshot doc) {
      final x = doc.data() as Map<String, dynamic>;
      res["Equ1"] = x["classe"]??"équipe indisponible";
    },
      onError: (e) => print("Error getting document: $e"),
    );
    await firebaseFirestore.collection("Equipes").doc(ids["Equ2"]).get().then((DocumentSnapshot doc) {
      final x = doc.data() as Map<String, dynamic>;
      res["Equ2"] = x["classe"]??"équipe indisponible";
    },
      onError: (e) => print("Error getting document: $e"),
    );
    return res;
  }


  Future<List<String>> getNomsPoules(List<String> listePoules) async {
    List<String> mesPoules = [];
    for (String po in listePoules){
      print(po);
      await firebaseFirestore.collection("Poules").doc(po).get().then((DocumentSnapshot doc) {
        final x = doc.data() as Map<String, dynamic>;
        mesPoules.add(x["name"] ?? "poule indisponible");
      },
      onError: (e) => print("Error getting document: $e"),
      );
    }
    if (mesPoules.length<6){
      return ["Poule A","Poule B","Poule C","Poule D","Poule E","Poule F"];
    }
    return mesPoules;
  }

}
