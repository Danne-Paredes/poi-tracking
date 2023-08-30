// I need to figure out selected casinos better, it currently overwrites previous casinos too easily
// I should find a  way of keeping track of previous casions/saving it to history

import React, { useState, useRef, useEffect } from 'react';
import './.modal.css';

function PlayerRosterEditModal({ isOpen, editPoi, poiInfo, casinos, poiListInfo, index }) {
  const [formState, setFormState] = useState({
    poi: '',
    poiIndex: '',
    selectedLocations: [],
  });

  const { poi, poiList, isActive, selectedLocations, poiIndex, poiId } = formState;
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  const onClose = () => {
    isOpen(false);
  };

  useEffect(() => {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() - 7);
    const adjustedDateTime = currentDate.toISOString().slice(0, 16);
    setFormState((prevState) => ({
      ...prevState,
      selectedDateTime: adjustedDateTime,
      poi: poiInfo.poi,
      poiList: poiListInfo,
      poiIndex: index,
      poiId: poiInfo.id,
      isActive:poiInfo.active,
      locations: casinos,
      selectedLocations: poiInfo.casinos,

    }));
    console.log('poiInfo');
    console.log(poiInfo);
    console.log('selectedLocations');
    console.log(selectedLocations);
  }, []);

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

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };


  const handleEditPoi = (e) => {
    const enteredPoi = e.target.value;

    setFormState((prevState) => ({
      ...prevState,
      poi: enteredPoi,
    }));
  };
  

  const handleSubmit = () => {
    console.log(poi)
    console.log(poiInfo)
    const selectedPoi = poiList.find(
      (pois) => pois.poi.toLowerCase() === poi.toLowerCase() && pois.id !== poiId
    );
    if (selectedPoi && isActive) {
      console.log("selected:");
      console.log(selectedPoi);
      const casinosList = selectedPoi.casinos.join('\n');
      window.alert(`Name Unavailable\n${selectedPoi.poi} is already listed at the following casinos:\n${casinosList}`);
      return;
    }
    const newPoiInfo = {
      ...poiInfo,
      poi: poi,
      casinos: selectedLocations,
      active: isActive,
    };
    console.log(newPoiInfo)
    editPoi(newPoiInfo, poiIndex);
  };

  const handleIsActiveChange = (event) => {
    
  }

  const handleOptionsChange = (event) => {
    const selected = Array.from(event.target.selectedOptions, (option) => option.value);
    setFormState((prevState) => ({
      ...prevState,
      selectedLocations: selected,
    }));
  };

  return (
    <div className="modalBackground">
      <div ref={modalRef} className="modalContainer">
        <div className="titleCloseBtn">
          <button onClick={onClose}> X </button>
        </div>
        <div className="title">
          <h1>Edit Player of Interest</h1>
        </div>
        <div className="body">
          <label>POI Name:</label>
          
            <input
              ref={inputRef}
              id="pois"
              type="text"
              onKeyDown={handleKeyDown}
              placeholder="Enter POI Name"
              onChange={handleEditPoi}
              value={poi}
              required
            />
          <label>Is Active:</label>
          <input type="checkbox" checked={isActive} onChange={handleIsActiveChange} /> 

            <select id="locations" multiple value={selectedLocations} onChange={handleOptionsChange}>
              {formState.locations &&
                formState.locations.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
            </select>
        </div>

        <div className="footer">
          <button onClick={onClose} id="cancelBtn">
            Cancel
          </button>
          <button onClick={handleSubmit}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlayerRosterEditModal;
