package com.ipiccie.ciofv_arbitre;

import java.lang.reflect.Array;

public class Equipe {
    String classement;
    String classe;
    String poule;
    String devise;

    String arbitre;

    String capitaine;
    Array joueurs;
    int passage;
    int victoires;
    int defaites;
    int egalites;
    int points;

    public Equipe(String classement, String classe, String poule, String devise, Array nom_participant, int passage, int victoires, int defaites, int egalites, int points) {
        this.classement = classement;
        this.classe = classe;
        this.poule = poule;
        this.devise = devise;
        this.joueurs = nom_participant;
        this.victoires = victoires;
        this.defaites = defaites;
        this.egalites = egalites;
        this.points = points;
        this.passage = passage;
    }

    public Equipe(String classement, String classe, String poule, String devise, String arbitre, String capitaine, Array joueurs, int passage, int victoires, int defaites, int egalites, int points) {
        this.classement = classement;
        this.classe = classe;
        this.poule = poule;
        this.devise = devise;
        this.arbitre = arbitre;
        this.capitaine = capitaine;
        this.joueurs = joueurs;
        this.passage = passage;
        this.victoires = victoires;
        this.defaites = defaites;
        this.egalites = egalites;
        this.points = points;
    }

    public Equipe() {
    }

    public String getClasse() {
        return classe;
    }

    public void setClasse(String classe) {
        this.classe = classe;
    }

    public int getVictoires() {
        return victoires;
    }

    public void setVictoires(int victoires) {
        this.victoires = victoires;
    }

    public int getDefaites() {
        return defaites;
    }

    public void setDefaites(int defaites) {
        this.defaites = defaites;
    }

    public int getEgalites() {
        return egalites;
    }

    public void setEgalites(int egalites) {
        this.egalites = egalites;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public void setClassement(String classement) {
        this.classement = classement;
    }

    public void setPoule(String poule) {
        this.poule = poule;
    }

    public void setDevise(String devise) {
        this.devise = devise;
    }

    public void setJoueurs(Array joueurs) {
        this.joueurs = joueurs;
    }

    public void setPassage(int passage) {
        this.passage = passage;
    }

    public String etat(){
        return (devise+" "+classe+" "+passage);
    }
}
