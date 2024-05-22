import { db, getCurrentPois, getDataVals, getPoiData, updateCurrentPoiList, updateCollection, sendDataToBigQuery } from "../config/firebase"
import { updateDoc , getDocs, collection, doc, arrayUnion} from 'firebase/firestore'
import PlayerAdd from "../modals/PlayerAdd"
import TransactionAdd from "../modals/TransactionAdd";
import ArriveDepart from "../modals/ArriveDepart";
import NotesViewer from "../modals/NotesViewer";
import CasinoReportTableBodyMonthly from "./CasinoReportTableBody";
import CasinoReportTableHeadMonthly from "./CasinoReportTableHeadMonthly";
import CasinoReportTableHeadDaily from "./CasinoReportTableHeadDaily";
import CasinoReportTableHeadWeekly from "./CasinoReportTableHeadWeekly";
import { v4 as uuidv4 } from 'uuid';
import PlayerInfo from "../modals/PlayerInfo";


export const getAdjustedDateTime = () => {
    const currentDate = new Date();
    const timezoneOffsetInMinutes = currentDate.getTimezoneOffset();
    const adjustedDate = new Date(currentDate.getTime() - timezoneOffsetInMinutes * 60000);
    return adjustedDate.toISOString().slice(0, 16);
};


export const dateTransformer = (date) => {
    const transformedDate = date.split('T')
    return transformedDate[0]
}

export const timeTransformer = (date) => {
    const transformedDate = date.split('T')
    return transformedDate[1]
}
export const dateTimeTransformer = (date) => {
    const transformedDate = date.split('T')
    return `${transformedDate[0]} ${transformedDate[1]}`
}
export const monthTransformer = (date) => {
    const transformedDate = date.split(' ')
    return `${transformedDate[0]}`
}
export const yearTransformer = (date) => {
    const transformedDate = date.split(' ')
    return `${transformedDate[1]}`
}

export const getMonthFromString = (mon) =>{
    return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1
 }
 
export const useLongPress = (onLongPress, ms = 100) => {
    let timerId;

    const start = (index) => {
        timerId = setTimeout(() => onLongPress(index), ms);
    };

    const stop = () => {
        clearTimeout(timerId);
    };

    return (index) => ({
        onTouchStart: () => start(index),
        onTouchEnd: stop,
        onMouseDown: () => start(index),
        onMouseUp: stop,
        onMouseLeave: stop,
    });
};





export const fetchCurrentPoiList = async (casino, setCurrentPoiList) =>{
    // console.log(casino)
    const data = await getCurrentPois(casino) || []
    data.pois && setCurrentPoiList(data.pois)
    // console.log(data)
  }

export const handleCasinoChange = (selectedOption, setCurrentPoiList, setState) => {
    setState((prev)=>({
        ...prev,
        selectedCasino: selectedOption.value
    }));
    sessionStorage.setItem("currentCasino", JSON.stringify(selectedOption.value));
    console.log(selectedOption)
    fetchCurrentPoiList(selectedOption.value, setCurrentPoiList)
  };
  
export const fetchDataVals = async (setState, selectedCasino, setCurrentPoiList) => {
    const data = await getDataVals();  // Assuming this returns data for 'dataValsList'
    const data2 = await getPoiData();  // Assuming this returns data for 'poiList'

    console.log(selectedCasino)
    let data3;
      if(selectedCasino !== 'Select A Casino'){
        data3 = await getCurrentPois(selectedCasino);
        if (data3 && data3.pois != null) { 
            // console.log(data3)

          sessionStorage.setItem('currentPoiList', JSON.stringify(data3.pois));
          sessionStorage.setItem('selectedCasino', JSON.stringify(selectedCasino));
          updateCurrentPoiList(selectedCasino,data3.pois)
          setCurrentPoiList(data3.pois);
        } else {console.log("Nope")}
      }  

    handleStateUpdate(data, 'dataValsList', setState);
    handleStateUpdate(data2, 'poiList', setState);
};

export const handleOpenModal = async ( modal, setState ,index='', currentPoiList={} ) => {
    handleStateUpdate(modal, 'selectedModal', setState)
    handleStateUpdate(true, 'openModal', setState)
    handleStateUpdate(index, 'index', setState)
    handleStateUpdate(currentPoiList[index], 'selectedPoi', setState)
    // console.log(currentPoiList[index])
  };

