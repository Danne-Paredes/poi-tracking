import React, {useState, useEffect, useRef} from 'react'
import SingleSelect from '../singleSelect';
import MultiSelect from '../multiSelect';

export const NewPlayerRosterEditModal = ({ setShowModal, editPoi, poiInfo, casinos, poiListInfo, index  }) => {
  const [formState, setFormState] = useState({
    poi: '',
    description: '',
    notes: '',
    poiIndex: '',
    isActive: '',
    selectedLocations: [],
  });

  const { poi, poiList, isActive, selectedLocations, poiIndex, poiId, description, locations, notes } = formState;
  const inputRef = useRef(null);
  const modalRef = useRef(null);


  useEffect(() => {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() - 7);
    const adjustedDateTime = currentDate.toISOString().slice(0, 16);
    setFormState((prevState) => ({
      ...prevState,
      selectedDateTime: adjustedDateTime,
      poi: poiInfo.name,
      description: poiInfo.description,
      notes: poiInfo.notes,
      poiList: poiListInfo,
      poiIndex: index,
      poiId: poiInfo.id,
      isActive:poiInfo.active,
      locations: casinos,
      selectedLocations: poiInfo.casinos
    }));

    if (inputRef.current) {
      inputRef.current.focus();
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowModal(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    // document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
      // console.log('click')
    }
  };

  const handleEditPoi = (e) => {
    const enteredPoi = e.target.value;

    setFormState((prevState) => ({
      ...prevState,
      poi: enteredPoi,
    }));
  };
  const handleEditDescription = (e) => {
    const enteredDescription = e.target.value;
    console.log(enteredDescription)

    setFormState((prevState) => ({
      ...prevState,
      description: enteredDescription,
    }));
  };

  const handleEditNotes = (e) => {
    const enteredNotes = e.target.value;
    console.log(enteredNotes)

    setFormState((prevState) => ({
      ...prevState,
      notes: enteredNotes,
    }));
  };

  const handleStatusChange = () => {
    setFormState((prevState) => ({
      ...prevState,
      isActive: !isActive,
    }));
  };

  const handleLocationChange = (selectedLocations) => {
    setFormState((prevState) => ({
      ...prevState,
      selectedLocations,
    }));
  }; 

  const handleSubmit = () => {
    console.log(poi)
    console.log(poiInfo)
    const selectedPoi = poiList.find(
      (pois) => pois.name.toLowerCase() === poi.toLowerCase() && pois.id !== poiId
    );
    if (selectedPoi && isActive) {
      console.log("selected:");
      console.log(selectedPoi);
      const casinosList = selectedPoi.casinos.join('\n');
      window.alert(`Name Unavailable\n${selectedPoi.name} is already listed at the following casinos:\n${casinosList}`);
      return;
    }
    const newPoiInfo = {
      ...poiInfo,
      name: poi,
      description: description,
      notes: notes,
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
                    name={`toggle-${poi.id}`} 
                    id={`toggle-${poi.id}`} 
                    checked={isActive}
                    onChange={() => handleStatusChange()} className="sr-only peer"/>
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
                onChange={handleEditPoi}
                value={poi}
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
            onChange={handleEditDescription}
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
            onChange={handleEditNotes}
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