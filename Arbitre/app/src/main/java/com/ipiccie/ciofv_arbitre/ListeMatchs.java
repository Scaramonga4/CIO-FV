package com.ipiccie.ciofv_arbitre;

import static android.content.ContentValues.TAG;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;

import androidx.annotation.Nullable;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.dialog.MaterialAlertDialogBuilder;
import com.google.firebase.firestore.EventListener;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.FirebaseFirestoreException;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.ArrayList;
import java.util.List;

public class ListeMatchs extends AppCompatActivity {

    private String poule;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_liste_matchs);

        FirebaseFirestore db = FirebaseFirestore.getInstance();

        poule = getIntent().getStringExtra("poule");
        String chemin = String.format("/Poules/%s/matchs",poule);
        List<Match> listeMatchs = new ArrayList<>();
        RecyclerView recyclerView = findViewById(R.id.recyclage);
        recyclerView.setHasFixedSize(true);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        db.collection(chemin)
                .addSnapshotListener((value, error) -> {
                    if (error != null) {
                        Log.w(TAG, "Listen failed.", error);
                        return;
                    }

                    listeMatchs.clear();
                    if (value != null) {
                        for (QueryDocumentSnapshot document : value) {
                            Match match = document.toObject(Match.class);
                            listeMatchs.add(match);
                            Log.d(TAG, document.getId() + " => " + document.getData());
                        }
                    }
                    AdaptateurAdapte adaptateurAdapte = new AdaptateurAdapte(this, listeMatchs);
                    recyclerView.setAdapter(adaptateurAdapte);


                });

        ActionBar ab = (this.getSupportActionBar());
        if(ab != null){
            ab.setDisplayHomeAsUpEnabled(true);
        }
    }

    public void lanceAct(String id){
        Intent intention = new Intent(this,ActiviteArbitrage.class);
        intention.putExtra("id",id);
        intention.putExtra("poule",poule);
        startActivity(intention);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.mon_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch(item.getItemId()) {
            case android.R.id.home:
                onBackPressed();
                return true;
            case R.id.stop:
                finish();
                return(true);
            case R.id.a_propos:
                new MaterialAlertDialogBuilder(this)
                        .setTitle("A propos")
                        .setMessage("Application d'arbitrage développée par l'association IPIC-ASSO, dans le cadre de l'organisation de la Fête du Volley du Lycée Val de Durance")
                        .setPositiveButton("ok", (dialogInterface, i) -> dialogInterface.dismiss())
                        .show();
                return(true);
        }
        return(super.onOptionsItemSelected(item));
    }
}