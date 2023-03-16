package com.ipiccie.ciofv_arbitre;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.viewpager.widget.ViewPager;

import com.google.android.material.tabs.TabLayout;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.List;
import java.util.Objects;


public class FragmentDePhase extends Fragment implements ViewPager.OnPageChangeListener{

    public FragmentDePhase() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_de_phase, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        FirebaseFirestore db = FirebaseFirestore.getInstance();
        db.collection("Poules").document("finale").addSnapshotListener((value, error) -> {
            CollectionDePagesAdaptes maCollection;
            if (value != null && value.get("ancienne_phases")!=null) {
                maCollection = new CollectionDePagesAdaptes(getChildFragmentManager(), (String[]) ((List)Objects.requireNonNull(value.get("ancienne_phases"))).toArray(new String[0]));
                ViewPager viewPager = view.findViewById(R.id.page);
                viewPager.setAdapter(maCollection);
                TabLayout tabLayout = view.findViewById(R.id.tab_layout);
                tabLayout.setupWithViewPager(viewPager);
            }else{
                view.findViewById(R.id.no_content_text).setVisibility(View.VISIBLE);
            }
        });
    }

    @Override
    public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {
        //RàS
    }

    @Override
    public void onPageSelected(int position) {
        //RàS
    }

    @Override
    public void onPageScrollStateChanged(int state) {
        //RàS
    }
}