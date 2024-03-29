import { NewPlayerAddModal } from "./modals/NewPlayerAddModal";
import { NewPlayerTransactionModal } from "./modals/NewPlayerTransactionModal";
import { NewPlayerArriveDepartModal } from "./modals/NewPlayerArriveDepartModal";
import { NewPlayerNotesModal } from "./modals/NewPlayerNotesModal";
import { v4 as uuidv4 } from 'uuid';





import { PoiCard } from './poiCard';
import { useState, useEffect } from "react";
import { updateDoc , getDocs, collection, doc, arrayUnion} from 'firebase/firestore'
import {db, updateCollection,getCurrentPois, updateCurrentPoiList, getDataVals, getPoiData, sendDataToFirebase} from '../config/firebase'
import SingleSelect from '../components/singleSelect'
import { AiOutlinePlusCircle  } from 'react-icons/ai'

const PoiTracker = ({user}) => {
  const [openPlayerAddModal,setOpenPlayerAddModal] = useState(false)
  const [openPlayerTransactionModal,setOpenPlayerTransactionModal] = useState(false)
  const [openPlayerArriveDepartModal,setOpenPlayerArriveDepartModal] = useState(false)
  const [openPlayerNotesModal,setOpenPlayerNotesModal] = useState(false)


  const [poiList, setPoiList] = useState([])
  const [poiIndex, setPoiIndex] = useState('')
  const [poi, setPoi] = useState([]);
  const [ogPoi, setOgPoi] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState([])
  const [currentPoiList, setCurrentPoiList] = useState(() => {
    const savedPoiList = sessionStorage.getItem('currentPoiList');
    // return []
    return savedPoiList ? JSON.parse(savedPoiList) : [];
  });
  const [dataValsList, setDataValsList] = useState({ casinos: [] })
  const [selectedCasino, setSelectedCasino] = useState(() => {
    const savedCasino = sessionStorage.getItem('currentCasino');
    const defaultCasino = user.location? user.location : 'Select A Casino'
    return savedCasino ? JSON.parse(savedCasino) : defaultCasino;
  }); // Initialize as an empty array
  const options = [ 
                 ...dataValsList.casinos.map((casino) => {
                    return { value: casino, label: casino };
                 })];

  const handleCasinoChange = (selectedOption) => {
  setSelectedCasino(selectedOption.value);
  sessionStorage.setItem("currentCasino", JSON.stringify(selectedOption.value));
  };

const refetchDataVals = async () => {
  const data = await getDataVals();
  const data2 = await getPoiData();
  setDataValsList(data);
  setPoiList(data2);
};

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';


useEffect(() => {
  if (user && user.location) {
    setSelectedCasino(prevCasino => {
      // Only update if the previous value is 'Select A Casino'
      return user.location !== "Corp - Knighted Ventures" && prevCasino === 'Select A Casino' ? user.location : prevCasino;
    });
  }
}, [user.location]);
  
useEffect(() => {
  console.log('user')
  console.log(user)
  const fetchDataVals = async () => {
    const data = await getDataVals();
    const data2 = await getPoiData();
    setDataValsList(data);
    setPoiList(data2);

    // Update currentPoiList with new visits from poiList and add new visit if transactions are present
    const updatedCurrentPoiList = currentPoiList.map(currentPoi => {
      const matchingPoi = data2.find(poi => poi.id === currentPoi.id);

      // 1. If there's a matching POI from data2, use its visits, else use the currentPoi's visits.
      let visits = matchingPoi ? [...matchingPoi.visits] : [...currentPoi.visits];
      
      // 2. If transactions are present, add the new visit.
      if (currentPoi.transactions && currentPoi.transactions.length > 0) {
        const newVisit = {
          arrival: currentPoi.arrival,
          casino: selectedCasino,
          transactions: currentPoi.transactions
        };
        visits.push(newVisit);
      }

      return { ...currentPoi, visits: visits };
    });

    setCurrentPoiList(updatedCurrentPoiList);
    sessionStorage.setItem('currentPoiList', JSON.stringify(updatedCurrentPoiList));
  };

  fetchDataVals();
  }, []);




  const handleAddPoi = (poi, arrival, id, casinos, isNew) => {
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
  
    const newList = [
      ...currentPoiList,
      { 
        name: poi.name, 
        arrival: arrival,
        description: poi.description, 
        casinos: casinos.length ? casinos : selectedCasino,
        visits: poi.visits,
        id: id },
    ];
  
    setCurrentPoiList(newList);
    sessionStorage.setItem('currentPoiList', JSON.stringify(newList));
  
    const newPoi = {
      name: poi.name,
      casinos: casinos.length ? casinos : [selectedCasino],
      description: poi.description ? poi.description : '',
      notes: poi.note ? poi.note : '',
      visits:[],
      active: true,
    };
  
    isNew
      ? (() => {
          updateCollection('poi', newPoi,id);
        })()
      : console.log('Not New');
  
    setOpenPlayerAddModal(false);
  };
  
  const handleOpenPlayerAddModal = () => {
    console.log('click')
    setOpenPlayerAddModal(true);
  };

  const handlePoiRemove = (index) => {
    const list = [...currentPoiList];
    list.splice(index, 1);
    setCurrentPoiList(list);
    sessionStorage.setItem('currentPoiList', JSON.stringify(list));
  };

  const handleAddPoiTransaction = (amount, date, type, note, index) => {
    const transactionDetails = { amount: amount, date: date, type: type, note: note };
    const newArray = [...currentPoiList];
    console.log('type')
    console.log(type)
    
    if (type === 'Buy In' && amount === 0){
      return
    }
    
    // Update transactions
    if (newArray[index].transactions) {
      newArray[index].transactions.push(transactionDetails);
    } else {
      newArray[index].transactions = [transactionDetails];
    }
  
    // Create new visit
    const newVisit = {
      arrival: newArray[index].arrival,
      casino: newArray[index].casino,
      transactions: newArray[index].transactions,
    }
  
    // Update visits
    if (newArray[index] && Array.isArray(newArray[index].visits) && newArray[index].visits.length > 0) {
      const lastVisit = newArray[index].visits[newArray[index].visits.length - 1];
      if (lastVisit && lastVisit.departure) {
        newArray[index].visits.push(newVisit);
      } else if (lastVisit) {
        lastVisit.transactions = newArray[index].transactions;
      }
    } else {
      newArray[index].visits = [newVisit];
    }
    
  
    setCurrentPoiList(newArray);
    sessionStorage.setItem('currentPoiList', JSON.stringify(newArray));
    setOpenPlayerTransactionModal(false)
  };
  
  

  const handleTransactionOpen = (index)=>{
    setPoiIndex(index)
    setOpenPlayerTransactionModal(true)
  }

  const handleArriveDepart = (index)=>{
    setPoi(currentPoiList[index])
    setPoiIndex(index)
    setOpenPlayerArriveDepartModal(true)
  }

  const handleAddArriveDepart = async (newPoi, newIndex) => {
    const updatedPoiList = [...currentPoiList];
    updatedPoiList[newIndex] = newPoi;
  
    setCurrentPoiList(updatedPoiList);
    sessionStorage.setItem("currentPoiList", JSON.stringify(updatedPoiList));
    setOpenPlayerArriveDepartModal(false);
  
    if (newPoi.departure) {
      if (selectedCasino === 'Select A Casino'){
          window.alert('Please select a casino')
          setOpenPlayerTransactionModal(false)
          return
        }
      handleBQUpload(newPoi);
      const collectionName = "poi";
      const collectionRef = collection(db, collectionName);
      const docRef = doc(collectionRef, newPoi.id);
  
      try {
        await updateDoc(docRef, {
          visits: arrayUnion({
            id: uuidv4(),
            user: user.email,
            casino:selectedCasino,
            arrival: newPoi.arrival,
            departure: newPoi.departure,
            transactions: newPoi.transactions,
          }),
        });
        refetchDataVals()
        handlePoiRemove(newIndex)
        console.log("Collection updated successfully!");
      } catch (error) {
        console.error("Error updating collection:", error);
      }
    }
  };


  const handleNotesOpen = (index)=>{
    setPoi(currentPoiList[index])
    setOgPoi(currentPoiList[index])
    setOpenPlayerNotesModal(true)
  }

  const handleBQUpload = async (poi) => {
    const currentDate = new Date();
    const timezoneOffsetInMinutes = currentDate.getTimezoneOffset();
    const adjustedDate = new Date(currentDate.getTime() - timezoneOffsetInMinutes * 60000);

    const adjustedDateTime = adjustedDate.toISOString().slice(0, 16);


    const totalBuyIn = poi.transactions
      .filter(transaction => transaction.type === "Buy In")
      .reduce((total, transaction) => total + transaction.amount, 0);

    const totalCashOut = poi.transactions
      .filter(transaction => transaction.type === "Cash Out")
      .reduce((total, transaction) => total + transaction.amount, 0);

    const notes = poi.transactions
      .filter(transaction => transaction.note.trim() !== "")
      .map(transaction => `${transaction.date}: ${transaction.note}`)
      .join('\n');

    const test = 
      {
        email:user.email,
        timestamp: adjustedDateTime,
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
    await sendDataToFirebase(test, 'alpha')
  }

  return (
    <>
      <div className='flex justify-center mt-10 items-center'>
      <SingleSelect
          className="max-w-xs min-w-4 snap-center"
          onChange={handleCasinoChange}
          value={selectedCasino ? { label: selectedCasino, value: selectedCasino } : null}
          options={options}
          placeholder='Select a casino'
        />
      </div>
      {isLocalhost && <div className='flex justify-center mt-10'>
            <button className='btn' onClick={()=>updateCurrentPoiList(selectedCasino,currentPoiList)}>test current_pois</button>
            <button className='btn' onClick={()=>console.log(currentPoiList)}>current poiList</button>
            <button className='btn' onClick={()=>console.log(getCurrentPois())}>current poiLits from FireBase</button>
            <button className='btn' onClick={()=>{
                                  setSelectedCasino('')
                                  sessionStorage.setItem("currentCasino", JSON.stringify(''))
            }}>reset selectedCasino poiList</button>
      </div>}

      {poiList.length !== 0 && currentPoiList.length === 0  && (
                    <div className='flex justify-center mt-10'>
                      <button
                        type="button"
                        className="btn-sm bg-dark-leather"
                        onClick={handleOpenPlayerAddModal}
                        >
                        <AiOutlinePlusCircle className="inner-icon" />
                      </button>
                    </div>
                  )}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-10 justify-center mt-10'>
          {
            currentPoiList && currentPoiList.map((singlePoi, index) => (
              <PoiCard key={index} poi={singlePoi} handlePoiRemove={handlePoiRemove} index={index} openPlayerAddModal={handleOpenPlayerAddModal} openPlayerTransactionModal={handleTransactionOpen} openPlayerArriveDepartModal={handleArriveDepart} openPlayerNotesModal={handleNotesOpen} />
            ))
          }
      </div>

      {openPlayerAddModal && <NewPlayerAddModal setShowModal={setOpenPlayerAddModal} poiInfo={poiList} addPoi={handleAddPoi} casinos={dataValsList.casinos} selectedCasino={selectedCasino} />}
      {openPlayerTransactionModal && <NewPlayerTransactionModal setShowModal={setOpenPlayerTransactionModal} index={poiIndex} addTransaction={handleAddPoiTransaction} games={dataValsList.games} />}
      {openPlayerArriveDepartModal && <NewPlayerArriveDepartModal setShowModal={setOpenPlayerArriveDepartModal} index={poiIndex} poi={poi} addPoi={handleAddArriveDepart}  poiList={poiList} />}
      {openPlayerNotesModal && <NewPlayerNotesModal setShowModal={setOpenPlayerNotesModal} setSelectedVisit={setSelectedVisit} poi={poi} currentPoiList={currentPoiList} ogPoi={ogPoi} games={dataValsList.games} setCurrentPoiList={setCurrentPoiList} user={user}/>}
    </>
  )
}

export default PoiTracker