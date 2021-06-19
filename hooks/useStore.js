
import { useState, useEffect, useContext, createContext} from 'react';
import fire from '../config/firebase-config';
import { useAuth } from './useAuth';

const storeContext = createContext({ store: {} });
const { Provider } = storeContext;

export function StoreProvider({ children }){
    const store = useStoreProvider();
    return <Provider value={store}>{children}</Provider>;
}
export const useStore = () => {
    return useContext(storeContext);
};   

const useStoreProvider = () => {
    const auth = useAuth();
    const user = auth.user; 

    const [store, setStore] = useState({
        panier : null
    });

    useEffect(() => {

        if(user !== null){
            fire
            .firestore()
            .collection('Panier')
            .doc(user.uid)
            .onSnapshot((doc) => {
                if(doc.data() !== undefined){
                    let listeProduit = doc.data().listeRefProduit;
                    setStore({...store, panier : listeProduit});
                }
            })
        }
    }, [user]);
    

    const addProduitToShopcart = (idProduit) => {
        // console.log('store.panier', store.panier);
        let newObjPanier = {};
        if(store.panier === null){
            newObjPanier = {[idProduit] : {id : idProduit, count : 1}};
        }else{
            if(store.panier.hasOwnProperty(idProduit)){
                newObjPanier = {...store.panier}; 
                newObjPanier[idProduit].count = newObjPanier[idProduit].count + 1
            }else{
                newObjPanier = {...store.panier, [idProduit] : {id : idProduit, count : 1}};
            }
        }

        fire
        .firestore()
        .collection('Panier')
        .doc(user.uid)
        .set({
            listeRefProduit: newObjPanier
        }, {merge: true})
        .then(() => {
            setStore({...store, panier: newObjPanier });
        })
        .catch((error) => {
            console.log('Error add RefProduct to Doc in collection Panier', error);
        })
    };

    const changeNumberProduitToShopcart = (idProduit, one) => {
        // console.log('store.panier', store.panier);
        let newObjPanier = {...store.panier};
        let ctrlQuantity = newObjPanier[idProduit].count;

        if(newObjPanier[idProduit].count > 1){

            newObjPanier[idProduit].count = newObjPanier[idProduit].count + one
        }else if(one > 0){
            newObjPanier[idProduit].count = newObjPanier[idProduit].count + one
        }

        
        if(ctrlQuantity !==  newObjPanier[idProduit].count){
            fire
            .firestore()
            .collection('Panier')
            .doc(user.uid)
            .set({
                listeRefProduit: newObjPanier
            }, {merge: true})
            .then(() => {
                setStore({...store, panier: newObjPanier });
            })
            .catch((error) => {
                console.log('Error add RefProduct to Doc in collection Panier', error);
            })
        }
    };

    const deleteProduitToShopcart = (idProduit) => {
        // console.log('store.panier', store.panier);
        let newObjPanier = {...store.panier};
        delete newObjPanier[idProduit];

        fire
        .firestore()
        .collection('Panier')
        .doc(user.uid)
        .set({
            listeRefProduit: newObjPanier
        })
        .then(() => {
            setStore({...store, panier: newObjPanier });
        })
        .catch((error) => {
            console.log('Error add RefProduct to Doc in collection Panier', error);
        })
    };



    return {
        store,
        addProduitToShopcart,
        changeNumberProduitToShopcart,
        deleteProduitToShopcart
    };
};