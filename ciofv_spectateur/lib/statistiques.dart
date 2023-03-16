



import 'package:ciofv_spectateur/barre_appli.dart';
import 'package:flutter/material.dart';

void main() {
  runApp(FeteVolley());
}


class FeteVolley extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false, //Pour enlever l'icone debug
      title: 'Fête Du Volley !',
      //home: ScorePage(),
    );
  }
}

class ScorePage{ //création de la page de Poules
  @override
  Widget build(BuildContext context) {
    return Scaffold(
    appBar: BarreAppli(), //Appel de la class MyAppBar
    body: Container( //Corps de l'app
      child: Center(
        color : Color.white,
        child: Text(
            'Fête Du Volley !',
            textDirection: TextDirection.ltr,
            child: Column(
                children[
                Container(
                  height : 200,
                  color: Color.blue,
                )
                ]
            )
        ),
      ),
    ));
  }
}

DataTable( //création de la table des scores
columns: [
DataColumn(label: Text('EQUIPE')),
DataColumn(label: Text('Victoires')),
DataColumn(label: Text('Défaites')),
DataColumn(label: Text('Egalités')),
DataColumn(label: Text('Points')),
];
/*

  rows : [
    DataRow(cells: [                   // Pour rajouter les données
      DataCell(),
      DataCell(),
      DataCell(),
      DataCell(),
      DataCell(),
    ]),
  ];

  */
)