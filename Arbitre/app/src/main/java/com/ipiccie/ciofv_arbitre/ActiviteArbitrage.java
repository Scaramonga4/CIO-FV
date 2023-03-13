package com.ipiccie.ciofv_arbitre;

import static android.content.ContentValues.TAG;

import android.app.TimePickerDialog;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.material.dialog.MaterialAlertDialogBuilder;
import com.google.firebase.Timestamp;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.Calendar;
import java.util.Map;
import java.util.Objects;

public class ActiviteArbitrage extends AppCompatActivity {

    private Match monMatch;
    private Equipe Equ1;
    private Equipe Equ2;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_activite_arbitrage);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
        String id = getIntent().getStringExtra("id");
        String poule = getIntent().getStringExtra("poule");
        FirebaseFirestore db = FirebaseFirestore.getInstance();
        DocumentReference docRef;
        //si on est en poule ou en finale
        if (poule.contains("Poule")) docRef = db.collection("Poules").document(poule).collection("matchs").document(id);
        else docRef = db.collection("Poules").document("finale").collection(poule).document(id);
        docRef.addSnapshotListener((snapshot, e) -> {
            if (e != null) {
                Log.w(TAG, "Listen failed.", e);
                return;
            }
            if (snapshot != null && snapshot.exists()) {
                Log.d(TAG, "Current data: " + snapshot.getData());
                monMatch = snapshot.toObject(Match.class);
                if (monMatch != null) {
                    majNoms(monMatch, db);
                    maJinter(monMatch);
                    Log.d(TAG, "onCreate: "+monMatch.getTermine());
                    if (monMatch.getEquipes()!=null && monMatch.getEquipes().get("Equ1")!=null && monMatch.getEquipes().get("Equ2")!=null) {
                        DocumentReference docRefEqu1 = db.collection("Poules").document(monMatch.getEquipes().get("Equ1"));
                        DocumentReference docRefEqu2 = db.collection("Poules").document(monMatch.getEquipes().get("Equ2"));
                        if (monMatch.getTermine() == 0)
                            initEcoute(docRef, poule, docRefEqu1, docRefEqu2);
                        else {
                            findViewById(R.id.info_fin).setVisibility(View.VISIBLE);
                            Button bouton = findViewById(R.id.fin_match);
                            EditText commentaire = findViewById(R.id.commentaire);
                            bouton.setBackgroundColor(ContextCompat.getColor(this,R.color.gris));
                            commentaire.setFocusable(false);
                            commentaire.setClickable(false);
                            commentaire.setCursorVisible(false);
                        }
                    }else{
                        Toast.makeText(this, "Une erreur est survenue, contactez les organisateurs", Toast.LENGTH_LONG).show();
                    }
                }
            } else {
                Log.d(TAG, "Current data: null");
            }
        });
        ActionBar ab = (this.getSupportActionBar());
        if(ab != null){
            ab.setDisplayHomeAsUpEnabled(true);
        }
    }

    private void majNoms(Match monMatch, FirebaseFirestore db) {
        TextView j1 = findViewById(R.id.nom_j1);
        TextView j2 = findViewById(R.id.nom_j2);
        EditText commentaire = findViewById(R.id.commentaire);
        db.collection("Equipes").document(Objects.requireNonNull(monMatch.getEquipes().get("Equ1")))
                .get()
                .addOnSuccessListener(documentSnapshot -> {
                    Log.d(TAG, "onSuccess majk: "+documentSnapshot.getData());
                    Equ1 = documentSnapshot.toObject(Equipe.class);
                    Log.d(TAG, "majNoms: "+Equ1.devise);
                    if (Equ1!=null &&  Equ1.getClasse()!=null) j1.setText(Equ1.getClasse());
                    else j1.setText(getString(R.string.txt_donne_pas_dispo));
                });
        db.collection("Equipes").document(Objects.requireNonNull(monMatch.getEquipes().get("Equ2")))
                .get()
                .addOnSuccessListener(documentSnapshot -> {
                    Log.d(TAG, "onSuccess: "+documentSnapshot.getData());
                    Equ2 = documentSnapshot.toObject(Equipe.class);
                    if (Equ2!=null &&  Equ2.getClasse()!=null) j2.setText(Equ2.getClasse());
                    else j2.setText(getString(R.string.txt_donne_pas_dispo));
                });
        commentaire.setText(monMatch.getCommentaire());
        if (monMatch.getTermine()==1){
            j1.setBackgroundColor(ContextCompat.getColor(this,R.color.victoire));
            j2.setBackgroundColor(ContextCompat.getColor(this,R.color.banni));
        }else if (monMatch.getTermine()==2){
            j1.setBackgroundColor(ContextCompat.getColor(this,R.color.banni));
            j2.setBackgroundColor(ContextCompat.getColor(this,R.color.victoire));
        }else if (monMatch.getTermine()==3){
            j1.setBackgroundColor(ContextCompat.getColor(this,R.color.banni));
            j2.setBackgroundColor(ContextCompat.getColor(this,R.color.banni));
        }
    }

    public void initEcoute(DocumentReference docRef, String poule, DocumentReference docRefEqu1, DocumentReference docRefEqu2){
        findViewById(R.id.plus_1).setOnClickListener(v->{
            if (monMatch!=null){
                Map<String,Integer> score = Map.of(
                    "Equ1", Math.max(Objects.requireNonNull(monMatch.getScore().get("Equ1"))+1,0),
                    "Equ2", Objects.requireNonNull(monMatch.getScore().get("Equ2"))
                );
                docRef.update("score", score);
            }
        });
        findViewById(R.id.plus_2).setOnClickListener(v->{
            if (monMatch!=null){
                Map<String,Integer> score = Map.of(
                        "Equ1", Objects.requireNonNull(monMatch.getScore().get("Equ1")),
                        "Equ2", Math.max(Objects.requireNonNull(monMatch.getScore().get("Equ2"))+1,0)
                );
                docRef.update("score", score);
            }
        });
        findViewById(R.id.moins_1).setOnClickListener(v->{
            if (monMatch!=null){
                Map<String,Integer> score = Map.of(
                    "Equ1", Math.max(Objects.requireNonNull(monMatch.getScore().get("Equ1"))-1,0),
                    "Equ2", Objects.requireNonNull(monMatch.getScore().get("Equ2"))
                );
                docRef.update("score", score);
            }
        });
        findViewById(R.id.moins_2).setOnClickListener(v->{
            if (monMatch!=null){
                Map<String,Integer> score = Map.of(
                        "Equ1", Objects.requireNonNull(monMatch.getScore().get("Equ1")),
                        "Equ2", Math.max(Objects.requireNonNull(monMatch.getScore().get("Equ2"))-1,0)
                );
                docRef.update("score", score);
            }
        });
        com.google.android.material.textfield.TextInputEditText heure = findViewById(R.id.heure_debut);
        Calendar myCalendar = Calendar.getInstance();
        TimePickerDialog.OnTimeSetListener monPreneurDheure = (timePicker, i, i1) -> {
            Calendar time = Calendar.getInstance();
            time.set(Calendar.HOUR_OF_DAY, i);
            time.set(Calendar.MINUTE, i1);
            docRef.update("heure", new Timestamp(time.getTime()));
        };
        heure.setOnClickListener(v-> new TimePickerDialog(this,monPreneurDheure,myCalendar.get(Calendar.HOUR_OF_DAY),myCalendar.get(Calendar.MINUTE),true).show());

        findViewById(R.id.fin_match).setOnClickListener(v->{
            LayoutInflater inflater = (LayoutInflater)   this.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            View view = inflater.inflate(R.layout.resultat, null);
            RadioGroup group = view.findViewById(R.id.vainqueur);
            RadioButton j1 = view.findViewById(R.id.v1);
            RadioButton j2 = view.findViewById(R.id.v2);
            TextView nomj1 = findViewById(R.id.nom_j1);
            TextView nomj2 = findViewById(R.id.nom_j2);
            j1.setText(String.format("Vainqueur: %S",nomj1.getText().toString()));
            j2.setText(String.format("Vainqueur: %S",nomj2.getText().toString()));
            int s1 = Objects.requireNonNull(monMatch.getScore().get("Equ1"));
            int s2 = Objects.requireNonNull(monMatch.getScore().get("Equ2"));
            if (s1>s2){
                group.check(R.id.v1);
            }else if (s2>s1){
                group.check(R.id.v2);
            }
            new MaterialAlertDialogBuilder(this)
                    .setTitle("RESULTATS")
                    .setPositiveButton("Valider", (dialogInterface, i) -> {
                        switch (group.getCheckedRadioButtonId()){
                            case R.id.v1:
                                docRef.update("termine",1);
                                Equ1.setVictoires(Equ1.getVictoires()+1);
                                Equ2.setDefaites(Equ2.getDefaites()+1);
                                break;
                            case R.id.v2:
                                docRef.update("termine",2);
                                Equ1.setDefaites(Equ1.getDefaites()+1);
                                Equ2.setVictoires(Equ2.getVictoires()+1);
                                break;
                            default:
                                docRef.update("termine",3);
                                Equ1.setEgalites(Equ1.getEgalites()+1);
                                Equ2.setEgalites(Equ1.getEgalites()+1);
                                break;
                        }
                        EditText commentaire= findViewById(R.id.commentaire);
                        docRef.update("commentaire",commentaire.getText().toString());
                        docRefEqu1.set(Equ1).addOnSuccessListener(unused -> Log.d(TAG, "onSuccess: POUF scores à jour"));
                        docRefEqu2.set(Equ2);
                        dialogInterface.dismiss();
                        Intent intention = new Intent(this,ListeMatchs.class);
                        intention.putExtra("poule",poule);
                        onBackPressed();
                    })
                    .setView(view)
                    .show();
        });
    }

    public void maJinter(Match monMatch){
        if (monMatch!=null){
            TextView sc1 = findViewById(R.id.score_equ1);
            TextView sc2 = findViewById(R.id.score_equ2);
            com.google.android.material.textfield.TextInputEditText heure = findViewById(R.id.heure_debut);
            sc1.setText(Objects.requireNonNull(monMatch.getScore().get("Equ1")).toString());
            sc2.setText(Objects.requireNonNull(monMatch.getScore().get("Equ2")).toString());
            heure.setText((monMatch.getHeure()==null?"00":monMatch.getHeure().getHours())+":"+(monMatch.getHeure()==null?"00":monMatch.getHeure().getMinutes()));
        }
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
            default:
                return(super.onOptionsItemSelected(item));
        }
    }

}