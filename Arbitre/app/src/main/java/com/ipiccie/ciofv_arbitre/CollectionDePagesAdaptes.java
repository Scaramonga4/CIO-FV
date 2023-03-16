package com.ipiccie.ciofv_arbitre;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentStatePagerAdapter;

public class CollectionDePagesAdaptes extends FragmentStatePagerAdapter {

    private final String[] nombrePhases;
    public CollectionDePagesAdaptes(FragmentManager fm, String[] nombrePhases) {
        super(fm);
        this.nombrePhases = nombrePhases;
    }

    @NonNull
    @Override
    public Fragment getItem(int i) {
        Fragment fragment = new ObjetFragmentDePhase();
        Bundle args = new Bundle();
        // Our object is just an integer :-P
        //args.putInt(ObjetFragmentDePhase.ARG_OBJECT, i + 1);
        args.putString(ObjetFragmentDePhase.ARG_OBJECT,nombrePhases[i]);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public int getCount() {
        return nombrePhases.length;
    }

    @Override
    public CharSequence getPageTitle(int position) {
        return "PHASE " + (position + 1);
    }
}


