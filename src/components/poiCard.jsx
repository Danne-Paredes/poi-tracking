import React from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { timeTransformer, handleOpenModal, handlePoiRemove, useLongPress } from "./functions";
import { getCurrentPois } from "../config/firebase";

// Imports Icons
import { FiDollarSign } from 'react-icons/fi'
import { BsClock, BsFillPersonLinesFill } from 'react-icons/bs'
import { PiNotepadLight } from 'react-icons/pi'
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai'




export function PoiCard({
                          poi,
                          state,
                          index,
                          setState,
                          currentPoiList,
                          setCurrentPoiList,
                          selectedCasino
                        }) {

  const navigate = useNavigate();
  

  const handleOpenLookup = (poi)=>{
    navigate(`/lookup/${poi.id}`,{ state: { poi }})
  }

  const totalBuyIn = poi.transactions && poi.transactions
    .filter(transaction => transaction.type === "Buy In")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const cashOutsThisVisit = poi.transactions?.filter(transaction => transaction.type === "Cash Out").reduce((sum, transaction) => sum + transaction.amount, 0);
  const hasCashOut = poi.transactions?.some(transaction => transaction.type === 'Cash Out');
  const hasBuyIn = poi.transactions?.some(transaction => transaction.type === 'Buy In');
  const visitResult = cashOutsThisVisit - totalBuyIn;

  const handleLongPress = (index) => {
    // // Define the action to be performed on long press
    // const customAmount = updatedPoi.transactions[index].type === 'Buy In' ? `+${updatedPoi.transactions[index].amount}` : `-${updatedPoi.transactions[index].amount}`
    // console.log(updatedPoi.transactions[index])
    // console.log('Handling long press on index:', index); // Make sure this logs
    // if (window.confirm(`Remove Transaction? \nAmount: ${customAmount}\nTime: ${timeTransformer(updatedPoi.transactions[index].date)}`)) {
        // handleTransactionRemove(index, updatedPoi.transactions, currentPoiList, setCurrentPoiList, parentState, setFormState)
        // handleStateUpdate(calculatedTotal(), 'total', setFormState)
    // }
    handleOpenModal( "playerInfo", setState, index, currentPoiList )
  };
  
const longPressEventHandlers = useLongPress(handleLongPress, 500); // 500ms for long press

  
    

  return (
    <div className="flex justify-center mt-5 mx-auto xxs:max-w-screen-md">
      <div className="flex-cols xxs:flex">
        <div className="player-card ml-2 mr-2" {...longPressEventHandlers(index)} >
          <h3 className={`text-center text-xl font-medium ${hasCashOut && visitResult < -7999 ? `text-kv-red` : `text-gray-400`}`} onClick={()=>console.log(poi)} >{poi.name}</h3>
          <div className={`text-center text-xs font-semibold ${hasCashOut && visitResult < -7999 ? `text-kv-red` : `text-gray-400`}`}>
            <p>{poi.description}</p>
            <p>Arrival: {timeTransformer(poi.arrival)}</p>
            {hasBuyIn && <p>BI: {totalBuyIn ? `$${totalBuyIn.toLocaleString()}`:`$0`}</p>}
            {hasCashOut && <p>Result: {visitResult < 0 ? `-$${Math.abs(visitResult).toLocaleString()}` : `$${visitResult.toLocaleString()}`}</p>}
          </div>
          <div id="btn-menu" className="py-5 grid grid-cols-4 xxxxs:grid-cols-2 xxs:grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-4 justify-items-center">
              <button type="button" className={`${hasCashOut && visitResult < -7999 ? 'btn-sm-red' : 'btn-sm'}`} onClick={()=>handleOpenModal( "transactionAdd", setState, index, currentPoiList )}><FiDollarSign className="inner-icon"  /></button>
              <button type="button" className={`${hasCashOut && visitResult < -7999 ? 'btn-sm-red' : 'btn-sm'}`} onClick={()=>handleOpenModal( "arriveDepart", setState, index, currentPoiList )} ><BsClock className="inner-icon"   /></button>
              { poi.visits && poi.visits.length !== 0 ? 
                <button type="button" className={`${hasCashOut && visitResult < -7999 ? 'btn-sm-red' : 'btn-sm'}`} onClick={()=>handleOpenModal( "notesViewer", setState, index, currentPoiList )}  ><PiNotepadLight className="inner-icon" /></button>
                :
                <button type="button" className={`${hasCashOut && visitResult < -7999 ? 'btn-sm-red' : 'btn-sm'}`} disabled></button>
              }
              <button type="button" className={`${hasCashOut && visitResult < -7999 ? 'btn-sm-red' : 'btn-sm'}`} onClick={()=>handleOpenLookup(poi)} ><BsFillPersonLinesFill className="inner-icon"/></button>
              {/* <button type="button" className={`${hasCashOut && visitResult < -7999 ? 'btn-sm-red' : 'btn-sm'}`} onClick={()=>handleOpenLookup(poi)}><BsFillPersonLinesFill className="inner-icon"/></button> */}
          </div>
        </div>
        <div id="btn-menu-2" className="flex flex-row xxs:flex-col space-x-4 xxs:space-x-0 xxs:space-y-4 items-center justify-center py-3 mx-auto">
          <button type="button" className="btn-sm bg-dark-leather h-10 w-10 flex items-center justify-center" onClick={()=>handleOpenModal( "playerAdd", setState )}><AiOutlinePlusCircle className="inner-icon"  /></button>
          <button type="button" className="btn-sm bg-dark-leather h-10 w-10 flex items-center justify-center" onClick={() => {
                                  if (window.confirm('Are you sure you want to remove this POI?')) {
                                    
                                    handlePoiRemove(index,state, currentPoiList, setCurrentPoiList, selectedCasino);
                                  }
                                }}><AiOutlineMinusCircle className="inner-icon"/></button>
        </div>
      </div>
    </div>
  )
}

