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
import java.util.List;

public class ObjetFragmentDePhase extends Fragment {
    public static final String ARG_OBJECT = "phase";

    private final List<Match> listeMatchs = new ArrayList<>();

    @Override
    public View onCreateView(LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_objet_finale, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        Bundle args = getArguments();

        GridView grille = view.findViewById(R.id.grille);
        if (args != null) {
            String poule = args.getString(ARG_OBJECT,"rien");
            String chemin = String.format("/Poules/finale/%s",poule);
            FirebaseFirestore db = FirebaseFirestore.getInstance();
            db.collection(chemin).addSnapshotListener((value, error) -> {
                if (error != null) {
                    Log.w(TAG, "Listen failed.", error);
                    return;
                }
                listeMatchs.clear();
                if (value != null) {
                    for (QueryDocumentSnapshot document : value) {
                        Log.d(TAG, "onCreate: "+document.getData());
                        Match match = document.toObject(Match.class);
                        match.setId(document.getId());
                        listeMatchs.add(match);
                        Log.d(TAG, document.getId() + " => " + document.getData());
                    }
                }
                if(!listeMatchs.isEmpty() && this.getContext() instanceof phaseFinale){
                    BaseAdapteFinale maBase = new BaseAdapteFinale(this.requireContext(), listeMatchs, poule);
                    grille.setAdapter(maBase);
                }else{
                    view.findViewById(R.id.pas_de_match).setVisibility(View.VISIBLE);
                }
            });
        }
    }
}
