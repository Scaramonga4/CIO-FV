package com.ipiccie.ciofv_arbitre;

import java.util.Map;

public class Match {
    private String id;
    private String heure;
    private String commentaire;
    private Map<String, String> score;
    private Map <String,String> equipes;
    private Integer termine;

    public Match(){

    }
    public  Match(String id, String heure, String commentaire, Map< String,String> score, Map<String,String> equipes, Integer termine){
        this.id= id;
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

    public String getHeure() {
        return heure;
    }

    public void setHeure(String heure) {
        this.heure = heure;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }

    public Map<String, String> getScore() {
        return score;
    }

    public void setScore(Map<String, String> score) {
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
