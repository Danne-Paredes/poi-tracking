import React, {useState, useEffect, useRef} from 'react'
import SingleSelect from '../singleSelect';
import MultiSelect from '../multiSelect';

export const NewPlayerArriveDepartModal = ({ setShowModal, addPoi, poi,index, poiList }) => {
  const [formState, setFormState] = useState({
    updatedPoi: poi,
    selectedDepartureDateTime: '',
    type: 'Arrival',
  });

  const inputRef = useRef(null);
  const modalRef = useRef(null);

  const { updatedPoi, selectedDepartureDateTime, type } = formState;

  // sets current date/time to the departure input allowing for a 1 click close if player
  // is departing now vs a custom time
  useEffect(() => {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() - 7);
    const adjustedDateTime = currentDate.toISOString().slice(0, 16);
    setFormState((prevState) => ({
      ...prevState,
      selectedDepartureDateTime: adjustedDateTime,
    }));

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
        setFormState((prevState) => ({
          ...prevState,
          updatedPoi: newEntry,
        }));
        return;
      }
    }
    }, []);


  // sets focus
  useEffect(() => {
    if (setShowModal(true) && inputRef.current) {
      inputRef.current.focus();
    }
    const handleEscape = (event) => {
      if (event.key === 'Escape' && setShowModal(true)) {
        setShowModal(false);
      }
    };
  
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) && setShowModal(true)) {
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

  const handleArrivalDateTimeChange = (event) => {
    const inputDate = event.target.value;
    const newEntry = {
      ...updatedPoi,
      arrival: inputDate,
    };
    setFormState((prevState) => ({
      ...prevState,
      updatedPoi: newEntry,
    }));
  };

  const handleDepartDateTimeChange = (event) => {
    const inputDate = event.target.value;
    setFormState((prevState) => ({
      ...prevState,
      selectedDepartureDateTime: inputDate,
    }));
  };
  
  useEffect(() => {
    console.log('index')
    console.log(index)
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() - 7);
    const adjustedDateTime = currentDate.toISOString().slice(0, 16);
    setFormState((prevState) => ({
      ...prevState,
      selectedDepartureDateTime: adjustedDateTime,
    }));
  }, []);

  const handleTypeChange = (type)=>{
    setFormState((prevState) => ({
        ...prevState,
        type: type,
    }));
    console.log(`type: ${type}`)
}

  const handleSubmit = ()=>{
    const newEntry = {
      ...updatedPoi,
      departure: selectedDepartureDateTime,
    };
    console.log('updatedPoi')
    console.log(updatedPoi)
    console.log('newEntry')
    console.log(newEntry)
    type =='Arrival'? addPoi(updatedPoi,index): addPoi(newEntry,index);
  }


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
              {type === 'Arrival' ? <h1>Update Arrival</h1> :<h1> Set Departure</h1>}
            </h3>
          </div>
          {/*body*/}
          <div className="relative p-6 flex-auto">
            <div className='flex justify-center mx-auto items-center text-center block mb-2'>
                { type == 'Arrival' && <input
                    className='block mb-2'
                    type="datetime-local"
                    defaultValue={poi.arrival}
                    onChange={handleArrivalDateTimeChange}
                />}
                { type == 'Departure' && <input
                    className='block mb-2'
                    type="datetime-local"
                    defaultValue={selectedDepartureDateTime}
                    onChange={handleDepartDateTimeChange}
                />}
            </div>
            <label className=' text-kv-gray mr-5'>
              <input 
                  className='mr-2'
                  onChange={() => handleTypeChange("Arrival")} 
                  type="radio" 
                  value="Arrival" 
                  checked={type === "Arrival"}
              /> 
              Arrival
            </label>
            <label className=' text-kv-gray'>
                <input 
                    className='mr-2'
                    onChange={() => handleTypeChange("Departure")} 
                    type="radio" 
                    value="Departure" 
                    checked={type === "Departure"}
                /> 
                Departure
            </label>
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