import 'package:flutter/material.dart';

class BarreAppli extends StatelessWidget implements PreferredSizeWidget {
  const BarreAppli({super.key});


  @override
  Widget build(BuildContext context) {
    return AppBar( //Barre au dessus de l'app
        title: const Text('Poules'),
        backgroundColor : const Color.fromARGB(0, 255, 255, 255),
        elevation : 0,
        leading: const IconButton( //création icone de menu haut gauche de l'écran
          icon: Icon(
            Icons.menu,
            //color: Color.white,
          ),
          onPressed: null,
        ),
        actions: const [ //création liste/icone vertical haut droite
          IconButton(
            icon: Icon(
              Icons.more_vert,
              //color: Color.white,
            ),
            onPressed: null,
          )
        ]
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(100);
}