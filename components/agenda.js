import React, { useState, useEffect } from 'react';
import { fire, auth, storage, db } from '../config/firebase-config';
import Link from 'next/link'
import utilStyles from '../styles/utils.module.scss'
import styles from '../styles/component/agenda.module.scss'

import dayjs from 'dayjs'
import updateLocale from 'dayjs/plugin/updateLocale'
dayjs.extend(updateLocale);
dayjs.updateLocale('fr', {
    weekdays: [
      "dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"
    ]
})


export default function Agenda({parentCallback, props}) {
   
    const [ daysCalendar, setDayscalendar ] = useState(); 

    useEffect(() => {

        // fire
        // .firestore()
        // .collection()

        let next10Days = []
        for (let i = 0; i < 10; i++) {
            let day = {
                date : dayjs().add(i, 'day').locale('fr').format('ddd D'),
                name : dayjs().add(i, 'day').locale('fr').format('dddd')
            }
            next10Days.push(day)
            setDayscalendar(next10Days);
        }

        console.log('datejs', dayjs().add(0, 'day').locale('fr').format('dddd D'));

    }, [])

    console.log('daysCalendar',daysCalendar);

    return(
        <div>
            <h3>Agenda des retraits des commandes</h3>

        </div>
    )

}