export const handleCloseModal = ( setState ) => {
    handleStateUpdate(null,'transactionIndex',setState)
    handleStateUpdate(null,'editedVisit',setState)
    handleStateUpdate(false,'playerInfoEdited',setState)
    handleStateUpdate(null,'selectedPoi',setState)
    handleStateUpdate(null,'updatedArrival',setState)
    handleStateUpdate(null,'updatedDeparture',setState)
    handleStateUpdate('', 'selectedModal', setState)
    handleStateUpdate(false, 'openModal', setState)
    handleStateUpdate(false, 'notesEditMode', setState)
    handleStateUpdate('', 'index', setState)
  };

export const getComponentByName = (name, props) => {
    // console.log(name)
    const components = {
      playerAdd: <PlayerAdd {...props}/>,
      transactionAdd: <TransactionAdd {...props}/>,
      arriveDepart: <ArriveDepart {...props}/>,
      notesViewer: <NotesViewer {...props}/>,
      monthlyHead: <CasinoReportTableHeadMonthly {...props}/>,
      monthlyBody: <CasinoReportTableBodyMonthly {...props}/>,
      weeklyHead: <CasinoReportTableHeadWeekly {...props}/>,
      weeklyBody: <CasinoReportTableBodyMonthly {...props}/>,
      dailyHead: <CasinoReportTableHeadDaily {...props}/>,
      dailyBody: <CasinoReportTableBodyMonthly {...props}/>,
      playerInfo: <PlayerInfo {...props}/>,
    //   rosterEdit: <RosterEdit {...props}/>,
    //   editTransaction: <TransactionEdit {...props}/>,
    };
  
    // Return the component that matches the 'name' parameter,
    // or null if no match is found.
    return components[name] || null;
  }
  export const getSubmitByName = (name, ...args) => {
    const [state] = args;  // Only to access state for checking transactionIndex
    // console.log('Transaction Index:', state.transactionIndex);

    const submits = {
        playerAdd: () => addPoi(...args),
        transactionAdd: () => addTransaction(...args),
        arriveDepart: () => handleAddArriveDepart(...args),
        notesViewer: () => (state.transactionIndex != null)  ? editVisit(...args) : addTransactionToPastVisit(...args),
        playerInfo: () => handleEditPoiNotesDescription(...args),
        // other mappings...
    };

    const submitFunction = submits[name];
    return submitFunction ? submitFunction() : null;
};

export const handleStateUpdate = (value, formType, setState)=>{

    setState((prevState) => ({
        ...prevState,
        [formType]: value,
    }));
  }

export const handleIsNewChange = (e, setState, setParentState) => {
    const newUUID = uuidv4();
    console.log(newUUID)
    setState((prevState) => ({
      ...prevState,
      isNew: !prevState.isNew,
      selectedPoi:{casinos:[]},
      poiId:newUUID,
    }));
    setParentState((prevState) => ({
      ...prevState,
      isNew: !prevState.isNew,
    }));
  };

export const handleSelectPoi = (e, state, setState, poi, poiList) => {
    const isNew = state.isNew;
    const selectedLocations = state.selectedLocations;
    const enteredPoi = e.value;
    const selectedPoi =  poiList.find((poi) => poi.name === enteredPoi);


    if (isNew) {
      const newPoi = {
        ...poi,
        active: true,
        name: e.target.value,
        arrival: state.selectedDateTime,
        casinos: selectedLocations? selectedLocations : [],
      }
      setState((prevState) => ({
        ...prevState,
        selectedPoi: newPoi,
      }));
      return
    }

    // console.log('Matched POI from list:', selectedPoi);

    const newPoi = {
        ...selectedPoi,
        arrival: state.selectedDateTime
    }

    if (newPoi) {
      setState((prevState) => ({
        ...prevState,
        poiId: newPoi.id,
        selectedPoi: newPoi,
        poiDescription: newPoi.description? newPoi.description : '',
        poiNotes: newPoi.notes? newPoi.notes : '',
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        selectedPoi: newPoi, // This line seems odd, since selectedPoi is undefined if this block runs.
      }));
    }
};

