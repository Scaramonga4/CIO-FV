
import 'package:cloud_firestore/cloud_firestore.dart';

class EquipeDeClasse{

  String? poule = "poule inconnue";
  String? classe = "classe indisponible";
  String? devise = "...";
  int? victoires = 0;
  int? defaites = 0;
  int? egalites = 0;
  int? points = 0;
  List<String>? joueurs = [];
  String? capitaine = "inconnu au bataillon";
  String? arbitre = "inconnu au bataillon";

  EquipeDeClasse(){}

  EquipeDeClasse.complet({
      this.poule,
      this.classe,
      this.devise,
      this.victoires,
      this.defaites,
      this.egalites,
      this.points,
      this.joueurs,
      this.capitaine,
      this.arbitre});

  factory EquipeDeClasse.fromFirestore(
      DocumentSnapshot<Map<String, dynamic>> snapshot,
      SnapshotOptions? options,
      ) {
    final data = snapshot.data();
    return EquipeDeClasse.complet(
      poule: data?['poule'],
      classe: data?['classe'],
      devise: data?['devise'],
      capitaine: data?['capitaine'],
      arbitre: data?['arbitre'],
      points: data?['points'],
      victoires: data?['victoires'],
      defaites: data?['defaites'],
      egalites: data?['egallites'],
      joueurs: data?['nom_participants'] is Iterable ? List.from(data?['nom_participants']) : null,
    );
  }

}