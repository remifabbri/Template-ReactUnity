import React, { useState, useEffect } from 'react';
import { fire, auth, storage, db } from '../config/firebase-config';
import { useStore } from '../hooks/useStore'; 
import Link from 'next/link'
import utilStyles from '../styles/utils.module.scss'
import styles from '../styles/component/ShoppingCartModal.module.scss'
import detectMobileOrDesktop from '../hooks/detectMobileOrDesktop.js'

export default function ShoppingCartModal({parentCallback, props}) {
    const userStore = useStore();
    const store = userStore.store;

    // .where(firebase.firestore.FieldPath.documentId(), "in", listOfReferences)

    const [produitPanier, setProduitPanier] = useState();
    const [prixTotal, setPrixTotal] = useState(0);

    useEffect(() => {
        console.log(store);
        if(store.panier !== null){
            getProductPanier();
        }
    }, [store])

    const getProductPanier = () => {
        fire
        .firestore()
        .collection('Boutique')
        .onSnapshot((querySnapshot) => {
            let productDB = [];
            querySnapshot.forEach((doc) => {
                console.log('doc.id', doc.id);
                console.log(store);

                console.log(store.panier);
                if(store.panier.hasOwnProperty(doc.id)){
                    let data = {
                        ...doc.data(), 
                        id : doc.id, 
                        count : store.panier[doc.id].count
                    }
                    productDB.push(data);
                }
            });
            setProduitPanier(productDB);
            let total = 0;
            productDB.forEach(element => {
                total = total + (element.count * element.prix);
            });
            setPrixTotal(total);
        })
    }

    console.log(produitPanier); 

    return(
        <div className={styles.shoppingCartModal}>
            <h3>Votre Panier</h3>
            <span>sous-total: <span>{prixTotal}€</span></span>
            <div className={styles.actionShoppingCart}>
                <button className={styles.btnActionSecondaire}>Détail</button>
                <button className={styles.btnActionPrincipale}>Passer au paiement</button>
            </div>
            {produitPanier && produitPanier.map(P => 
                <div key={P.id} className={styles.itemShoppingCart}>
                    <Link href="/boutiqueClient/[product]" as={'/boutiqueClient/' + P.id}>
                        <div className={styles.linkItem}>
                            <img src={P.images}/>
                            <p>{P.name}</p>
                        </div>
                    </Link>
                    <div className={styles.incremItem}>
                        <button onClick={(e) => {e.preventDefault(); userStore.changeNumberProduitToShopcart(P.id, -1)}}>-</button>
                        <span>{P.count}</span>
                        <button onClick={(e) => {e.preventDefault(); userStore.changeNumberProduitToShopcart(P.id, 1)}}>+</button>
                    </div>
                    <button onClick={(e) => {e.preventDefault(); userStore.deleteProduitToShopcart(P.id)}}>sup</button>
                </div>    
            )}
            
        </div>
    )
}