export const handleTransactionRemove = ( index, current_transactions, currentPoiList, setCurrentPoiList, state, setState ) =>{
    const updatedTransactions = [...current_transactions]
    const updatedCurrentPoiList = [...currentPoiList]
    const { user } = state;
    
    const poi = updatedCurrentPoiList[state.index]
    poi.transactions = updatedTransactions

    const logEntry = {
        id: poi.id,
        user: user.email,
        visitId: poi.visitId,
        timestamp: getAdjustedDateTime(),
        type: 'Transaction Remove',
        date:updatedTransactions[index].date,
        amount:updatedTransactions[index].amount,
        transactionType:updatedTransactions[index].type,
        note:updatedTransactions[index].note
    } 

    updatedTransactions.splice(index,1)


    updateCollection('log',logEntry)
    setCurrentPoiList(updatedCurrentPoiList)
    handleStateUpdate(poi, 'updatedPoi', setState)
    updateCurrentPoiList( state.selectedCasino, updatedCurrentPoiList)
}

export const handlePoiRemove = (index, state, currentPoiList, setCurrentPoiList, selectedCasino) => {
    const {user}  = state
    const list = [...currentPoiList];
    const removedPoi = list[index]

    const { id,visitId, arrival  } = removedPoi

    const logEntry = {
        id: id,
        user: user.email,
        visitId: visitId,
        timestamp: getAdjustedDateTime(),
        arrival: arrival,
        casino: selectedCasino,
        type: 'Player Remove',
    } 

    updateCollection('log',logEntry)


    list.splice(index, 1);
    setCurrentPoiList(list);
    updateCurrentPoiList(selectedCasino,list)
    sessionStorage.setItem('currentPoiList', JSON.stringify(list));
  };

export const handleLocationChange = (selectedLocations, setState, poi) => {
    const newPoi = {
      ...poi,
      casinos: selectedLocations? selectedLocations : [],
    }
    setState((prevState) => ({
      ...prevState,
      selectedLocations,
      selectedPoi:newPoi,
    }));
  }; 

export const handleAddDescription = ( description, setState, poi ) => {
    const newPoi = {
      ...poi,
      description: description? description : '',
    }
    setState((prevState) => ({
      ...prevState,
      selectedPoi:newPoi,
    }));
  }; 

export const handleAddNotes = ( notes, setState, poi ) => {
    const newPoi = {
      ...poi,
      notes: notes? notes : '',
    }
    setState((prevState) => ({
      ...prevState,
      selectedPoi:newPoi,
    }));
  }; 

export const testAddPoi = (state, currentPoiList, setCurrentPoiList, selectedCasino, modalClose) => {
    console.log(state)
    console.log('state.poi')
    console.log(state.poi)
    console.log(currentPoiList)
}
export const addPoi = (state, setState, currentPoiList, setCurrentPoiList, selectedCasino, modalClose) => {

    const { 
            poi = state.poi,
            arrival = state.poi.arrival,
            id = state.poi.id,
            casinos = state.poi.casinos || [] ,
            isNew = state.isNew,
            poiList,
            user
        } = state

    if (!poi || !poi.name ) {
        window.alert("Please select or enter a POI name.");
        return;
    }
    const selectedPoi = poiList.find(
        (item) => item.name.toLowerCase() === poi.name.toLowerCase()
    );
    // console.log("selected:");
    // console.log(selectedPoi);
    if (selectedPoi && isNew) {
      const casinosList = selectedPoi.casinos.join('\n');
      window.alert(`Name Unavailable\n${selectedPoi.name} is already listed at the following casinos:\n${casinosList}`);
      return;
    }
    const poiLowerCase = poi.name.toLowerCase();
  
    // Check if the POI name already exists (case-insensitive)
    const isDuplicate = currentPoiList.some(
      (item) => item.name.toLowerCase() === poiLowerCase
    );
  
    if (isDuplicate) {
      console.log('Duplicate POI name!');
      window.alert(`Name:\n${poi.name} is already active`);
      // Handle duplicate case here (e.g., show error message)
      return;
    }
    const newUUID = uuidv4();

    const newList = [
        ...currentPoiList,
        { 
            name: poi.name, 
            visitId: newUUID,
            arrival: arrival || 'default date/time',
            description: poi.description || '', 
            casinos: casinos.length ? casinos : [selectedCasino],
            visits: poi.visits || [],
            id: id || 'default-id',
        },
    ];
  
    const newPoi = {
      id: poi.id,
      name: poi.name,
      arrival: arrival,
      casinos: casinos.length ? casinos : [selectedCasino],
      description: poi.description ? poi.description : '',
      notes: poi.notes ? poi.notes : '',
      visits:[],
      active: true,
    };


    const logEntry = {
        id: poi.id,
        user: user.email,
        visitId: newUUID,
        timestamp: getAdjustedDateTime(),
        arrival: arrival,
        casino: selectedCasino,
        type: 'Player Add',
    } 

    updateCollection('log',logEntry)

    const newPoiList = [
      ...currentPoiList,
      newPoi
    ];
   
    setCurrentPoiList(newList);
    updateCurrentPoiList(selectedCasino,newList)
    sessionStorage.setItem('currentPoiList', JSON.stringify(newList));
  
  
    // isNew
    //   ? (() => {
    //         console.log('Is New')
    //       updateCollection('poi', newPoi,id);
    //     })()
    //   : console.log('Not New');
  
    modalClose( setState);
  };


