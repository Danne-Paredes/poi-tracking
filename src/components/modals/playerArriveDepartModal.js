import React from 'react'
import { useState, useRef, useEffect } from 'react';
import "./.modal.css";

function PlayerArriveDepartModal({isOpen, addPoi, poi,index, poiList}) {
    // set states and declare refs
    const [updatedPoi, setUpdatedPoi] = useState(poi)
    const [selectedDepartureDateTime, setSelectedDepartureDateTime] = useState('');
    const [type, setType] = useState('Arrival');
    const inputRef = useRef(null);
    const modalRef = useRef(null);
    const onClose = ()=>{
        isOpen(false)
    }

    // sets current date/time to the departure input allowing for a 1 click close if player
    // is departing now vs a custom time
    useEffect(() => {
      const currentDate = new Date();
      currentDate.setHours(currentDate.getHours() - 7);
      const adjustedDateTime = currentDate.toISOString().slice(0, 16);
      setSelectedDepartureDateTime(adjustedDateTime);
      console.log('poi')
      console.log(poi)
      console.log('poiList')
      console.log(poiList)

      if (poi.id === '') {
        console.log('empty id')
        const matchingDoc = poiList.find((doc) => doc.poi === poi.poi);
        if (matchingDoc) {
          console.log('matchingDoc')
          console.log(matchingDoc)
          const newEntry = {
            ...updatedPoi,
            id: matchingDoc.id
          };
          setUpdatedPoi(newEntry)
          return;
        }
      }
      }, []);

    // sets focus
    useEffect(() => {
      if (isOpen && inputRef.current) {
        inputRef.current.focus();
      }
      const handleEscape = (event) => {
        if (event.key === 'Escape' && isOpen) {
          onClose();
        }
      };
    
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target) && isOpen) {
          onClose();
        }
      };
  
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
  
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen, onClose]);

    const handleArrivalDateTimeChange = (event) => {
      const inputDate = event.target.value;
      const newEntry = {
        ...updatedPoi,
        arrival: inputDate,
      };
      setUpdatedPoi(newEntry)
    };
    
    const handleDepartDateTimeChange = (event) => {
      const inputDate = event.target.value;
      setSelectedDepartureDateTime(inputDate)
    };

    const handleSubmit = ()=>{
          

      const newEntry = {
        ...updatedPoi,
        departure: selectedDepartureDateTime,
      };
      type =='Arrival'? addPoi(updatedPoi,index): addPoi(newEntry,index);
    }

    const handleTypeChange = (e)=>{
      const type = e.target.value;
      setType(type)
      console.log(`Type: ${type}`)
    }

  return (
    <div className='modalBackground'>
        <div ref={modalRef} className='modalContainer'>
            <div className='titleCloseBtn'>
                <button onClick={onClose}> X </button>
            </div>
            <div className='title'>
                {type === 'Arrival' ? <h1>Update Arrival</h1> :<h1> Set Departure</h1>}
            </div>
            <div  className='body'>
            {/* <button type="button" className="icon" onClick={()=>console.log(updatedPoi)}>Console Log</button> */}
                {/* <label>Player of Interest</label>
                <input type="text" value={poi.poi} readOnly/> */}
                <div className='radio-group'>
                  <input onClick={handleTypeChange} type="radio" defaultValue="Arrival" name="gender" defaultChecked/> Arrival <br></br>
                  <input onClick={handleTypeChange} type="radio" defaultValue="Departure" name="gender" /> Departure
                </div>
                {type == 'Arrival' && 
                  (<>
                    <label>Arrival Time</label>
                    <input type="datetime-local"  defaultValue={poi.arrival} onChange={handleArrivalDateTimeChange} />
                    </>
                )}
                {type == 'Departure' && 
                  (<>
                  <label>Departure Time</label>
                  <input ref={inputRef} type="datetime-local" defaultValue={selectedDepartureDateTime} onChange={handleDepartDateTimeChange} />
                </>
                )}
                {/* <input ref={inputRef} type='text'  placeholder='Select A Player' onChange={handleAddPoi} required/> */}
            </div>
            
            <div className='footer'>
                <button onClick={onClose} id='cancelBtn'>Cancel</button>
                <button onClick={handleSubmit}>Continue</button>
            </div>
        </div>
    </div>
  )
}

export default PlayerArriveDepartModal