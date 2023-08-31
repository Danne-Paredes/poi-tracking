import React, {useState, useEffect, useRef} from 'react'
import SingleSelect from '../singleSelect';

export const NewPlayerAddModal = ({ setShowModal, addPoi, poiInfo, casinos, selectedCasino }) => {
  const [formState, setFormState] = useState({
    poi: '',
    poiId: '',
    isNew: false,
    poiList: [],
    selectedDateTime: '',
    selectedLocations: [],
  });

  const options = [ 
    ...poiInfo.map((poi) => {
       return { value: poi.name, label: poi.name };
    })];

  const { poi, poiId, isNew, selectedDateTime, selectedLocations, poiList } = formState;
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
    setFormState((prevState) => ({
      ...prevState,
      isNew: !prevState.isNew,
    }));
    console.log(isNew);
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
    if (setShowModal && inputRef.current) {
      inputRef.current.focus();
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape' && setShowModal) {
        setShowModal(false);
      }
    };

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) && setShowModal) {
        setShowModal(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowModal]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
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

  return (
    <div
      className="justify-center items-start pt-6 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-dark-denim"
    >
      <div className="relative w-auto  mx-auto max-w-3xl">
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
              type="datetime-local"
              defaultValue={selectedDateTime}
              onChange={handleDateTimeChange}
            />
            <br/>
            <label className='text-kv-gray'>New POI:</label>
            <input type="checkbox" checked={isNew} onChange={handleIsNewChange} />
            <br/>
            {!isNew && (
              <SingleSelect ref={inputRef} id="pois" onKeyDown={handleKeyDown} onChange={handleAddPoi} className="max-w-xs" value={poi.name ? { label: poi.name, value: poi.name } : null} options={options} placeholder='Select a Player'/>
            )}
          </div>
          {/*footer*/}
          <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
            <button
              className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
            <button
              className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
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