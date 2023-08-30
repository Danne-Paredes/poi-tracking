import React, { useState, useRef, useEffect } from 'react';
import SingleSelect from '../singleSelect';
import './.modal.css';


function PlayerAddModal({ isOpen, addPoi, poiInfo, casinos, selectedCasino }) {
  const [formState, setFormState] = useState({
    poi: '',
    poiId: '',
    isNew: false,
    poiList: [],
    selectedDateTime: '',
    selectedLocations: [],
  });

  const { poi, poiId, isNew, selectedDateTime, selectedLocations, poiList } = formState;
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  const onClose = () => {
    isOpen(false);
  };

  const options = [ 
                 ...poiList.map((poi) => {
                    return { value: poi.name, label: poi.name };
                 })];

  useEffect(() => {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() - 7);
    const adjustedDateTime = currentDate.toISOString().slice(0, 16);
    setFormState((prevState) => ({
      ...prevState,
      selectedDateTime: adjustedDateTime,
      poiList: poiInfo,
      locations: casinos,

    }));
    console.log('poiList');
    console.log(poiList);
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

  const handleDateTimeChange = (event) => {
    const inputDate = event.target.value;
    setFormState((prevState) => ({
      ...prevState,
      selectedDateTime: inputDate,
    }));
  };

  const handleAddPoi = (e) => {
    const enteredPoi = e.value;
    const selectedPoi = formState.poiList.find((poi) => poi.name === enteredPoi);
    console.log('selectedPoi')
    console.log(selectedPoi)

    if (selectedPoi) {
      setFormState((prevState) => ({
        ...prevState,
        poiId: selectedPoi.id,
        poi: selectedPoi,
      }));
    } else {
      setFormState((prevState) => ({
        ...prevState,
        poi: selectedPoi,
      }));
    }
  };
  

  const handleIsNewChange = (e) => {
    setFormState((prevState) => ({
      ...prevState,
      isNew: !prevState.isNew,
    }));
    console.log(isNew);
  };
  const handleSubmit = () => {
    const selectedPoi = formState.poiList.find(
      (poi) => poi.name.toLowerCase() === formState.poi.name.toLowerCase()
    );
    console.log("selected:");
    console.log(selectedPoi);
    if (selectedPoi && isNew) {
      const casinosList = selectedPoi.casinos.join('\n');
      window.alert(`Name Unavailable\n${selectedPoi.name} is already listed at the following casinos:\n${casinosList}`);
      return;
    }
    addPoi(poi, selectedDateTime, poiId, selectedLocations, isNew);
  };

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
          <h1>Track Player of Interest</h1>
        </div>
        <div className="body flex flex-col space-y-4 py-3">
          <input
            type="datetime-local"
            defaultValue={selectedDateTime}
            onChange={handleDateTimeChange}
          />
          <label onClick={console.log(poiList)}>New POI:</label>
          <input type="checkbox" checked={isNew} onChange={handleIsNewChange} />
          {!isNew && (
            <SingleSelect ref={inputRef} id="pois" onKeyDown={handleKeyDown} onChange={handleAddPoi} className="max-w-xs" value={poi.name ? { label: poi.name, value: poi.name } : null} options={options} placeholder='Select a Player'/>
          )}
          {isNew && (
            <input
              ref={inputRef}
              id="pois"
              type="text"
              onKeyDown={handleKeyDown}
              placeholder="Enter POI Name"
              onChange={handleAddPoi}
              required
            />
          )}

          {isNew && (
            <select id="locations" multiple value={selectedLocations} onChange={handleOptionsChange}>
              {formState.locations &&
                formState.locations.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
            </select>
          )}
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

export default PlayerAddModal;
