package com.ipiccie.ciofv_arbitre;

import static android.content.ContentValues.TAG;

import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.content.res.AppCompatResources;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;

import org.w3c.dom.Text;

import java.util.List;
import java.util.Objects;

public class AdaptateurAdapte extends RecyclerView.Adapter<AdaptateurAdapte.ViewHolder> {

    private final Context context;
    private final List<Match> mMatch;
    private FirebaseFirestore db;

    public AdaptateurAdapte(@NonNull Context context, List<Match>mMatch) {
        this.context = context;
        this.mMatch = mMatch;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.profil_match, parent,false);
        db = FirebaseFirestore.getInstance();
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Match match = mMatch.get(position);
        if (context instanceof ListeMatchs) {
            /*db.collection("Equipes").document(Objects.requireNonNull(match.getEquipes().get("Equ1")))
                    .get()
                    .addOnSuccessListener(documentSnapshot -> {
                        Log.d(TAG, "onSuccess: "+documentSnapshot.getData());
                        if ( documentSnapshot.get("classe")!=null) holder.equipe1.setText(Objects.requireNonNull(documentSnapshot.get("classe")).toString());
                        else holder.equipe1.setText("donnée indisponible");
                    });
            db.collection("Equipes").document(Objects.requireNonNull(match.getEquipes().get("Equ2")))
                    .get()
                    .addOnSuccessListener(documentSnapshot -> {
                        Log.d(TAG, "onSuccess: "+documentSnapshot.getData());
                        if ( documentSnapshot.get("classe")!=null) holder.equipe2.setText(Objects.requireNonNull(documentSnapshot.get("classe")).toString());
                        else holder.equipe2.setText("donnée indisponible");
                    });*/
        }
        holder.equipe1.setText(Objects.requireNonNull(match.getNomEquipe1()));
        holder.equipe2.setText(Objects.requireNonNull(match.getNomEquipe2()));
        holder.score.setText(String.format("%s:%s", match.getScore().get("Equ1"), match.getScore().get("Equ2")));
        if (match.getTermine()!=0){
            holder.itemView.setBackground(AppCompatResources.getDrawable(context,R.drawable.bords_bien_communistes));
        }
        holder.itemView.setOnClickListener(v->{
            if (context instanceof ListeMatchs){
                ((ListeMatchs)context).lanceAct(match.getId(), match.getNomEquipe1(),match.getNomEquipe2());
            }
        });
    }

    @Override
    public int getItemCount() {
        return mMatch.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder{
        private final TextView equipe1;

        private final TextView equipe2;
        private final TextView score;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            equipe1 = itemView.findViewById(R.id.Equipe_1);
            equipe2 = itemView.findViewById(R.id.Equipe_2);
            score = itemView.findViewById(R.id.Score);

        }

    }

}