export const addTransaction = (state, setState, currentPoiList, setCurrentPoiList, selectedCasino, transactionIndex, modalClose) => {
    const { transactionDetails, index, user } = state
    const {type, amount, game, note, date} = transactionDetails
    console.log('user',user)

    const newArray = [...currentPoiList];
    const ogPoi = currentPoiList[index] ;
    // console.log('ogPoi')
    // console.log(ogPoi)
    // const ogTransaction =  {}
    const ogTransaction = ogPoi.transactions ? ogPoi.transactions[transactionIndex] : {}
    // console.log('ogTransaction')
    // console.log(ogTransaction)
    
    if (type === 'Buy In' && amount === 0){
    console.log('no Transaction')
      return
    }
    const poi = newArray[index] ;
    const { id, visitId } = poi

    if (transactionIndex === null) {
        // Update transactions
        if (poi.transactions) {
            poi.transactions.push(transactionDetails);
        } else {
            poi.transactions = [transactionDetails];
        }
        
        const logEntry = {
            id: id,
            user: user.email,
            visitId: visitId,
            timestamp: getAdjustedDateTime(),
            type: type,
            amount: amount,
            game: game,
            note: note, 
            date: date,
        } 

        updateCollection('log',logEntry)
        
        
    
        setCurrentPoiList(newArray);
        updateCurrentPoiList(selectedCasino,newArray)
        sessionStorage.setItem('currentPoiList', JSON.stringify(newArray));
        modalClose( setState )
    } else {
        const newTransactions = [...poi.transactions]
        newTransactions[transactionIndex] = transactionDetails
        newArray[index].transactions = newTransactions

        // console.log(newArray)

        const logEntry = {
            id: id,
            user: user?.email,
            visitId: visitId,
            timestamp: getAdjustedDateTime(),
            type: 'Transaction Edit',
            oldAmount: ogTransaction.amount || '',
            oldGame: ogTransaction.game || '',
            oldNote: ogTransaction.note || '', 
            oldDate: ogTransaction.date || '',
            oldType: ogTransaction.type || '',
            newType: type,
            amount: amount,
            game: game,
            note: note, 
            date: date,
        } 

        setCurrentPoiList(newArray);
        updateCurrentPoiList(selectedCasino,newArray)
        sessionStorage.setItem('currentPoiList', JSON.stringify(newArray));

        updateCollection('log',logEntry)
        handleStateUpdate(null,'transactionIndex', setState)
    }
  };

export const calculatedTotal = (poi) => {
    if (poi.transactions) {
      poi.transactions.forEach(transaction => {
        console.log(transaction);
      });
    }
  };

