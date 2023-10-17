import React from "react";
import { useNavigate, useLocation } from 'react-router-dom';

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
  index
}) {
  const navigate = useNavigate();

    const handleOpenLookup = (poi)=>{
      navigate(`/lookup/${poi.id}`,{ state: { poi }})
    }

  return (
      <div className="flex justify-center mt-5 mx-auto xxs:max-w-screen-md">
        <div className="flex-cols xxs:flex">
          <div className="player-card ml-2 mr-2">
            <h3 className="text-center text-xl text-kv-gray font-medium" onClick={()=>console.log(poi)}>{poi.name}</h3>
            <div className="text-center text-gray-400 text-xs font-semibold">
              <p>{poi.description}</p>
            </div>
            <div id="btn-menu" className="py-5 grid grid-cols-4 xxxxs:grid-cols-2 xxs:grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-4 justify-items-center">
                <button type="button" className="btn-sm" onClick={()=>openPlayerTransactionModal(index)}><FiDollarSign className="inner-icon"  /></button>
                <button type="button" className="btn-sm" onClick={()=>openPlayerArriveDepartModal(index)}><BsClock className="inner-icon"   /></button>
                { poi.visits && poi.visits.length !== 0 ? 
                  <button type="button" className="btn-sm" onClick={()=>openPlayerNotesModal(index)}><PiNotepadLight className="inner-icon" /></button>
                  :
                  <button type="button" className="btn-sm" disabled></button>
                }
                <button type="button" className="btn-sm" onClick={()=>handleOpenLookup(poi)}><BsFillPersonLinesFill className="inner-icon"/></button>
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

