package com.ipiccie.ciofv_arbitre;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import android.os.Bundle;

public class phaseFinale extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_phase_finale);
        initialisePhase();
    }

    private void initialisePhase() {

        FragmentDePhase fragmentDePhase = new FragmentDePhase();
        FragmentManager manager = getSupportFragmentManager();
        FragmentTransaction transaction = manager.beginTransaction();
        transaction.replace(R.id.container, fragmentDePhase, "phase_maison");
        transaction.commit();
        manager.executePendingTransactions();
    }
}