export  const handleBQUpload = async (poi, state, getAdjustedDateTime, sendDataToBigQuery) => {
    const { user, selectedCasino } = state

    const totalBuyIn = poi.transactions
      .filter(transaction => transaction.type === "Buy In")
      .reduce((total, transaction) => total + transaction.amount, 0);

    const totalCashOut = poi.transactions
      .filter(transaction => transaction.type === "Cash Out")
      .reduce((total, transaction) => total + transaction.amount, 0);

    const notes = poi.transactions
      .filter(transaction => transaction.note.trim() !== "")
      
      (transaction => `${transaction.date}: ${transaction.note}`)
      .join('\n');

    const test = 
      {
        email:user.email,
        timestamp: getAdjustedDateTime(),
        id: poi.id,
        name: poi.name,
        casino: selectedCasino,
        arrival: poi.arrival,
        depart: poi.departure,
        buy_in: totalBuyIn,
        cash_out: totalCashOut,
        result: totalCashOut-totalBuyIn,
        notes: notes,
      }
    await sendDataToBigQuery(test, 'alpha')
  }



export const handleAddArriveDepart = async (state, setState, currentPoiList, setCurrentPoiList, selectedCasino, modalClose) => {

        const { 
                poi = state.selectedPoi,
                arrival = state.selectedPoi.arrival,
                transactions = state.selectedPoi.transactions,
                id = state.selectedPoi.id,
                visitId = state.selectedPoi.visitId,
                casinos = state.selectedPoi.casinos || [] ,
                isNew = state.isNew,
                poiList, 
                index,
                user,
                updatedArrival,
                updatedDeparture,
            } = state

        const updatedPoiList = [...currentPoiList];

        // console.log(updatedArrival)
        // console.log(updatedPoiList[index].arrival)

        if (updatedPoiList[index].arrival !== updatedArrival){
            const newLogEntry = {
                            id: id,
                            user: user.email,
                            visitId: visitId,
                            timestamp: getAdjustedDateTime(),
                            originalArrival: currentPoiList[index].arrival,
                            updatedArrival: updatedArrival,
                            type: 'Arrival Edit',
                
                        } 
            updatedPoiList[index].arrival = updatedArrival
            updateCollection('log',newLogEntry)
            
            setCurrentPoiList(updatedPoiList);
            updateCurrentPoiList(selectedCasino,updatedPoiList)
            sessionStorage.setItem("currentPoiList", JSON.stringify(updatedPoiList));
        }
        
        
        
        
        if (updatedDeparture) {
            console.log('updatedDeparture')
            if (selectedCasino === 'Select A Casino'){
                window.alert('Please select a casino')
                modalClose( setState )
                return
            }
            //     setCurrentPoiList(updatedPoiList);
            //     updateCurrentPoiList(selectedCasino,updatedPoiList)
            //     sessionStorage.setItem("currentPoiList", JSON.stringify(updatedPoiList));

            const updatedPoi = updatedPoiList[index]

            updatedPoi.departure = updatedDeparture
            
            // handleBQUpload(updatedPoi, state, getAdjustedDateTime, sendDataToBigQuery);
            const collectionName = "poi";
            const collectionRef = collection(db, collectionName);
            const docRef = doc(collectionRef, updatedPoi.id);
    
            try {
                await updateDoc(docRef, {
                            visits: arrayUnion({
                                id: uuidv4(),
                                user: user.email,
                                casino:selectedCasino,
                                arrival: updatedArrival,
                                departure: updatedDeparture,
                                transactions: transactions,
                                }),
                            });

                const logEntry = {
                        id: id,
                        user: user.email,
                        visitId: visitId,
                        timestamp: getAdjustedDateTime(),
                        departure: updatedDeparture,
                        type: 'Player Departure',
            
                    } 
        
                updateCollection('log',logEntry)
                fetchDataVals(setState, selectedCasino, setCurrentPoiList)
                handlePoiRemove(index,state, currentPoiList, setCurrentPoiList, selectedCasino)
                console.log("Collection updated successfully!");
                } catch (error) {
                    console.error("Error updating collection:", error);
                }
            }
            
            // console.log('new updatedPoiList')
            // console.log(updatedPoiList)
            modalClose( setState )
        };

