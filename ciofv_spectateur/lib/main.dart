import 'package:ciofv_spectateur/barre_appli.dart';
import 'package:ciofv_spectateur/liste_poules.dart';
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import 'firebase_options.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);

  runApp(FeteVolley());
}


class FeteVolley extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false, //Pour enlever l'icone debug
      title: 'Fête Du Volley !',
      home: Accueil(),
    );
  }
}

class Accueil extends StatefulWidget{
  const Accueil({Key? key}) : super(key: key);

  @override
  State<Accueil> createState() => _Accueil();

}

class _Accueil extends State<Accueil>{

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: BarreAppli(),
        body: Padding(
          padding: const EdgeInsets.all(10),
          child: ListView(
            children: <Widget>[
              Container(
                alignment: Alignment.center,
                padding: const EdgeInsets.all(10),
                child: const Text(
                'Fête du Volley du lycée Val de Durance édition 2023',
                  style: TextStyle(
                    color: Colors.blue,
                    fontWeight: FontWeight.w500,
                    fontSize: 30),
                  )
              ),
              Container(
                  height: 70,
                  padding: const EdgeInsets.fromLTRB(10, 10, 10, 10),
                  child: ElevatedButton(
                    child: const Text('matchs',style: TextStyle(fontSize: 18),),
                    onPressed: () {
                      Navigator.of(context).push(versPoules());
                    },
                  )
              ),

              Container(
                  height: 70,
                  padding: const EdgeInsets.fromLTRB(10, 10, 10, 10),
                  child: ElevatedButton(
                    child: const Text('Equipes',style: TextStyle(fontSize: 18),),
                    onPressed: () {
                      Navigator.of(context).push(versEquipes());
                    },
                  )
              ),
        ]
    )));
  }

  Route versPoules() {
    return PageRouteBuilder(
      pageBuilder: (context, animation, secondaryAnimation) => const PageDePoule(),
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

  Route versEquipes() {
    return PageRouteBuilder(
      pageBuilder: (context, animation, secondaryAnimation) => const PageDePoule(),
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        const begin = Offset(1.0, 0.0);
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
