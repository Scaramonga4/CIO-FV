import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'Poule.dart';
import 'barre_appli.dart';
import 'laPoste.dart';

class PageDePoule extends StatefulWidget{

  const PageDePoule({Key? key}) : super(key: key);

  @override
  State<PageDePoule> createState() => _PageDePoule();

}

class _PageDePoule extends State<PageDePoule>{//création de la page de Poules

  FirebaseFirestore db = FirebaseFirestore.instance;
  late laPoste monPostier;
  List<String> poules = ["Poule_A","Poule_B","Poule_C","Poule_D","Poule_E","Poule_F"];
  late List<String> nomDesPoules = ["Poule A","Poule B","Poule C","Poule D","Poule E","Poule F"];
  late List<String> terrain= [];
  List<QueryDocumentSnapshot> listeEquipe = [];
  late double ppadding = 0;
  late double hauteur = 100;

  @override
  initState() {
    super.initState();
    monPostier = laPoste(firebaseFirestore: db);
    Future.delayed(Duration.zero, () {
      setState(() {
        ppadding = MediaQuery.of(context).size.width/30;
        hauteur = MediaQuery.of(context).size.height;
      });
    });
    initPouleEtTerrains();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Poules')), //Appel de la class MyAppBar
      body:GridView.count(
      // Create a grid with 2 columns. If you change the scrollDirection to
      // horizontal, this produces 2 rows.
      crossAxisCount: 2,
      // Generate 100 widgets that display their index in the List.
      children: List.generate(6, (index) {
        return Center(
          child:Padding(
            padding: EdgeInsets.only(
              left: ppadding,
              top: ppadding/2,
              right: ppadding,
              bottom: ppadding/2,
            ),
            child: GestureDetector(
              onTap: ()=> Navigator.of(context).push(versMaPoule(index)),
              child:Container(
              decoration: BoxDecoration(
                border: Border.all(color: Colors.blueAccent),
                borderRadius: const BorderRadius.all(Radius.circular(20))
              ),
              child:Container(
                  constraints: new BoxConstraints(
                  minHeight: 800,
                  minWidth: ppadding*28,
                  maxHeight: 900,
                  maxWidth: ppadding*30,
                  ),
                child:Column(

              children: [
                Padding(
                  padding: EdgeInsets.only(
                    left: ppadding,
                    top: ppadding/2,
                    right: ppadding,
                    bottom: ppadding/8,
                  ),
                  child:Text(
                    nomDesPoules[index],
                    //style: Theme.of(context).textTheme.headlineSmall,
                  )
                ),
              Padding(
                  padding: EdgeInsets.only(
                    left: ppadding,
                    top: ppadding/8,
                    right: ppadding,
                    bottom: ppadding/8,
                  ),
                  child:terrain.isNotEmpty?Text(
                   "terrain: "+terrain[index],
                   style:const TextStyle(fontStyle: FontStyle.italic)
                  ):Center(
                    child: LinearProgressIndicator())),
                const Divider(
                  height: 5,
                  thickness: 2,
                  indent: 10,
                  endIndent: 10,
                  color: Colors.grey,
                ),
                buildListEquipe(poules[index])
            ],
          )
        )))));
      }),
    ),
    );
  }


  Widget buildListEquipe(String poule) {
    return Flexible(
      child:Container(
        constraints: new BoxConstraints(
          minHeight: double.infinity,
          minWidth: ppadding*28,
          maxHeight: double.infinity,
          maxWidth: ppadding*30,
        ),
      child: FutureBuilder<QuerySnapshot>(
          future: monPostier.prendNomPoules(poule),
          builder: (BuildContext context,
              AsyncSnapshot<QuerySnapshot> snapshot) {
              if (snapshot.hasData) {
                listeEquipe = snapshot.data!.docs;
                if(listeEquipe.isNotEmpty){
                  return ListView.builder(
                  itemCount: snapshot.data?.docs.length,
                  itemBuilder: (context, index) =>
                  construitEquipe(index, snapshot.data?.docs[index])
                  );
                }else {
                return const Center(
                  child: Text('Aucune équipe programmée...', textAlign: TextAlign.center,),
                );
              }
            } else {
              return const Center(
                child: CircularProgressIndicator(
                  //color: AppCouleur.charge,
                ),
              );
            }
          }
          )
    ));
  }

  Widget construitEquipe(int index, QueryDocumentSnapshot<Object?>? doc) {
    if (doc != null && doc.get("classe")!=null) {
      return Container(padding: const EdgeInsets.all(2),
        width: 250,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(5),
        ),
        child: Center(
          child:ElevatedButton(
              style: ElevatedButton.styleFrom(
                padding: EdgeInsets.all(2)
                //minimumSize: const Size.fromHeight(40), // fromHeight use double.infinity as width and 40 is the height
              ),
            onPressed: ()=>Navigator.of(context).push(versMaPoule(index)),
            child:Text(
                doc.get("classe"),
                //style: const TextStyle(fontSize: 18),
            )
          )
        ),);
    }else{
      return const Text("équipe indisponible");
    }
  }

  Route versMaPoule(int index) {
    return PageRouteBuilder(
      pageBuilder: (context, animation, secondaryAnimation) =>  Poule(poule:poules[index], Terrain: terrain[index],nomPoule: nomDesPoules[index],),
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

  Future<void> initPouleEtTerrains() async {
    terrain = await monPostier.getTerrains(poules);
    nomDesPoules = await monPostier.getNomsPoules(poules);
    setState(() {
    });
  }
}

TableRow _tableRow = const TableRow( // création table équipe
  children: <Widget> [
    Padding(
      padding: EdgeInsets.all(10.0),
      child: Text('Poule A'),
    ),
    Padding(
      padding: EdgeInsets.all(10.0),
      child: Text('Poule B'),
    ),
    Padding(
      padding: EdgeInsets.all(10.0),
      child: Text('Poule C'),
    ),
    Padding(
      padding: EdgeInsets.all(10.0),
      child: Text('Poule D'),
    ),
    Padding(
      padding: EdgeInsets.all(10.0),
      child: Text('Poule E'),
    ),
    Padding(
      padding: EdgeInsets.all(10.0),
      child: Text('Poule F'),
    ),
  ],

);