export const editVisit = async ( state, setState, currentPoiList, setCurrentPoiList ) =>{
    const { editedVisit, selectedPoi, selectedCasino, user } = state;
    // console.log('editedVisit',editedVisit)

    const originalVisit = selectedPoi.visits.find(visit=> visit.id === editedVisit.id)
    
    // Map through the visits array to find the matching visit and replace it
    const updatedVisits = selectedPoi.visits.map(visit => {
        if (visit.id === editedVisit.id) {
            // Return the edited visit instead of the original
            editedVisit.transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
            return editedVisit;
        }
        // Return the original visit if not the one being edited
        return visit;
    });

    // Now, you need to update the selectedPoi object with the updated visits array
    const updatedSelectedPoi = {
        ...selectedPoi,
        visits: updatedVisits
    };
    // console.log('updatedSelectedPoi',updatedSelectedPoi)
    // Next, update the entire currentPoiList with this updated selectedPoi
    const updatedCurrentPoiList = currentPoiList.map(poi => {
        if (poi.id === updatedSelectedPoi.id) {
            return updatedSelectedPoi;
        }
        return poi;
    });

    const collectionName = "poi";
    const collectionRef = collection(db, collectionName);
    const docRef = doc(collectionRef, updatedSelectedPoi.id);

    try {
        await updateDoc(docRef, {
                    visits: updatedVisits,
                    });
        // console.log("updatedVisits",updatedVisits);

        const logEntry = {
                id: updatedSelectedPoi.id,
                user: user.email,
                visitId: editedVisit.id,
                timestamp: getAdjustedDateTime(),
                type: 'Visit Edit',
                originalVisit:originalVisit,
                updatedVisit:editedVisit,
            } 

        updateCollection('log',logEntry)
        // fetchDataVals(setState, selectedCasino, setCurrentPoiList)
        // Finally, update the state with the new list of POIs
        setCurrentPoiList(updatedCurrentPoiList);
        updateCurrentPoiList(selectedCasino,updatedCurrentPoiList)
        // handleStateUpdate(false, 'notesEditMode', setState)

        handleStateUpdate(false, 'notesEditMode', setState)
        handleStateUpdate(null, 'transactionIndex', setState)

        console.log("currentPoiList updated successfully!");
        } catch (error) {
            console.error("Error updating collection:", error);
        }


    // Logging to check the new state of selectedPoi
    // console.log(originalVisit);
}

export const removePastVisitTransaction = async ( index, state, setState, currentPoiList, setCurrentPoiList ) => {
    const { editedVisit, selectedVisit, selectedPoi, selectedCasino, user } = state;

    // console.log('selectedVisit transaction', selectedVisit.transactions[index])
    const updatedVisit = {...selectedVisit}
    const removedTransaction = selectedVisit.transactions[index]
    updatedVisit.transactions.splice(index,1)

    // console.log('updatedVisit', updatedVisit)
    // console.log('removedTransaction', removedTransaction)
    
    // Map through the visits array to find the matching visit and replace it
    const updatedVisits = selectedPoi.visits.map(visit => {
        if (visit.id === updatedVisit.id) {
            // Destructure to separate 'value', 'label', and the rest of the object
            const { value, label, ...restOfObject } = updatedVisit;

            // Construct a new object without 'label', renaming 'value' to 'arrival'
            const formatedVisit = {
                arrival: value,
                ...restOfObject
            };
            // Return the edited visit instead of the original
            return formatedVisit;
        }
        // Return the original visit if not the one being edited
        return visit;
    });
    // console.log('updatedVisits', updatedVisits)

     // Now, you need to update the selectedPoi object with the updated visits array
     const updatedSelectedPoi = {
        ...selectedPoi,
        visits: updatedVisits
    };
    // console.log('updatedSelectedPoi',updatedSelectedPoi)
    // Next, update the entire currentPoiList with this updated selectedPoi
    const updatedCurrentPoiList = currentPoiList.map(poi => {
        if (poi.id === updatedSelectedPoi.id) {
            return updatedSelectedPoi;
        }
        return poi;
    });

    const collectionName = "poi";
    const collectionRef = collection(db, collectionName);
    const docRef = doc(collectionRef, selectedPoi.id);
    
    try {
        await updateDoc(docRef, {
                    visits: updatedVisits,
                    });
        // console.log("updatedVisits",updatedVisits);

        const logEntry = {
                id: updatedSelectedPoi.id,
                user: user.email,
                visitId: updatedVisit.id,
                timestamp: getAdjustedDateTime(),
                type: 'Transaction Remove',
                date:removedTransaction.date,
                amount:removedTransaction.amount,
                transactionType:removedTransaction.type,
                note:removedTransaction.note
            } 

        updateCollection('log',logEntry)

        setCurrentPoiList(updatedCurrentPoiList);
        updateCurrentPoiList(selectedCasino,updatedCurrentPoiList)

        // handleStateUpdate(false, 'notesEditMode', setState)
        // handleStateUpdate(null, 'transactionIndex', setState)

        console.log("currentPoiList updated successfully!");
        } catch (error) {
            console.error("Error updating collection:", error);
        }
} 

