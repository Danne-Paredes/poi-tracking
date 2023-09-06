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
    return `${transformedDate[0]} ${transformedDate[1]}`
  }

  const sortedVisits = [...poi.visits].sort((a, b) => new Date(b.arrival) - new Date(a.arrival));
  const options = sortedVisits.map(visit => ({
    value: visit.arrival,
    label: visit.arrival ? dateTimeTransformer(visit.arrival) : '',
    departure: visit.departure
    }));

    const calculatedTotal = () => {
      let total = 0;
      if (selectedTransactions) {
        selectedTransactions.forEach(transaction => {
          if (transaction.type === 'Buy In') {
            total -= parseInt(transaction.amount, 10);
          } else if (transaction.type === 'Cash Out') {
            total += parseInt(transaction.amount, 10);
          }
        });
      }
      return total;
    };    

  useEffect(() => {
    console.log('poi.visits')
    console.log(poi.visits)
    const mostRecentVisit = sortedVisits[0];
    const sortedTransactions = [...mostRecentVisit.transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    setFormState({
      total: calculatedTotal(),
      selectedVisit: {
        value: mostRecentVisit.arrival,
        label: dateTimeTransformer(mostRecentVisit.arrival),
        departure: mostRecentVisit.departure,
      },
      selectedTransactions: sortedTransactions,
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

    setFormState((prevState) => ({
      ...prevState,
      total: calculatedTotal(),
    }));

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  useEffect(() => {
    setFormState((prevState) => ({
      ...prevState,
      total: calculatedTotal(),
    }));
  }, [selectedTransactions]);
  

  const handleVisitSelect = (e) => {
    const selectedArrival = e.value;
    const selectedVisit = sortedVisits.find(visit => visit.arrival === selectedArrival);
    const sortedTransactions = [...selectedVisit.transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

    if (selectedVisit) {
      setFormState(prevState => ({
        ...prevState,
        selectedVisit: {
          value: selectedVisit.arrival,
          label: dateTimeTransformer(selectedVisit.arrival),
          departure: selectedVisit.departure,
        },
        selectedTransactions: sortedTransactions,
      }));
    }
  };


  return (
    <div
      className="justify-center items-start pt-6 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-dark-denim"
    >
      <div ref={modalRef} className="relative w-auto  mx-auto max-w-3xl xxs:w-2/3">
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
            <div className='text-kv-gray mt-2 text-xl font-bold'>Arrival: {selectedVisit.value ? dateTimeTransformer(selectedVisit.value) : ''}</div>
            <div className='text-kv-gray mt-2 text-xl font-bold '>Departure: {selectedVisit.departure ? dateTimeTransformer(selectedVisit.departure) : ''}</div>
            <table className='justify-center items-center mt-2 border border-kv-gray'>
    <thead>
        <tr>
            <th className='border border-kv-gray p-4'>Time</th>
            <th className='border border-kv-gray p-4'>Buy In</th>
            <th className='border border-kv-gray p-4'>Cash Out</th>
        </tr>
    </thead>
    <tbody>
        {selectedTransactions.length > 0 && selectedTransactions.map((item, index) => (
        <React.Fragment key={index}>
            <tr className={index % 2 === 0 ? 'bg-kv-logo-gray' : 'bg-slate-gray'}>
                <td className='text-center border-r border-b border-black p-4'>{timeTransformer(item.date)}</td>
                <td className='text-center border-r border-b border-black p-4'>{item.type === 'Buy In' && item.amount}</td>
                <td className='text-center border-b border-black p-4'>{item.type === 'Cash Out' && item.amount}</td>
            </tr>
            <tr className={index % 2 === 0 ? 'bg-kv-logo-gray' : 'bg-slate-gray'}>
                <td colSpan={3} className={index === selectedTransactions.length - 1 ? 'border-b border-kv-gray p-4' : 'border-b border-black p-4'}>{item.note}</td>
            </tr>
        </React.Fragment>
        ))}
    </tbody>
</table>

<div className='mt-2 text-kv-gray justify-center text-center items-center text-xl font-bold'>Total: <span className={total >= 0 ? 'text-blue-500' : 'text-kv-red'}>${total}</span></div>

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