import React, {useState, useEffect, useRef} from 'react'
import SingleSelect from '../singleSelect';
import MultiSelect from '../multiSelect';

export const NewPlayerNotesModal = ({ setShowModal, poi }) => {
  
  const modalRef = useRef(null);

  const [formState, setFormState] = useState({
    total: '',
    selectedVisit: {},
    selectedTransactions: [],
  });
  const {total, selectedVisit, selectedTransactions} = formState
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
    return `${transformedDate[0]}\n${transformedDate[1]}`
  }

  const sortedVisits = [...poi.visits].sort((a, b) => new Date(b.arrival) - new Date(a.arrival));
  const options = sortedVisits.map(visit => ({
    value: visit.arrival,
    label: dateTimeTransformer(visit.arrival),
  }));

  useEffect(() => {
    const mostRecentVisit = sortedVisits[0];
    setFormState({
      total: 0,
      selectedVisit: {
        value: mostRecentVisit.arrival,
        label: dateTimeTransformer(mostRecentVisit.arrival),
      },
      selectedTransactions: mostRecentVisit.transactions,
    });

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

    const calculatedTotal = () => {
      if (poi.transactions) {
        poi.transactions.forEach(transaction => {
          console.log(transaction);
        });
      }
    };

    setFormState((prevState) => ({
      ...prevState,
      total: calculatedTotal,
    }));

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  useEffect(() => {
    const calculatedTotal = () => {
      if (poi.transactions) {
        poi.transactions.forEach(transaction => {
          console.log(transaction);
        });
      }
    };

    setFormState((prevState) => ({
      ...prevState,
      total: calculatedTotal,
    }));
  }, [poi.transactions]);

  const handleVisitSelect = (e) => {
    const selectedArrival = e.value;
    const selectedVisit = sortedVisits.find(visit => visit.arrival === selectedArrival);

    if (selectedVisit) {
      setFormState(prevState => ({
        ...prevState,
        selectedVisit: {
          value: selectedVisit.arrival,
          label: dateTimeTransformer(selectedVisit.arrival),
        },
        selectedTransactions: selectedVisit.transactions,
      }));
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
              POI Transactions
            </h3>
          </div>
          {/*body*/}
          <div className="relative p-6 flex-auto">
          <SingleSelect 
              options={options} 
              value={selectedVisit}
              onChange={handleVisitSelect}
            />
            <div className='text-kv-gray mt-2'>Arrival: {selectedVisit.arrival}</div>
            <table className='justify-center items-center mt-2'>
              <thead className=''>
                <tr>
                  <th>Time</th>
                  <th>Buy In</th>
                  <th>Cash Out</th>
                </tr>
              </thead>
              <tbody>
                {selectedTransactions.length > 0 && selectedTransactions.map((item, index) => (
                <React.Fragment key={index}>
                    <tr className={index % 2 === 0 ? 'bg-kv-logo-gray' : 'bg-slate-gray'}>
                        <td className='text-center border border-black p-4'>{timeTransformer(item.date)}</td>
                        <td className='text-center border border-black p-4'>{item.type === 'Buy In' && item.amount}</td>
                        <td className='text-center border border-black p-4'>{item.type === 'Cash Out' && item.amount}</td>
                    </tr>
                    <tr className={index % 2 === 0 ? 'bg-kv-logo-gray' : 'bg-slate-gray'}>
                        <td colSpan={3} className='border border-black p-4'>{item.note}</td>
                    </tr>
                </React.Fragment>
                ))}
            </tbody>

            </table>
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
          </div>
        </div>
      </div>
    </div>
  )
}