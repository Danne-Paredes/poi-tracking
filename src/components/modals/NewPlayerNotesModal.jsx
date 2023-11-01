import React, {useState, useEffect, useRef} from 'react'
import { AiOutlineEdit }  from 'react-icons/ai'
import SingleSelect from '../singleSelect';
import MultiSelect from '../multiSelect';
import { dateTransformer, timeTransformer, dateTimeTransformer } from '../functions';

export const NewPlayerNotesModal = ({ setShowModal, setOpenEdit, setSelectedVisit, poi }) => {
  
  const modalRef = useRef(null);

  const [formState, setFormState] = useState({
    total: '',
    selectedVisit: {},
    selectedTransactions: [],
    winLoss:'',
    // sortedVisits: [],
  });
  const {total, selectedVisit, selectedTransactions, winLoss} = formState

  const sortedVisits = [...poi.visits].sort((a, b) => new Date(b.arrival) - new Date(a.arrival))

  const options = sortedVisits?.map(visit => ({
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
    
      // Format the total value to include the dollar sign
      if (total < 0) {
        setFormState((prev)=>({
          ...prev,
          winLoss: 'Loss'}))
        return `-$${Math.abs(total).toLocaleString()}`;
      } else {
        setFormState((prev)=>({
          ...prev,
          winLoss: 'Win'}))
        return `$${total.toLocaleString()}`;
      }
    };
      

  useEffect(() => {
    console.log('sortedVisits')
    console.log(sortedVisits)
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
    setSelectedVisit(sortedVisits[0])

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setSelectedVisit([]);
        setShowModal(false);
      }
    };

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setSelectedVisit([]);
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
      setSelectedVisit(selectedVisit)
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
          <div onClick={()=>console.log(poi)}  className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
            <h3 className="text-3xl font-semibold text-center text-kv-gray" >
              POI Transactions
            </h3>
          </div>
          {/*body*/}
            <div className="relative p-6 flex-auto">
              <div className='flex justify-center items-center w-full'>
                  <SingleSelect 
                    options={options} 
                    value={selectedVisit}
                    onChange={handleVisitSelect}
                  />
                  <button className='flex justify-center items-center bg-kv-logo-gray hover:bg-kv-red rounded-full ml-2 w-7 h-7' onClick={()=>setOpenEdit(true)}><AiOutlineEdit className='w-5 h-5' /></button>
              </div>
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
                <td className='text-center border-r border-b border-black p-4'>{item.type === 'Buy In' && item.amount.toLocaleString()}</td>
                <td className='text-center border-b border-black p-4'>{item.type === 'Cash Out' && item.amount.toLocaleString()}</td>
            </tr>
            <tr className={index % 2 === 0 ? 'bg-kv-logo-gray' : 'bg-slate-gray'}>
                <td colSpan={3} className={index === selectedTransactions.length - 1 ? 'border-b border-kv-gray p-4' : 'border-b border-black p-4'}>{item.note}</td>
            </tr>
        </React.Fragment>
        ))}
    </tbody>
</table>

<div className='mt-2 text-kv-gray justify-center text-center items-center text-xl font-bold'>Total: <span className={winLoss == 'Win' ? 'text-blue-500' : 'text-kv-red'}>{total}</span></div>

          </div>
          {/*footer*/}
          <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
            <button
              className="btn-close"
              type="button"
              onClick={() => {
                setSelectedVisit([]);
                setShowModal(false)
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}