import React, {useState, useEffect, useRef} from 'react'
import SingleSelect from '../singleSelect';
import MultiSelect from '../multiSelect';

export const NewPlayerTransactionEditModal = ({ setShowModal, poi, index, casinos, preSelectedVisit }) => {
  const [formState, setFormState] = useState({
    data:  { visits: [] },
    selectedVisit: [],
    selectedVisitIndex: '',
  });
  const { data, selectedVisit, selectedVisitIndex } = formState;

  const dateTransformer = (date) => {
    const transformedDate = date.split('T')
    return transformedDate[0]
  }

  const timeTransformer = (date) => {
    const transformedDate = date.split('T')
    return transformedDate[1]
  }

  const dateTimeTransformer = (date) => {
    const transformedDate = date.split('T')
    return `${transformedDate[0]} ${transformedDate[1]}`
  }

  const options = data && data.visits 
    ? data.visits.map((visit) => {
         return { value: visit.arrival, label: dateTimeTransformer(visit.arrival) };
      })
    : [];
  const casinoOptions = casinos && casinos 
    ? casinos.map((casino) => {
         return { value: casino, label: casino };
      })
    : [];



  const handleVisitChange = (selectedOption) => {
    const matchingVisit = data.visits.find(visit => visit.arrival === selectedOption.value)
    const matchingVisitIndex = data.visits.findIndex(visit => visit.arrival === selectedOption.value);

    setFormState((prev)=>({
      ...prev,
      selectedVisit: matchingVisit,
      selectedVisitIndex: matchingVisitIndex,
    }));
  };

  const handleDataChange = (updatedData) => {
    setFormState((prev) => ({
        ...prev,
        data: updatedData,
    }));
  };
  const inputRef = useRef(null);
  const modalRef = useRef(null);


  
  useEffect(() => {
    console.log('index')
    console.log(index)
    console.log('poi')
    console.log(poi)
    setFormState((prev) => ({
      ...prev,
      data: poi,
      selectedVisit: preSelectedVisit,
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
      // handleSubmit();
    }
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
            Edit Visits & Transaction
          </h3>
        </div>
        {/*body*/}
        <div className="relative p-6 flex-auto">
        <button onClick={()=>console.log(data)}>poi</button>
        <h1 className='text-kv-gray'>{data.name}</h1>
        <p className='text-kv-gray'>{data.description}</p>
        <SingleSelect
          className="max-w-xs snap-center"
          onChange={handleVisitChange}
          value={selectedVisit.arrival ? { label: dateTimeTransformer(selectedVisit.arrival), value: selectedVisit.arrival } : null}
          options={options}
          placeholder='Select A Visit'
        />
        {data && selectedVisit.arrival &&
        <>
          <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-1/2 p-2">
              <h2 className='text-kv-gray'>
                  Arrival: 
                  {selectedVisit.arrival ? 
                      <input
                      className='justify-center mx-auto items-center text-center block mb-2 text-black'
                      type="datetime-local"
                      value={selectedVisit.arrival}
                      onChange={(e) => {
                        const updatedVisits = [...data.visits];
                        updatedVisits[selectedVisitIndex].arrival = e.target.value;
                        handleDataChange({ ...data, visits: updatedVisits });

                        // const matchingVisit = data.visits[selectedVisitIndex]
                        // setFormState((prev)=>({
                        //   ...prev,
                        //   selectedVisit:updatedVisits[selectedVisitIndex],
                        // }));
                      }}
                      />
                      : null}
              </h2>
          </div>
          <div className="w-full sm:w-1/2 p-2">
              <h2 className='text-kv-gray'>
                  Departure: 
                  {selectedVisit.departure ? 
                      <input
                      className='justify-center mx-auto items-center text-center block mb-2 text-black'
                      type="datetime-local"
                      value={selectedVisit.departure}
                      onChange={(e) => {
                        const updatedVisits = [...data.visits];
                        updatedVisits[selectedVisitIndex].departure = e.target.value;
                        handleDataChange({ ...data, visits: updatedVisits });
                      }}
                      />
                      : null}
              </h2>
          </div>
      </div>
          <div className="w-full p-2">
              <label className='text-kv-gray'>
                  Casino:
                  <SingleSelect
                      className="max-w-xs snap-center"
                      value={selectedVisit.casino ? { label: selectedVisit.casino, value: selectedVisit.casino } : null}
                      options={casinoOptions}
                      placeholder='Select a casino'
                      onChange={(e) => {
                        const updatedVisits = [...data.visits];
                        updatedVisits[selectedVisitIndex].casino = e.value;
                        handleDataChange({ ...data, visits: updatedVisits });
                      }}
                      />
              </label>
          </div>
      
        </>

        } 
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
            // onClick={handleSubmit}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
  )
}