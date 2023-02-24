package com.ipiccie.ciofv_arbitre;

import java.sql.Timestamp;
import java.util.Date;
import java.util.Map;

public class Match {
    private String id;
    private Date heure;
    private String commentaire;
    private Map<String, Integer> score;
    private Map <String,String> equipes;
    private Integer termine;

    public Match(){

    }
    public  Match(Date heure, String commentaire, Map< String,Integer> score, Map<String,String> equipes, Integer termine){
        this.heure = heure;
        this.commentaire = commentaire;
        this.score = score;
        this.equipes = equipes;
        this.termine = termine;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Date getHeure() {
        return heure;
    }

    public void setHeure(Date heure) {
        this.heure = heure;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }

    public Map<String, Integer> getScore() {
        return score;
    }

    public void setScore(Map<String, Integer> score) {
        this.score = score;
    }

    public Map<String, String> getEquipes() {
        return equipes;
    }

    public void setEquipes(Map<String, String> equipes) {
        this.equipes = equipes;
    }

    public Integer getTermine() {
        return termine;
    }

    public void setTermine(Integer termine) {
        this.termine = termine;
    }
}
