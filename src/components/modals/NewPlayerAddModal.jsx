import React, {useState, useEffect, useRef} from 'react'
import SingleSelect from '../singleSelect';
import MultiSelect from '../multiSelect';
import { v4 as uuidv4 } from 'uuid';

export const NewPlayerAddModal = ({ setShowModal, addPoi, poiInfo, casinos, selectedCasino }) => {
  const [formState, setFormState] = useState({
    poi: '',
    poiId: '',
    poiDescription: '',
    isNew: false,
    poiList: [],
    selectedDateTime: '',
    selectedLocations: [],
  });

  const options = [ 
    ...poiInfo
      .filter((poi) => poi.casinos.includes(selectedCasino))
      .filter((poi) => poi.active)
      .map((poi) => {
       return { value: poi.name, label: poi.name };
    })];
  const allOptions = [ 
    ...poiInfo
      .filter((poi) => poi.active)
      .map((poi) => {
       return { value: poi.name, label: poi.name };
    })];
  const locationOptions = [ 
    ...casinos.map((casino) => {
       return { value: casino, label: casino };
    })];

  const { poi, poiId, isNew, selectedDateTime, selectedLocations, poiList, poiDescription } = formState;
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  const handleDateTimeChange = (event) => {
    const inputDate = event.target.value;
    setFormState((prevState) => ({
      ...prevState,
      selectedDateTime: inputDate,
    }));
  };
  const handleIsNewChange = (e) => {
    const newUUID = uuidv4();
    console.log(newUUID)
    setFormState((prevState) => ({
      ...prevState,
      isNew: !prevState.isNew,
      poi:'',
      poiId:newUUID,
    }));
  };
  
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
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowModal(false);
      }
    };

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleAddPoi = (e) => {
    const enteredPoi = e.value;
    const selectedPoi =  formState.poiList.find((poi) => poi.name === enteredPoi);

    if (isNew) {
      const newPoi = {
        ...poi,
        active: true,
        name:e.target.value,
        casinos: selectedLocations? selectedLocations : [],
      }
      setFormState((prevState) => ({
        ...prevState,
        poi: newPoi,
      }));
      return
    }

    if (selectedPoi) {
      setFormState((prevState) => ({
        ...prevState,
        poiId: selectedPoi.id,
        poi: selectedPoi,
        poiDescription: selectedPoi.description? selectedPoi.description : '',
      }));
    } else {
      setFormState((prevState) => ({
        ...prevState,
        poi: selectedPoi,
      }));
    }
  };
  const handleLocationChange = (selectedLocations) => {
    const newPoi = {
      ...poi,
      casinos: selectedLocations? selectedLocations : [],
    }
    setFormState((prevState) => ({
      ...prevState,
      selectedLocations,
      poi:newPoi,
    }));
  }; 
  const handleAddDescription = (event) => {
    const description = event.target.value;
    const newPoi = {
      ...poi,
      description: description,
    }
  
    setFormState((prevState) => ({
      ...prevState,
      poi: newPoi,
    }));
  };
  const handleAddNotes = (event) => {
    const note = event.target.value;
    const newPoi = {
      ...poi,
      note: note,
    }
  
    setFormState((prevState) => ({
      ...prevState,
      poi: newPoi,
    }));
  };

  const handleSubmit = () => {
    if (!formState.poi || !formState.poi.name ) {
        window.alert("Please select or enter a POI name.");
        return;
    }
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
 
    console.log('formState')
    console.log(formState)
    addPoi(poi, selectedDateTime, poiId, selectedLocations, isNew);
  };

  return (
    <div
      className="justify-center items-start pt-6 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-dark-denim"
    >
      <div ref={modalRef} className="relative w-auto  mx-auto max-w-3xl">
        {/*content*/}
        <div className="border-0 rounded-lg mt-0 items-center shadow-lg relative flex flex-col w-full bg-dark-leather-2 outline-none focus:outline-none">
          {/*header*/}
          <div onClick={()=>console.log(formState)}  className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
            <h3 className="text-3xl font-semibold text-center text-kv-gray" >
              Track Player of Interest
            </h3>
          </div>
          {/*body*/}
          <div className="relative p-6 flex-auto">
            <input
              className='justify-center mx-auto items-center text-center block mb-2'
              type="datetime-local"
              defaultValue={selectedDateTime}
              onChange={handleDateTimeChange}
            />
            <label className='text-kv-gray'>New POI:</label>
            <input type="checkbox" checked={isNew} onChange={handleIsNewChange} />
            <br/>
            {!isNew && (
              <SingleSelect ref={inputRef} id="pois" onKeyDown={handleKeyDown} onChange={handleAddPoi} className="max-w-xs" value={poi.name ? { label: poi.name, value: poi.name } : null} options={selectedCasino? options : allOptions} placeholder='Select a Player'/>
            )}
            {!isNew && (
              <>
                <label className='text-kv-gray'> Description: </label>
                <p className='text-kv-gray text-center'>{poiDescription}</p>
              </>
            )}
            {isNew && (
              <>
                  <input
                  className='justify-center mx-auto items-center text-center mb-2 block'
                    ref={inputRef}
                    id="pois"
                    type="text"
                    onKeyDown={handleKeyDown}
                    placeholder="Enter POI Name"
                    onChange={handleAddPoi}
                    required
                    />
                  <input
                    id="description"
                    className='justify-center mx-auto items-center text-center block mb-2'
                    onKeyDown={handleKeyDown}
                    placeholder="Enter Description"
                    onChange={handleAddDescription}
                    required
                    />
                  <textarea
                    id="notes"
                    className='justify-center mx-auto items-center text-center block mb-2'
                    onKeyDown={handleKeyDown}
                    placeholder="Enter Player Notes"
                    onChange={handleAddNotes}
                    required
                    />
              </>
          )}
          {isNew && (
            <MultiSelect 
              className='pref-input input' 
              options={casinos} 
              placeholder='Select Active Casinos' 
              onChange={handleLocationChange}
            />
          )}

          </div>
          {/*footer*/}
          <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
            <button
              className="btn-close"
              type="button"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
            <button
              className="btn-gray"
              type="button"
              onClick={handleSubmit}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}