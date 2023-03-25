package com.ipiccie.ciofv_arbitre;

import static android.content.ContentValues.TAG;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.GridView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

public class ObjetFragmentDePhase extends Fragment {
    public static final String ARG_OBJECT = "phase";

    private final List<Match> listeMatchs = new ArrayList<>();
    private final Map<String,String> listeEquipes = new HashMap<>();

    @Override
    public View onCreateView(LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_objet_finale, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        Bundle args = getArguments();
        Log.d(TAG, "onViewCreated: 0OKK");
        GridView grille = view.findViewById(R.id.grille);
        if (args != null) {
            String poule = args.getString(ARG_OBJECT,"rien");
            String chemin = String.format("/Poules/finale/%s",poule);
            FirebaseFirestore db = FirebaseFirestore.getInstance();
            db.collection(chemin).get().addOnCompleteListener(task -> {
                if (task.isSuccessful()) {
                    listeMatchs.clear();
                    for (QueryDocumentSnapshot document : task.getResult()) {
                        Log.d(TAG, document.getId() + " => " + document.getData());
                        Match match = document.toObject(Match.class);
                        match.setId(document.getId());
                        listeMatchs.add(match);
                    }
                    db.collection("Equipes").whereEqualTo("poule", poule).get().addOnCompleteListener(task1 -> {
                        if (task1.isSuccessful()) {
                            for (QueryDocumentSnapshot document : task1.getResult()) {
                                listeEquipes.put(document.getId(), Objects.requireNonNull(document.getData().get("classe")).toString());
                            }
                            for (Match monMatch : listeMatchs) {
                                monMatch.setNomEquipe1(listeEquipes.get(monMatch.getEquipes().get("Equ1")));
                                monMatch.setNomEquipe2(listeEquipes.get(monMatch.getEquipes().get("Equ2")));
                            }
                            if (!listeMatchs.isEmpty() && this.getContext() instanceof phaseFinale) {
                                BaseAdapteFinale maBase = new BaseAdapteFinale(this.requireContext(), listeMatchs, poule);
                                grille.setAdapter(maBase);
                            } else {
                                view.findViewById(R.id.pas_de_match).setVisibility(View.VISIBLE);
                            }
                        } else {
                            Log.d(TAG, "Error getting documents: ", task1.getException());
                        }
                    });
                } else {
                    Log.d(TAG, "Error getting documents: ", task.getException());
                }
            });
        }
    }
}
