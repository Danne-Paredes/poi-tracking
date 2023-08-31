import React from "react";

// Imports Icons
import { FiDollarSign } from 'react-icons/fi'
import { BsClock, BsFillPersonLinesFill } from 'react-icons/bs'
import { PiNotepadLight } from 'react-icons/pi'
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai'



export function PoiCard({
  openPlayerAddModal,
  openPlayerTransactionModal,
  poi,
  handlePoiRemove,
  index
}) {
  return (
      <div className="flex justify-center mt-5 mx-auto xxs:max-w-screen-md">
        <div className="flex-cols xxs:flex">
          <div className="player-card ml-2 mr-2">
            <h3 className="text-center text-xl text-kv-gray font-medium">{poi.name}</h3>
            <div className="text-center text-gray-400 text-xs font-semibold">
              <p>{poi.description}</p>
            </div>
            <div id="btn-menu" className="py-5 grid grid-cols-4 xxxxs:grid-cols-2 xxs:grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-4 justify-items-center">
                <button type="button" className="btn-sm"><FiDollarSign className="inner-icon" onClick={openPlayerTransactionModal} /></button>
                <button type="button" className="btn-sm"><BsClock className="inner-icon"  onClick={()=>console.log(poi)} /></button>
                <button type="button" className="btn-sm"><BsFillPersonLinesFill className="inner-icon"  onClick={()=>console.log(poi)} /></button>
                <button type="button" className="btn-sm"><PiNotepadLight className="inner-icon"  onClick={()=>console.log(poi)} /></button>
            </div>
          </div>
          <div id="btn-menu-2" className="flex flex-row xxs:flex-col space-x-4 xxs:space-x-0 xxs:space-y-4 items-center justify-center py-3 mx-auto">
    <button type="button" className="btn-sm bg-dark-leather h-10 w-10 flex items-center justify-center"><AiOutlinePlusCircle className="inner-icon" onClick={openPlayerAddModal} /></button>
    <button type="button" className="btn-sm bg-dark-leather h-10 w-10 flex items-center justify-center"><AiOutlineMinusCircle className="inner-icon" onClick={() => {
                            if (window.confirm('Are you sure you want to remove this POI?')) {
                              handlePoiRemove(index);
                            }
                          }} /></button>
</div>

        </div>
      </div>
)}

