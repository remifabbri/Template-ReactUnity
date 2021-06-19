import React, { useState, useEffect } from 'react';
import fire from '../../../config/firebase-config';
import Layout from '../../../components/layout'; 
import Head from 'next/head'; 
import Link from 'next/link';

import styles from '../../../styles/page/gestionAgenda.module.scss';
import utilStyles from '../../../styles/utils.module.scss';

import Agenda from '../../../components/agenda'

export default function GestionAgenda() {

    const [horaireOuverture , setHoraireOuverture] = useState({
        lundi: [], 
        mardi: [], 
        mercredi: [],
        jeudi: [], 
        vendredi: [],
        samedi: [], 
        dimanche: []
    })

    const [whithdrawalLimite, setWithdrawalLimite] = useState(undefined);

    useEffect(() => {
        fire
        .firestore()
        .collection('AgendaBoutique')
        .doc('paramHoraire')
        .onSnapshot((doc) => {
            console.log(doc.data());
        })
    }, [])

    const addOpenHour = (e , jour) => {
        e.preventDefault();
        let newHoraire = {...horaireOuverture}; 
        newHoraire[jour].push(["",""]);
        setHoraireOuverture(newHoraire);
    }

    const changeHoraire = (jour, index, indexHoraire, e) => {
        let newHoraire = {...horaireOuverture}; 
        newHoraire[jour][index][indexHoraire] = e.target.value;

        fire
        .firestore()
        .collection('AgendaBoutique')
        .doc('paramHoraire')
        .set({
            horaireRetrait: newHoraire
        }, {merge: true})
        .then(() => {
            return setHoraireOuverture(newHoraire); 
        })

        setHoraireOuverture(newHoraire);

    }

    const deleteHoraire = ( e, jour, index ) => {
        e.preventDefault(); 
        console.log('jour', jour);
        console.log('index', index); 
        let newHoraire = {...horaireOuverture}; 
        newHoraire[jour].splice(index, 1);
        console.log(newHoraire);
        setHoraireOuverture(newHoraire);
    }

    const changeWhitdrawalLimite = (e) => {
        setWithdrawalLimite(e.target.value);
    }

    const optionHoraire = [
        {value: "4h"},
        {value: "4h30"},
        {value: "5h"},
        {value: "5h30"},
        {value: "6h"},
        {value: "6h30"},
        {value: "7h"},
        {value: "7h30"},
        {value: "8h"},
        {value: "8h30"},
        {value: "9h"},
        {value: "9h30"},
        {value: "10h"},
        {value: "10h30"},
        {value: "11h"},
        {value: "11h30"},
        {value: "12h"},
        {value: "12h30"},
        {value: "13h"},
        {value: "13h30"},
        {value: "14h"},
        {value: "14h30"},
        {value: "15h"},
        {value: "15h30"},
        {value: "16h"},
        {value: "16h30"},
        {value: "17h"},
        {value: "17h30"},
        {value: "18h"},
        {value: "18h30"},
        {value: "19h"},
        {value: "19h30"},
        {value: "20h"},
        {value: "20h30"},
        {value: "21h"},


    ]

    console.log('CTRL Horaire Ouverture', horaireOuverture);
    console.log('CTRL limite', whithdrawalLimite);

    return(
        <Layout backOffice>
            <Head>
                <title>Agenda Boutique</title>
            </Head>

            <div className={styles.rowTitleButton}>
                <h2>Gestion de l'agenda de votre boutique</h2>
            </div>

            <div>
                <h3>Délait Minimum de retrait des commandes</h3>
                <p>Définissez une limites de temps entre la validation de la commande et sont retrait.</p>
                <div>
                    <select value={whithdrawalLimite !== undefined ? whithdrawalLimite : ""} onChange={(e) => changeWhitdrawalLimite(e)}>
                        <option value="" >--Choisir une limite de retrait--</option>
                        <option value="0">pas de limite</option>
                        <option value='30'>30 minutes</option>
                        <option value='60'>1 heure</option>
                        <option value='120'>2 heures</option>
                        <option value='180'>3 heures</option>
                    </select>
                </div>

                <h3>Horraire d'ouverture pour le retrait des commandes.</h3>
                <div>

                    {horaireOuverture && Object.keys(horaireOuverture).map( (jour, indexJour) => 
                        <div key={indexJour}>
                            <label>{jour}</label>
                            {horaireOuverture[jour].length === 0 && 
                                <div>
                                    <p>Fermé</p>
                                    <button onClick={(e) => addOpenHour(e, jour) }>Ajouter une tranche horaire</button>
                                </div>
                            }

                            {horaireOuverture[jour].length > 0 && 
                                <div>
                                    {horaireOuverture[jour].map( (value, index) =>
                                    
                                        <div key={index}>
                                            {horaireOuverture[jour][index].map( (horaire, indexHoraire) => 
                                                <div key={indexHoraire}>
                                                    {indexHoraire === 0 ? 
                                                        <div>
                                                            <label>Ouverture</label>
                                                            <select value={horaire !== undefined ? horaire : ""} onChange={(e) => changeHoraire(jour, index, indexHoraire, e)}>
                                                                <option value="" >--Choisir un horaire--</option>
                                                                {optionHoraire.map( horaireOption => 
                                                                        <option key={horaireOption.value} value={horaireOption.value} >{horaireOption.value}</option>    
                                                                )}
                                                            </select>
                                                        </div>
                                                        :  
                                                        <div>
                                                            <label>Fermeture</label>
                                                            <select value={horaire !== undefined ? horaire : ""} onChange={(e) => changeHoraire(jour, index, indexHoraire, e)}>
                                                                <option value="" >--Choisir un horaire--</option>
                                                                {optionHoraire.map( horaireOption => 
                                                                        <option key={horaireOption.value} value={horaireOption.value} >{horaireOption.value}</option>    
                                                                )}
                                                            </select>
                                                        </div>
                                                    }
                                                </div>    
                                            )}
                                            <button onClick={(e) => deleteHoraire(e, jour, index)}>sup</button>
                                        </div>
                                    )}
                                    <button onClick={(e) => addOpenHour(e, jour) }>Ajouter une tranche horaire</button>
                                </div>
                            }
                        </div>
                    
                    )}
                </div>
            </div>
            <Agenda/>
        </Layout>
    )
}