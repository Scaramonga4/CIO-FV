package com.ipiccie.ciofv_arbitre;

import static android.content.ContentValues.TAG;

import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import androidx.appcompat.content.res.AppCompatResources;

import com.google.firebase.firestore.FirebaseFirestore;

import java.util.List;
import java.util.Objects;

public class BaseAdapteFinale extends BaseAdapter {
    Context c;
    List<Match> matchs;
    String phase;

    private FirebaseFirestore db;

    BaseAdapteFinale(Context c, List< Match> matchs, String phase) {
        this.c = c;
        this.matchs = matchs;
        this.phase = phase;
        db = FirebaseFirestore.getInstance();
    }

    @Override public int getCount() { return matchs.size(); }

    @Override public Match getItem(int i) { return matchs.get(i); }

    @Override public long getItemId(int i) { return 0; }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {

        Match monMatch = matchs.get(i);

        if (view == null) {
            LayoutInflater inflater = (LayoutInflater)c.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            view = inflater.inflate(R.layout.profil_match_final, null);
        }
        Log.d(TAG, "getView: "+monMatch);
        TextView terrain = view.findViewById(R.id.terrain);
        TextView joueur1 = view.findViewById(R.id.nom_equipe_1);
        TextView joueur2 = view.findViewById(R.id.nom_equipe_2);
        TextView score1 = view.findViewById(R.id.score_equipe_1);
        TextView score2 = view.findViewById(R.id.score_equipe_2);
        if (monMatch.getTerrain()!=null){
            terrain.setText(monMatch.getTerrain());
        }

        if (monMatch.getScore()!=null){
            score1.setText(monMatch.getScore().get("Equ1").toString());
            score2.setText(monMatch.getScore().get("Equ2").toString());
        }

        db.collection("Equipes").document(Objects.requireNonNull(monMatch.getEquipes().get("Equ1")))
                .get()
                .addOnSuccessListener(documentSnapshot -> {
                    Log.d(TAG, "onSuccess: "+documentSnapshot.getData());
                    if ( documentSnapshot.get("classe")!=null) joueur1.setText(Objects.requireNonNull(documentSnapshot.get("classe")).toString());
                    else joueur1.setText("donnée indisponible");
                });
        db.collection("Equipes").document(Objects.requireNonNull(monMatch.getEquipes().get("Equ2")))
                .get()
                .addOnSuccessListener(documentSnapshot -> {
                    Log.d(TAG, "onSuccess: "+documentSnapshot.getData());
                    if ( documentSnapshot.get("classe")!=null) joueur2.setText(Objects.requireNonNull(documentSnapshot.get("classe")).toString());
                    else joueur2.setText("donnée indisponible");
                });

        if (monMatch.getTermine()!= null && monMatch.getTermine()!=0){
            switch (monMatch.getTermine()){
                case 1:
                    view.findViewById(R.id.ligne_equ1).setBackgroundColor(c.getColor(R.color.victoire));
                    view.findViewById(R.id.ligne_equ2).setBackgroundColor(c.getColor(R.color.banni));
                    break;
                case 2:
                    view.findViewById(R.id.ligne_equ1).setBackgroundColor(c.getColor(R.color.banni));
                    view.findViewById(R.id.ligne_equ2).setBackgroundColor(c.getColor(R.color.victoire));
                    break;
                default:
                    view.findViewById(R.id.ligne_equ1).setBackgroundColor(c.getColor(R.color.banni));
                    view.findViewById(R.id.ligne_equ2).setBackgroundColor(c.getColor(R.color.banni));
            }


        }
        view.setOnClickListener(v->{
            Intent intention = new Intent(c,ActiviteArbitrage.class);
            intention.putExtra("id",monMatch.getId());
            intention.putExtra("poule",phase);
            c.startActivity(intention);
            if (c instanceof ListeMatchs){
                ((ListeMatchs)c).lanceAct(monMatch.getId());
            }
        });

        return view;
    }
}
