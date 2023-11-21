import React, {useState, useEffect, useRef} from 'react'
import { NewPlayerTransactionEditModal } from './NewPlayerTransactionEditModal';
import { AiOutlineEdit, AiOutlinePlusCircle, AiOutlineMinusCircle }  from 'react-icons/ai'
import { updatePoiVisits } from '../../config/firebase';
import SingleSelect from '../singleSelect';
import MultiSelect from '../multiSelect';
import NotesTable from '../NotesTable';
import { dateTransformer, timeTransformer, dateTimeTransformer, useLongPress } from '../functions';
import TransactionUI from '../transactionUI';

export const NewPlayerNotesModal = ({ setShowModal, setOpenEdit, setSelectedVisit, poi, currentPoiList, games, setCurrentPOI }) => {
  
  const modalRef = useRef(null);

  const [openPlayerTransactionEditModal,setOpenPlayerTransactionEditModal] = useState(false)
  const [ editMode, setEditMode ] = useState(false)
  const [visibilityStates, setVisibilityStates] = useState(null);
  const handleLongPress = (index) => {
    // Define the action to be performed on long press
    toggleVisibility(index);
  };
  const longPressEventHandlers = useLongPress(handleLongPress, 500); // 500ms for long press

  const [ sortedVisits, setSortedVisits ] = useState([...poi.visits].sort((a, b) => new Date(b.arrival) - new Date(a.arrival)))
  const [ currentTransaction, setCurrentTransaction ] = useState({
      amount: 0,
      date: '',
      game:'',
      type: 'Buy In',
      note: '',
      edited: false,
  })
  const { amount, date, game, type, note, edited } = currentTransaction
  const [formState, setFormState] = useState({
    total: '',
    selectedVisit: {
      transactions:[]
    },
    winLoss:'',
    curIndex: null,
    editsMade: false,
  });
  const {total, selectedVisit, winLoss, editsMade, curIndex} = formState


  const editedTransaction = (transaction,index) => {
    console.log(transaction)
    console.log(index)
    setCurrentTransaction(transaction)
    setFormState((prev)=>({
      ...prev,
      curIndex: index
    }))
  }





  const handleEdit = (value, formType)=>{

    console.log(currentTransaction)
    !edited && setCurrentTransaction((prevState) => ({
        ...prevState,
        edited: true
    }));
    !editsMade && setFormState((prevState) => ({
        ...prevState,
        editsMade: true
    }));

    setCurrentTransaction((prevState) => ({
        ...prevState,
        [formType]: value,
    }));
  }


  const options = sortedVisits?.map(visit => ({
    value: visit.arrival,
    label: visit.arrival ? dateTimeTransformer(visit.arrival) : '',
    departure: visit.departure
    }));

    const calculatedTotal = () => {
      let total = 0;
      if (selectedVisit.transactions) {
        selectedVisit.transactions.forEach(transaction => {
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
    
    console.log('poi')
    console.log(poi)
    const mostRecentVisit = sortedVisits[0];
    console.log(mostRecentVisit)
    const sortedTransactions = [...mostRecentVisit.transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    setFormState({
      total: calculatedTotal(),
      selectedVisit: {
        value: mostRecentVisit.arrival,
        label: dateTimeTransformer(mostRecentVisit.arrival),
        departure: mostRecentVisit.departure,
        transactions: sortedTransactions
      },
    });
    setSelectedVisit(sortedVisits[0])

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setSelectedVisit([]);
        setSortedVisits([...poi.visits].sort((a, b) => new Date(b.arrival) - new Date(a.arrival)))
        setShowModal(false);
      }
    };

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setSelectedVisit([]);
        setSortedVisits([...poi.visits].sort((a, b) => new Date(b.arrival) - new Date(a.arrival)))
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
    setVisibilityStates(selectedVisit.transactions.map(() => false));
  }, [selectedVisit.transactions]);

  // Toggle function for each transaction
  const toggleVisibility = (index) => {
    setVisibilityStates(states =>
      states.map((state, stateIndex) => (stateIndex === index ? !state : false))
    );
  };


  useEffect(() => {
    setFormState((prevState) => ({
      ...prevState,
      total: calculatedTotal(),
    }));
    selectedVisit?.transactions.map(() => false) // Initialize all as false (hidden)
  }, [selectedVisit]);

  useEffect(() => {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() - 7);
    const adjustedDateTime = currentDate.toISOString().slice(0, 16);
    setCurrentTransaction((prevState) => ({
      ...prevState,
      date: adjustedDateTime,
    }))
  },[])
  

  const handleVisitSelect = (e) => {
    const selectedArrival = e.value;
    const newSelectedVisit = sortedVisits.find(visit => visit.arrival === selectedArrival);
    const newSortedTransactions = [...newSelectedVisit.transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

    if (newSelectedVisit) {
      setSelectedVisit(newSelectedVisit)
      setFormState(prevState => ({
        ...prevState,
        selectedVisit: {
          value: newSelectedVisit.arrival,
          label: dateTimeTransformer(newSelectedVisit.arrival),
          departure: newSelectedVisit.departure,
          transactions: newSortedTransactions
        },
      }));
    }
  };

  const handleVisitRemoval = () => {
    console.log('before')
    console.log(sortedVisits)

    if (window.confirm('Are you sure you want to remove this visit?')) {
      const newVisits = [...sortedVisits];
      const visitIndex = newVisits.findIndex(visit => visit.arrival === selectedVisit.value)

      newVisits.splice(visitIndex,1)
      const newSortedTransactions = [...newVisits[0].transactions].sort((a, b) => new Date(a.date) - new Date(b.date));



      setSortedVisits(newVisits)
      console.log(newVisits[0])
      setFormState(prevState => ({
        ...prevState,
        selectedVisit: {
          value: newVisits[0].arrival,
          label: dateTimeTransformer(newVisits[0].arrival),
          departure: newVisits[0].departure,
          transactions: newSortedTransactions
        },
        editsMade:true
      }))
    }
    
  }

  const removeTransactionAtIndex = (indexToRemove) => {
    setFormState((prevState) => {
        // Clone the transactions array from the current state
        const newTransactions = [...prevState.selectedVisit.transactions];

        // Remove the transaction at the specified index
        newTransactions.splice(indexToRemove, 1);

        // Find the index of the visit in the sortedVisits array
        const visitIndex = sortedVisits.findIndex((visit) => visit.arrival === selectedVisit.value);
        if (visitIndex !== -1) {
            // Clone the sortedVisits array
            const newSortedVisits = [...sortedVisits];

            // Update the transactions of the specific visit
            newSortedVisits[visitIndex] = {
                ...newSortedVisits[visitIndex],
                transactions: newTransactions
            };

            // Update sortedVisits state
            setSortedVisits(newSortedVisits);


        }

        // Return the updated form state
        return {
            ...prevState,
            selectedVisit: {
                ...prevState.selectedVisit,
                transactions: newTransactions
            },
            editsMade:true
        };
    });
};


  const handleTransactionEdit = () => {
    const transactionDetails = type === 'Cash Out' ? { amount: amount, date: date, type: type, note: note, game:game} : { amount: amount, date: date, type: type, note: note };
    const newArray = [...currentPoiList];
    const newArrayIndex = newArray.findIndex((item) => item.id === poi.id);
    const newVisits = newArray[newArrayIndex].visits
    const visitIndex = newVisits.findIndex(visit => visit.arrival === selectedVisit.value);

    const updatedVisit = newVisits[visitIndex]

    console.log(curIndex)
    if (curIndex != null) {
        // Replace the transaction at the specific index
        updatedVisit.transactions[curIndex] = transactionDetails;
    } else {
        // Add a new transaction
        updatedVisit.transactions.push(transactionDetails);
    }
    // newArray[newArrayIndex].visits = newVisits
    newArray[newArrayIndex].visits[visitIndex] = updatedVisit

    console.log(updatedVisit)
    console.log(newVisits.filter((visit)=>visit.departure))
    setSortedVisits(newVisits.sort((a, b) => new Date(b.arrival) - new Date(a.arrival)))

    const sortedTransactions = [...updatedVisit.transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    // const newSelectedVisit = newVisits.find(visit => visit.arrival === selectedVisit.value);
    setSelectedVisit(updatedVisit)
      setFormState(prevState => ({
        ...prevState,
        selectedVisit: {
          ...prevState.selectedVisit,
          value: updatedVisit.arrival,
          label: dateTimeTransformer(updatedVisit.arrival),
          departure: updatedVisit.departure,
          transactions: sortedTransactions,
        }}))

    sessionStorage.setItem('currentPoiList', JSON.stringify(newArray));

    setEditMode(false)


    console.log(transactionDetails)
    console.log(formState)
    console.log(newArray)
  };

  const handleSubmit = () => {

    const newArray = [...currentPoiList];
    const newArrayIndex = newArray.findIndex((item) => item.id === poi.id);
    newArray[newArrayIndex].visits = sortedVisits

    sessionStorage.setItem('currentPoiList', JSON.stringify(newArray));
    updatePoiVisits(poi.id,sortedVisits.filter((visit)=>visit.departure) )

    setFormState((prev)=>({
      ...prev,
      editsMade:false,
    }))
    // setShowModal(false)
    
  }


  return (
    <div
      className="justify-center items-start pt-6 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-dark-denim"
    >
      <div ref={modalRef} className="relative w-auto  mx-auto max-w-3xl xxs:w-2/3">
        {/*content*/}
        <div className="border-0 rounded-lg mt-0 items-center shadow-lg relative flex flex-col w-full bg-dark-leather-2 outline-none focus:outline-none">
          {/*header*/}
          <div onClick={()=>console.log(sortedVisits)}  className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
            <h3 className="text-3xl font-semibold text-center text-kv-gray" >
              POI Visits
            </h3>
          </div>
          {/*body*/}
            <div className="relative p-6 flex-auto">
           
            {editMode ?
                <TransactionUI handleFormUpdate={handleEdit} games={games} details={currentTransaction} />
              
                :
              <> 
                <div className='flex justify-center items-center w-full'>
                  <SingleSelect 
                    options={options} 
                    value={selectedVisit}
                    onChange={handleVisitSelect}
                  />
                  {selectedVisit.value !== sortedVisits[0].arrival && <button className='flex justify-center items-center bg-kv-red hover:bg-kv-logo-gray rounded-full ml-2 w-7 h-7' onClick={()=>handleVisitRemoval()}> <AiOutlineMinusCircle className='w-5 h-5' /></button>}
                </div>
                <div className='text-kv-gray mt-2 text-xl font-bold'>Arrival: {selectedVisit.value ? dateTimeTransformer(selectedVisit.value) : ''}</div>
                <div className='text-kv-gray mt-2 text-xl font-bold '>Departure: {selectedVisit.departure ? dateTimeTransformer(selectedVisit.departure) : ''}</div>
                <NotesTable setEditMode={setEditMode} editedTransaction={editedTransaction}  longPressEventHandlers={longPressEventHandlers} timeTransformer={timeTransformer} setOpenPlayerTransactionEditModal={setOpenPlayerTransactionEditModal} setFormState={setFormState} removeTransactionAtIndex={removeTransactionAtIndex} selectedVisit={selectedVisit} visibilityStates={visibilityStates} poi={poi} />
                <div className='mt-2 text-kv-gray justify-center text-center items-center text-xl font-bold'>Total: <span className={winLoss == 'Win' ? 'text-blue-500' : 'text-kv-red'}>{total}</span></div>
              </>
            }
{/* <div className={selectedVisit.transactions.length > -1 ? 'flex justify-center items-center mt-2' :'hidden'}>
  <button className='btn-xs-red mx-auto ml-2' onClick={()=>
                    {
                      sessionStorage.setItem('currentIndex', JSON.stringify(null));
                      setOpenPlayerTransactionEditModal(true)
                    }
                  }><AiOutlinePlusCircle/></button>
</div> */}




          </div>
          {/*footer*/}

          { editMode ?
                        <>
                          <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                            <button
                              className="btn-close"
                              type="button"
                              onClick={() => {
                                handleEdit(false, 'edited')
                                setFormState((prev)=>({
                                  ...prev,
                                    curIndex: null,
                                    editsMade:false,
                                }))
                                setEditMode(false)
                              }}
                            >
                              Close
                            </button>
                            <button
                              type="button"
                              className={currentTransaction.edited ? 'btn-gray' : 'hidden'}
                              onClick={handleTransactionEdit}
                            >
                              Save Changes
                            </button>
                          </div>
                        </>

                    :

                        <>
                          <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                            <button
                              className="btn-close"
                              type="button"
                              onClick={() => {
                                setSelectedVisit([]);
                                setSortedVisits([...poi.visits].sort((a, b) => new Date(b.arrival) - new Date(a.arrival)))
                                setShowModal(false)
                              }}
                            >
                              Close
                            </button>
                            <button
                              type="button"
                              className={editsMade  ? 'btn-gray' : 'hidden'}
                              onClick={handleSubmit}
                            >
                              Save Changes
                            </button>
                          </div>
                        </>  
          }
        </div>
      </div>
    </div>
  )
}