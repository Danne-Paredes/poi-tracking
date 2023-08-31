import PlayerAddModal from "./modals/playerAddModal";
import { NewPlayerAddModal } from "./modals/NewPlayerAddModal";
import { NewPlayerTransactionModal } from "./modals/NewplayerTransactionModal";


import { PoiCard } from './poiCard';
import { useState, useEffect } from "react";
import { updateDoc , getDocs, collection, doc, arrayUnion} from 'firebase/firestore'
import {db, updateCollection, getDataVals, getPoiData} from '../config/firebase'
import SingleSelect from '../components/singleSelect'
import { AiOutlinePlusCircle  } from 'react-icons/ai'

const PoiTracker = () => {
  const [openPlayerAddModal,setOpenPlayerAddModal] = useState(false)
  const [openPlayerTransactionModal,setOpenPlayerTransactionModal] = useState(false)
  const [poiList, setPoiList] = useState([])
  const [poiIndex, setPoiIndex] = useState('')
  const [currentPoiList, setCurrentPoiList] = useState(() => {
    const savedPoiList = sessionStorage.getItem('currentPoiList');
    return savedPoiList ? JSON.parse(savedPoiList) : [];
  });
  const [dataValsList, setDataValsList] = useState({ casinos: [] })
  const [selectedCasino, setSelectedCasino] = useState(() => {
    const savedCasino = sessionStorage.getItem('currentCasino');
    return savedCasino ? JSON.parse(savedCasino) : [];
  }); // Initialize as an empty array
  const options = [ 
                 ...dataValsList.casinos.map((casino) => {
                    return { value: casino, label: casino };
                 })];

  const handleCasinoChange = (selectedOption) => {
  setSelectedCasino(selectedOption.value);
  sessionStorage.setItem("currentCasino", JSON.stringify(selectedOption.value));
};
  
  useEffect(() => {
    const fetchDataVals = async () => {
      const data = await getDataVals();
      const data2 = await getPoiData();
      setDataValsList(data);
      setPoiList(data2);
    };
    fetchDataVals();
  }, [])

  const handleAddPoi = (poi, arrival, id, casinos, isNew) => {
    console.log('made it to poitracker');
    console.log('poi');
    console.log(poi);
    console.log('currentPoiList');
    console.log(currentPoiList);
    console.log('casinos');
    console.log(casinos);
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
        id: id },
    ];
  
    setCurrentPoiList(newList);
    sessionStorage.setItem('currentPoiList', JSON.stringify(newList));
  
    const newPoi = {
      name: poi.name,
      casinos: casinos.length ? casinos : selectedCasino,
      description: poi.description ? poi.description : '', 
      active: true,
    };
  
    isNew
      ? (() => {
          updateCollection('poi', newPoi);
          getPoiData();
          //Update currentPoiList withthe id found in the matching poi in poiList
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

  const handleAddPoiTransaction = (amount,date,type, note,index) => {
    const transactionDetails = { amount: amount, date:date, type:type, note:note }
    const newArray = [...currentPoiList];

    if (newArray[index].transactions) {
      // If it exists, add 'transactionsDetails' to the 'transactions' array of dictionaries
      newArray[index].transactions.push(transactionDetails);
    } else {
      // If it doesn't exist, create a new 'transaction' array with 'transactionDetails'
      newArray[index].transactions = [transactionDetails];
    }

    setCurrentPoiList(newArray);
    sessionStorage.setItem('currentPoiList', JSON.stringify(newArray));
    setOpenPlayerTransactionModal(false)
  };

  const handleTransactionOpen = (index)=>{
    setPoiIndex(index)
    setOpenPlayerTransactionModal(true)
  }

  return (
    <>
      <div className='flex justify-center mt-10'>
        <SingleSelect className="max-w-xs" onChange={handleCasinoChange} value={selectedCasino ? { label: selectedCasino, value: selectedCasino } : null} options={options} placeholder='Select a casino'/>
      </div>
      {/* <div className='flex justify-center mt-10'>
            <button className='btn' onClick={()=>console.log(poiList)}>poiList</button>
            <button className='btn' onClick={()=>console.log(currentPoiList)}>current poiList</button>
            <button className='btn' onClick={()=>console.log(dataValsList.casinos)}>current dataValsList</button>
            <button className='btn' onClick={()=>setCurrentPoiList([])}>reset current poiList</button>
      </div> */}

      {currentPoiList.length === 0  && (
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
              <PoiCard key={index} poi={singlePoi} handlePoiRemove={handlePoiRemove} index={index} openPlayerAddModal={handleOpenPlayerAddModal} openPlayerTransactionModal={handleTransactionOpen} />
            ))
          }
      </div>

      {/* {openPlayerAddModal && <PlayerAddModal  poiInfo={poiList} addPoi={handleAddPoi} casinos={dataValsList.casinos} selectedCasino={selectedCasino} isOpen={()=>setOpenPlayerAddModal()} />} */}
      {openPlayerAddModal && <NewPlayerAddModal setShowModal={setOpenPlayerAddModal} poiInfo={poiList} addPoi={handleAddPoi} casinos={dataValsList.casinos} selectedCasino={selectedCasino} />}
      {openPlayerTransactionModal && <NewPlayerTransactionModal setShowModal={setOpenPlayerTransactionModal} index={poiIndex} addTransaction={handleAddPoiTransaction} />}
    </>
  )
}

export default PoiTracker