import React, {useState, useEffect, useRef} from 'react'
import {db, updateCollection, getDataVals, getPoiData} from '../config/firebase'
import SingleSelect from '../components/SingleSelect';
import MultiSelect from '../components/MultiSelect';
import { handleStateUpdate } from '../components/functions';
import { toHaveAccessibleName } from '@testing-library/jest-dom/matchers';

export const RosterEditModal = (props) => {
  const { state: parentState, setState: setParentState, handleKeyDown,  selectedPoi, index, poiListInfo, editPoi } = props;
  const { poiList = [],
          casinos = parentState?.dataValsList.casinos,
      } = parentState || {};

  const [formState, setFormState] = useState({
    name: '',
    description: '',
    notes: '',
    poiIndex: '',
    isActive: '',
    selectedLocations: [],
  });

  const { isActive, selectedLocations, poiIndex, poiId, description, locations, notes, name } = formState;
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const currentDate = new Date();
    const timezoneOffsetInMinutes = currentDate.getTimezoneOffset();
    const adjustedDate = new Date(currentDate.getTime() - timezoneOffsetInMinutes * 60000);

    const adjustedDateTime = adjustedDate.toISOString().slice(0, 16);
    console.log('selectedPoi', selectedPoi)
    setFormState((prevState) => ({
      ...prevState,
      selectedDateTime: adjustedDateTime,
      name: selectedPoi.name,
      description: selectedPoi.description,
      notes: selectedPoi.notes,
      poiList: poiListInfo,
      poiIndex: index,
      poiId: selectedPoi.id,
      isActive:selectedPoi.active,
      locations: casinos,
      selectedLocations: selectedPoi.casinos
    }));

    if (inputRef.current) {
      inputRef.current.focus();
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        handleStateUpdate(false, 'openModal', setParentState)
      }
    };
    
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLocationChange = (selectedLocations) => {
    setFormState((prevState) => ({
      ...prevState,
      selectedLocations,
    }));
  }; 



  const handleSubmit = () => {
    const poiToEdit = poiList.find(
      (pois) => pois.name.toLowerCase() === name.toLowerCase() && pois.id !== poiId
    );
    console.log('poiToEdit',poiToEdit)
    if (poiToEdit && isActive) {
      console.log("selected:");
      console.log(poiToEdit);
      const casinosList = poiToEdit.casinos.join('\n');
      window.alert(`Name Unavailable\n${poiToEdit.name} is already listed at the following casinos:\n${casinosList}`);
      return;
    }
    const newPoiInfo = {
      ...selectedPoi,
      name: name,
      description: description,
      notes: notes? notes: "",
      casinos: selectedLocations,
      active: isActive,
    };
    console.log('newPoiInfo')
    console.log(newPoiInfo)
    editPoi(newPoiInfo, poiIndex);
  };

  return (
    <div className="justify-center items-start pt-6 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-dark-denim">
      <div ref={modalRef} className="relative w-auto  mx-auto max-w-3xl">
        {/*content*/}
        <div className="border-0 rounded-lg mt-0 items-center shadow-lg relative flex flex-col w-full bg-dark-leather-2 outline-none focus:outline-none">
          {/*header*/}
          <div onClick={()=>console.log(formState)}  className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
            <h3 className="text-3xl font-semibold text-center text-kv-gray" >
              Edit Player of Interest
            </h3>
          </div>
          {/*body*/}
          <div className="relative p-6 flex-auto">
    <div className="flex mb-4">
        <div className="pr-4 flex-none">
            <span className='text-kv-gray'>Currently Active:</span>
        </div>
        <div className="flex-grow">
            <label className="relative inline-flex items-center cursor-pointer">
                <input 
                    type="checkbox" 
                    name={`toggle-${selectedPoi.id}`} 
                    id={`toggle-${selectedPoi.id}`} 
                    checked={isActive}
                    onChange={() => handleStateUpdate(!isActive, 'isActive', setFormState)} className="sr-only peer"
                    />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-kv-red"></div>
            </label>
        </div>
    </div>

    <div className="flex mb-4">
        <div className="pr-4 flex-none">
            <span className='text-kv-gray'>Name:</span>
        </div>
        <div className="flex-grow">
            <input
                className='justify-center mx-auto items-center text-center block'
                ref={inputRef}
                id="pois"
                type="text"
                onKeyDown={handleKeyDown}
                placeholder="Enter POI Name"
                onChange={(e) => handleStateUpdate(e.target.value, 'name', setFormState)}
                value={name}
                required
                />
        </div>
    </div>

    <div className="mb-4">
        <span className='text-kv-gray'>Description:</span>
        <input
            id="description"
            className='justify-center mx-auto items-center text-center block mt-2'
            onKeyDown={handleKeyDown}
            placeholder="Enter Description"
            onChange={(e) => handleStateUpdate(e.target.value, 'description', setFormState)}
            value={description}
            required
            />
    </div>
    <div className="mb-4">
        <span className='text-kv-gray'>Notes:</span>
        <textarea
            id="notes"
            className='justify-center mx-auto items-center text-center block mt-2'
            onKeyDown={handleKeyDown}
            placeholder="Enter Notes"
            onChange={(e) => handleStateUpdate(e.target.value, 'notes', setFormState)}
            value={notes}
            required
            />
    </div>

    <div className="mb-4">
        <span className='text-kv-gray'>Active Casinos:</span>
        <MultiSelect 
            className='pref-input input mt-2' 
            options={locations} 
            placeholder='Select Active Casinos' 
            onChange={handleLocationChange}
            values={selectedLocations}
            />
    </div>
</div>


          {/*footer*/}
          <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
            <button
              className="btn-close"
              type="button"
              onClick={() => handleStateUpdate(false, 'openModal', setParentState)}
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