export const removePastVisit = async (state, setState, currentPoiList, setCurrentPoiList, handleVisitSelect, setOptions) => {
    const { selectedVisit, selectedPoi, selectedCasino, user } = state;

    const { value, label, ...restOfObject } = selectedVisit;

    // Construct a new object without 'label', renaming 'value' to 'arrival'
    const formattedVisit = {
        arrival: value,
        ...restOfObject
    };

    // Filter the visits array to exclude the matching visit
    const updatedVisits = selectedPoi.visits.filter(visit => visit.id !== formattedVisit.id);

    // Now, update the selectedPoi object with the updated visits array
    const updatedSelectedPoi = {
        ...selectedPoi,
        visits: updatedVisits
    };

    // Update the entire currentPoiList with this updated selectedPoi
    const updatedCurrentPoiList = currentPoiList.map(poi => {
        if (poi.id === updatedSelectedPoi.id) {
            return updatedSelectedPoi;
        }
        return poi;
    });

    const collectionName = "poi";
    const collectionRef = collection(db, collectionName);
    const docRef = doc(collectionRef, selectedPoi.id);
    
    try {
        await updateDoc(docRef, {
            visits: updatedVisits,
        });
        // console.log("Visits updated successfully:", updatedVisits);

        const logEntry = {
            id: updatedSelectedPoi.id,
            user: user.email,
            visitId: formattedVisit.id,
            timestamp: getAdjustedDateTime(),
            type: 'Visit Remove',
            visit: formattedVisit,
        };

        setOptions(updatedVisits.map(visit => ({
            value: visit.arrival,
            label: visit.arrival ? dateTimeTransformer(visit.arrival) : '',
            departure: visit.departure
            })))

        handleVisitSelect(updatedVisits[0].arrival)
        updateCollection('log', logEntry);
        setCurrentPoiList(updatedCurrentPoiList);
        updateCurrentPoiList(selectedCasino, updatedCurrentPoiList);
        console.log("currentPoiList updated successfully!");
    } catch (error) {
        console.error("Error updating collection:", error);
    }
}


