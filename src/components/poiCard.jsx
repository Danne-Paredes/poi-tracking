import React from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { timeTransformer } from "./functions";

// Imports Icons
import { FiDollarSign } from 'react-icons/fi'
import { BsClock, BsFillPersonLinesFill } from 'react-icons/bs'
import { PiNotepadLight } from 'react-icons/pi'
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai'




export function PoiCard({
  openPlayerAddModal,
  openPlayerTransactionModal,
  openPlayerArriveDepartModal,
  openPlayerNotesModal,
  poi,
  handlePoiRemove,
  index,
}) {
  const navigate = useNavigate();

    const handleOpenLookup = (poi)=>{
      navigate(`/lookup/${poi.id}`,{ state: { poi }})
    }

    const totalBuyIn = poi.transactions && poi.transactions
      .filter(transaction => transaction.type === "Buy In")
      .reduce((total, transaction) => total + transaction.amount, 0);
    const cashOutsThisVisit = poi.transactions?.filter(transaction => transaction.type === "Cash Out").reduce((sum, transaction) => sum + transaction.amount, 0);
    const hasCashOut = poi.transactions?.some(transaction => transaction.type === 'Cash Out');
    const hasBuyIn = poi.transactions?.some(transaction => transaction.type === 'Buy In');
    const visitResult = cashOutsThisVisit - totalBuyIn;

    

  return (
      <div className="flex justify-center mt-5 mx-auto xxs:max-w-screen-md">
        <div className="flex-cols xxs:flex">
          <div className="player-card ml-2 mr-2">
            <h3 className={`text-center text-xl font-medium ${hasCashOut && visitResult < -4999 ? `text-kv-red` : `text-gray-400`}`} onClick={()=>console.log(poi)}>{poi.name}</h3>
            <div className={`text-center text-xs font-semibold ${hasCashOut && visitResult < -4999 ? `text-kv-red` : `text-gray-400`}`}>
              <p>{poi.description}</p>
              <p>Arrival: {timeTransformer(poi.arrival)}</p>
              {hasBuyIn && <p>BI: {totalBuyIn ? `$${totalBuyIn.toLocaleString()}`:`$0`}</p>}
              {hasCashOut && <p>Result: {visitResult < 0 ? `-$${Math.abs(visitResult).toLocaleString()}` : `$${visitResult.toLocaleString()}`}</p>}
            </div>
            <div id="btn-menu" className="py-5 grid grid-cols-4 xxxxs:grid-cols-2 xxs:grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-4 justify-items-center">
                <button type="button" className={`${hasCashOut && visitResult < -4999 ? 'btn-sm-red' : 'btn-sm'}`} onClick={()=>openPlayerTransactionModal(index)}><FiDollarSign className="inner-icon"  /></button>
                <button type="button" className={`${hasCashOut && visitResult < -4999 ? 'btn-sm-red' : 'btn-sm'}`} onClick={()=>openPlayerArriveDepartModal(index)}><BsClock className="inner-icon"   /></button>
                { poi.visits && poi.visits.length !== 0 ? 
                  <button type="button" className={`${hasCashOut && visitResult < -4999 ? 'btn-sm-red' : 'btn-sm'}`} onClick={()=>openPlayerNotesModal(index)}><PiNotepadLight className="inner-icon" /></button>
                  :
                  <button type="button" className={`${hasCashOut && visitResult < -4999 ? 'btn-sm-red' : 'btn-sm'}`} disabled></button>
                }
                <button type="button" className={`${hasCashOut && visitResult < -4999 ? 'btn-sm-red' : 'btn-sm'}`} onClick={()=>handleOpenLookup(poi)}><BsFillPersonLinesFill className="inner-icon"/></button>
            </div>
          </div>
          <div id="btn-menu-2" className="flex flex-row xxs:flex-col space-x-4 xxs:space-x-0 xxs:space-y-4 items-center justify-center py-3 mx-auto">
            <button type="button" className="btn-sm bg-dark-leather h-10 w-10 flex items-center justify-center" onClick={openPlayerAddModal}><AiOutlinePlusCircle className="inner-icon"  /></button>
            <button type="button" className="btn-sm bg-dark-leather h-10 w-10 flex items-center justify-center" onClick={() => {
                                    if (window.confirm('Are you sure you want to remove this POI?')) {
                                      handlePoiRemove(index);
                                    }
                                  }}><AiOutlineMinusCircle className="inner-icon"/></button>
          </div>
        </div>
      </div>
)}

