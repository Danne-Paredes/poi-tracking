import React from "react";

// Imports Icons
import { FiDollarSign } from 'react-icons/fi'
import { BsClock, BsFillPersonLinesFill } from 'react-icons/bs'
import { PiNotepadLight } from 'react-icons/pi'
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai'



export function PoiCard({
  handleMenuOpen,
  openPlayerAddModal,
  poi
}) {
  return <div className="flex justify-center mt-5">
        <div onClick={handleMenuOpen} className="flex">
          <div className="player-card mr-2">
            <h3 className="text-center text-xl text-kv-gray font-medium">{poi.name}</h3>
            <div className="text-center text-gray-400 text-xs font-semibold">
              <p>{poi.description}</p>
            </div>
            <div id="btn-menu" className={`flex justify-center py-5`}>
              <button type="button" className="btn-sm"><FiDollarSign className="inner-icon" onClick={()=>console.log(poi)} /></button>
              <button type="button" className="btn-sm"><BsClock className="inner-icon" /></button>
              <button type="button" className="btn-sm"><BsFillPersonLinesFill className="inner-icon" /></button>
              <button type="button" className="btn-sm"><PiNotepadLight className="inner-icon" /></button>
            </div>
          </div>
          <div id="btn-menu-2" className={`flex flex-col space-y-4 py-3`}>
            <button type="button" className="btn-sm bg-dark-leather"><AiOutlinePlusCircle className="inner-icon" onClick={openPlayerAddModal} /></button>
            <button type="button" className="btn-sm bg-dark-leather"><AiOutlineMinusCircle className="inner-icon" /></button>
          </div>
        </div>
      </div>;
}
  