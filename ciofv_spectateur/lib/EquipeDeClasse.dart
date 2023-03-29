
import 'package:cloud_firestore/cloud_firestore.dart';

class EquipeDeClasse{

  String? poule = "poule inconnue";
  String? classe = "classe indisponible";
  String? devise = "...";
  int? victoires = 0;
  int? defaites = 0;
  int? egalites = 0;
  int? points = 0;
  String? joueurs = "[fantome]";
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
      egalites: data?['egalites'],
      joueurs: data?['nom_participant'] is Iterable ? List.from(data?['nom_participant']).join('\n') : "[fantome]",
    );
  }
  Map<String, dynamic> toFirestore() {
    return {
      if (poule != null) "poule": poule,
      if (classe != null) "classe": classe,
      if (devise != null) "devise": devise,
      if (capitaine != null) "capitaine": capitaine,
      if (arbitre != null) "arbitre": arbitre,
      if (points != null) "points": points,
      if (victoires != null) "victoires": victoires,
      if (defaites != null) "defaites": defaites,
      if (egalites != null) "egalites": egalites,
      if (joueurs != null) "nom_participants": joueurs,
    };
  }
}