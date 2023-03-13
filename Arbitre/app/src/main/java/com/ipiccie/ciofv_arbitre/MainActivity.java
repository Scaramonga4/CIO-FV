package com.ipiccie.ciofv_arbitre;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;

import com.google.android.material.dialog.MaterialAlertDialogBuilder;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        findViewById(R.id.poule_A).setOnClickListener(v->{
            Intent intention = new Intent(this,ListeMatchs.class);
            intention.putExtra("poule","Poule_A");
            startActivity(intention);
        });
        findViewById(R.id.poule_B).setOnClickListener(v->{
            Intent intention = new Intent(this,ListeMatchs.class);
            intention.putExtra("poule","Poule_B");
            startActivity(intention);
        });
        findViewById(R.id.poule_C).setOnClickListener(v->{
            Intent intention = new Intent(this,ListeMatchs.class);
            intention.putExtra("poule","Poule_C");
            startActivity(intention);
        });
        findViewById(R.id.poule_D).setOnClickListener(v->{
            Intent intention = new Intent(this,ListeMatchs.class);
            intention.putExtra("poule","Poule_D");
            startActivity(intention);
        });
        findViewById(R.id.poule_E).setOnClickListener(v->{
            Intent intention = new Intent(this,ListeMatchs.class);
            intention.putExtra("poule","Poule_E");
            startActivity(intention);
        });
        findViewById(R.id.poule_F).setOnClickListener(v->{
            Intent intention = new Intent(this,ListeMatchs.class);
            intention.putExtra("poule","Poule_F");
            startActivity(intention);
        });
        findViewById(R.id.finale).setOnClickListener(v->{
            startActivity(new Intent(this,phaseFinale.class));
        });
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