export const addTransactionToPastVisit = async ( state, setState, currentPoiList, setCurrentPoiList, modalClose) => {
    const { selectedVisit, selectedPoi, selectedCasino, user, transactionToAddToPastVisit } = state;

    const updatedVisit = {...selectedVisit}
    updatedVisit.transactions.push(transactionToAddToPastVisit)
    updatedVisit.transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
    const { type, date, amount, game, note } = transactionToAddToPastVisit


    const updatedVisits = selectedPoi.visits.map(visit => {
        if (visit.id === updatedVisit.id) {
            // Destructure to separate 'value', 'label', and the rest of the object
            const { value, label, ...restOfObject } = updatedVisit;

            // Construct a new object without 'label', renaming 'value' to 'arrival'
            const formatedVisit = {
                arrival: value,
                ...restOfObject
            };
            // Return the edited visit instead of the original
            return formatedVisit;
        }
        // Return the original visit if not the one being edited
        return visit;
    });
    // console.log('updatedVisits', updatedVisits)

     // Now, you need to update the selectedPoi object with the updated visits array
     const updatedSelectedPoi = {
        ...selectedPoi,
        visits: updatedVisits
    };
    // console.log('updatedSelectedPoi',updatedSelectedPoi)
    // Next, update the entire currentPoiList with this updated selectedPoi
    const updatedCurrentPoiList = currentPoiList.map(poi => {
        if (poi.id === updatedSelectedPoi.id) {
            return updatedSelectedPoi;
        }
        return poi;
    });

    const collectionName = "poi";
    const collectionRef = collection(db, collectionName);
    const docRef = doc(collectionRef, updatedSelectedPoi.id);

    try {
        await updateDoc(docRef, {
                    visits: updatedVisits,
                    });
        // console.log("updatedVisits",updatedVisits);

        const logEntry = {
                id: updatedSelectedPoi.id,
                user: user.email,
                visitId: updatedVisit.id,
                timestamp: getAdjustedDateTime(),
                type: type,
                amount: amount,
                game: game,
                note: note, 
                date: date,
            } 

        updateCollection('log',logEntry)
        // fetchDataVals(setState, selectedCasino, setCurrentPoiList)
        // Finally, update the state with the new list of POIs
        setCurrentPoiList(updatedCurrentPoiList);
        updateCurrentPoiList(selectedCasino,updatedCurrentPoiList)
        // handleStateUpdate(false, 'notesEditMode', setState)

        handleStateUpdate(false, 'notesEditMode', setState)
        handleStateUpdate(null, 'transactionIndex', setState)

        console.log("currentPoiList updated successfully!");
        } catch (error) {
            console.error("Error updating collection:", error);
        }
}

export const getWeekStartEnd = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay()); // Set to Sunday
    start.setHours(0, 0, 0, 0); // Start of the day
  
    const end = new Date(start);
    end.setDate(end.getDate() + 6); // Set to Saturday
    end.setHours(23, 59, 59, 999); // End of the day
  
    return { start, end };
  };
  
export const getMonthStartEnd = (date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1); // First day of the month
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999); // Last day of the month
  
    return { start, end };
  };
  
export const logoutUser = () => {
    // Clear user token/session storage
    sessionStorage.clear();
    // Redirect to login page or show login modal
    window.location.href = '/login';
};

export const handleEditPoiNotesDescription = async (state, setState, currentPoiList, setCurrentPoiList, selectedCasino, modalClose) => {
    const { selectedPoi } = state
    console.log("ho")
    const updatedCurrentPoiList = currentPoiList.map(poi => {
        if (poi.id === selectedPoi.id) {
            const newPoi = {
                ...poi,
                description:selectedPoi.description,
                notes:selectedPoi.notes,
            }
            return newPoi;
        }
        return poi;
    });
    updateCurrentPoiList(selectedCasino,updatedCurrentPoiList)

    try {
        const poiRef = doc(db, 'poi', selectedPoi.id);
        await updateDoc(poiRef, { description: selectedPoi.description, notes: selectedPoi.notes });

        updateCurrentPoiList( state.selectedCasino, updatedCurrentPoiList)
        console.log('Document updated successfully!');
        fetchDataVals(setState, selectedCasino, setCurrentPoiList);
      } catch (error) {
        console.error('Error updating document:', error);
      }
    

}

export const copyToClipboard = async (htmlTable) => {
    if (navigator.clipboard) {
        // Newer API
        try {
            await navigator.clipboard.writeText(htmlTable);
            alert('Data copied to clipboard using Clipboard API!');
        } catch (err) {
            console.error('Failed to copy with Clipboard API: ', err);
        }
    } else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.textContent = htmlTable;
        textarea.style.position = 'fixed';  // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');  // Security exception may be thrown by some browsers.
            alert('Data copied to clipboard using execCommand!');
        } catch (ex) {
            console.warn('Copy to clipboard failed.', ex);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
};
export const convertDataToHtmlTable = (data) => {
    let html = "<table style='border-collapse: collapse; width: 100%;'><thead><tr>";
    // Add headers
    Object.keys(data[0]).forEach(header => {
        html += `<th style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>${header}</th>`;
    });
    html += "</tr></thead><tbody>";

    // Add rows
    data.forEach(row => {
        html += "<tr>";
        Object.values(row).forEach(cell => {
            html += `<td style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>${cell}</td>`;
        });
        html += "</tr>";
    });
    html += "</tbody></table>";
    return html;
};
