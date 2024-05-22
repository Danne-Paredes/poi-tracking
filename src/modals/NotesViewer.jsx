import React, {useState, useEffect, } from 'react'
import SingleSelect from '../components/SingleSelect';
import { AiOutlineMinusCircle } from 'react-icons/ai';
import { handleStateUpdate, dateTimeTransformer, timeTransformer, getAdjustedDateTime, useLongPress, removePastVisitTransaction, removePastVisit } from '../components/functions';
import TodaysTransaction from '../components/TodaysTransaction';
import VisitTransactionEdit from './VisitTransactionEdit';

const NotesViewer = (props) => {
    const {   state: parentState,
        setState: setParentState,
        currentPoiList, 
        setCurrentPoiList, 
        inputRef, 
        handleKeyDown, 
        selectedCasino,
        modalClose } = props;
    const { selectedVisit = {transactions: []} } = parentState
    const [ formState, setFormState ] = useState({
      selectedVisit: {
        transactions:[]
      },
      sortedVisits: [],
      editMode: false,
      // transactionToEdit: {
      //     arrival: '',
      //     departure: '',
      //     type: '',
      //     amount: '',
      //     date: '',
      //     note: '',
      // },
      editedArrival:'',
      editedDeparture:'',
      editedType:'',
      editedGame:'',
      editedAmount:'',
      editedDate:'',
      editedNote:'',
    })

    // const { selectedVisit, sortedVisits, editMode, transactionToEdit,
    const { sortedVisits, editMode, transactionToEdit,
      editedArrival,editedDeparture,editedType,editedGame,editedAmount,
      editedDate,editedNote, total, winLoss } = formState

      const calculatedTotal = () => {
        let total = 0;
        if (selectedVisit.transactions) {
          selectedVisit.transactions.forEach(transaction => {
            if (transaction.type === 'Buy In') {
              console.log(`+${transaction.amount}`)
              total -= parseInt(transaction.amount, 10);
            } else if (transaction.type === 'Cash Out') {
              console.log(`-${transaction.amount}`)
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

    const [ options, setOptions ] = useState([])
    useEffect(() => {
      const newPoi = parentState.selectedPoi
      // const todaysVisit = {
      //                       arrival: newPoi.arrival,
      //                       casino: parentState.selectedCasino,
      //                       id: newPoi.visitId,
      //                       transactions: newPoi.transactions
      //                     }
      // const allVisits = [
      //                     ...newPoi.visits,
      //                     todaysVisit
      //                   ]
      const newSortedVisits = [...newPoi.visits].sort((a, b) => new Date(b.arrival) - new Date(a.arrival))

      setOptions(newSortedVisits.map(visit => ({
        value: visit.arrival,
        label: visit.arrival ? dateTimeTransformer(visit.arrival) : '',
        departure: visit.departure
        })))

      const newSelectedVisit = {
        value: newSortedVisits[0]?.arrival || '',
        label: dateTimeTransformer(newSortedVisits[0]?.arrival) || '',
        departure: newSortedVisits[0]?.departure || '',
        id: newSortedVisits[0]?.id || '',
        user: newSortedVisits[0]?.user || '',
        casino: newSortedVisits[0]?.casino || '',
        transactions: newSortedVisits[0]?.transactions || []
      }
      // console.log('newSelectedVisit')
      // console.log(newSelectedVisit)
      handleStateUpdate(newSelectedVisit, 'selectedVisit', setParentState)
      // handleStateUpdate(newSelectedVisit, 'selectedVisit', setFormState)
      handleStateUpdate(newSortedVisits, 'sortedVisits', setFormState)
      handleStateUpdate(calculatedTotal(), 'total', setFormState)

    }, [])

    useEffect(() => {
      // console.log('transactionToEdit',transactionToEdit)
      handleStateUpdate(transactionToEdit?.arrival || '', 'editedArrival', setFormState);
      handleStateUpdate(transactionToEdit?.departure || '', 'editedDeparture', setFormState);
      handleStateUpdate(transactionToEdit?.type || '', 'editedType', setFormState);
      handleStateUpdate(transactionToEdit?.game || '', 'editedGame', setFormState);
      handleStateUpdate(transactionToEdit?.amount , 'editedAmount', setFormState);
      handleStateUpdate(transactionToEdit?.date || '', 'editedDate', setFormState);
      handleStateUpdate(transactionToEdit?.note || '', 'editedNote', setFormState);

      const editedVisit = {...selectedVisit}

    
      
    }, [transactionToEdit])
    useEffect(() => {


      const editedVisit = {
                            arrival: editedArrival,
                            departure:editedDeparture,
                            transactions: selectedVisit.transactions,
                            id: selectedVisit.id,
                            user: selectedVisit.user,
                            casino: selectedVisit.casino
                          }
      const editedTransaction = {
                                  type: editedType,
                                  game: editedGame,
                                  amount: editedAmount,
                                  date: editedDate,
                                  note: editedNote,
                                }
      
      if (parentState.transactionIndex !== null) { 
                                  
        // console.log("parentState.transactionIndex",parentState.transactionIndex)
        editedVisit.transactions[parentState.transactionIndex] = editedTransaction
      } else {

        handleStateUpdate(editedTransaction,'transactionToAddToPastVisit',setParentState)
      }

      handleStateUpdate(editedVisit,'editedVisit',setParentState)
      handleStateUpdate(calculatedTotal(), 'total', setFormState)
      // handleStateUpdate(editedVisit,'selectedVisit',setFormState)
      // console.log("editedVisit",editedVisit)

    
      
    }, [editedArrival,editedDeparture,editedType,editedGame,editedAmount,editedDate,editedNote])


    

    const handleVisitSelect = (selectedArrival) =>{
      // const selectedArrival = e.value;
      const newSelectedVisit = sortedVisits.find(visit => visit.arrival === selectedArrival);
      // console.log(newSelectedVisit)
      // console.log(sortedVisits)
      const newSortedTransactions = [...newSelectedVisit.transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

      if (newSelectedVisit) {
        // setSelectedVisit(newSelectedVisit)
        setParentState(prevState => ({
          ...prevState,
          selectedVisit: {
            value: newSelectedVisit.arrival,
            label: dateTimeTransformer(newSelectedVisit.arrival),
            departure: newSelectedVisit.departure,
            id: newSelectedVisit.id,
            user: newSelectedVisit.user,
            casino: newSelectedVisit.casino,
            transactions: newSortedTransactions
          }}))
        setFormState(prevState => ({
          ...prevState,
          // selectedVisit: {
          //   value: newSelectedVisit.arrival,
          //   label: dateTimeTransformer(newSelectedVisit.arrival),
          //   departure: newSelectedVisit.departure,
          //   id: newSelectedVisit.id,
          //   user: newSelectedVisit.user,
          //   casino: newSelectedVisit.casino,
          //   transactions: newSortedTransactions
          // },
          editedArrival: null,
          editedDeparture: null,
          editedDate: null,
          editedType: null,
          editedAmount: null,
          editedGame: null,
          editedNote: null,
          // total:calculatedTotal()
        }));
      }
    }

    useEffect(() => {
      handleStateUpdate(calculatedTotal(), 'total', setFormState)
    }, [selectedVisit])
    
    

    const handleLongPress = (index) => {
      // Define the action to be performed on long press
      const customAmount = selectedVisit.transactions[index].type === 'Buy In' ? `+${selectedVisit.transactions[index].amount}` : `-${selectedVisit.transactions[index].amount}`

      if (window.confirm(`Remove Transaction? \nAmount: ${customAmount}\nTime: ${timeTransformer(selectedVisit.transactions[index].date)}`)) {
          // handleStateUpdate(null,'transactionIndex',setParentState )
          removePastVisitTransaction( index, parentState, setParentState, currentPoiList, setCurrentPoiList )
      }
    };
    
    const longPressEventHandlers = useLongPress(handleLongPress, 500); // 500ms for long press

    const newProps = {
      ...props,
      formState,
      setFormState,
    }

  return (
    <div className="relative p-6 flex-auto" >
    {/* <div className="relative p-6 flex-auto" onClick={()=>console.log(formState)}> */}
      <div className='flex justify-center items-center w-full'>
          <SingleSelect 
                      options={options} 
                      value={selectedVisit}
                      onChange={(e)=>handleVisitSelect(e.value)}
                    />
        {selectedVisit.departure && <button className={`flex justify-center items-center bg-kv-red hover:bg-kv-logo-gray rounded-full ml-2 w-7 h-7 `}
                                            onClick={() => {
                                                            // const customAmount = selectedVisit.transactions[index].type === 'Buy In' ? `+${selectedVisit.transactions[index].amount}` : `-${selectedVisit.transactions[index].amount}`
                                                            if (window.confirm(`Remove Visit?`)) {
                                                              removePastVisit(parentState, setParentState, currentPoiList, setCurrentPoiList, handleVisitSelect, setOptions )
                                                            }
                                                            }}>
                                              <AiOutlineMinusCircle className='w-5 h-5' /></button>}
      </div>
      
      <div className='text-kv-gray rounded-md mb-2'>
        { selectedVisit?.transactions && 
          <TodaysTransaction current_transactions={selectedVisit.transactions} state={parentState} setState={setParentState} setFormState={setFormState} longPressEventHandlers={longPressEventHandlers} current_visit={selectedVisit} formState={formState}/>
        }
        <div className='mt-2 text-kv-gray justify-center text-center items-center text-xl font-bold'>Total: <span className={winLoss == 'Win' ? 'text-blue-500' : 'text-kv-red'}>{total}</span></div>
      </div>
      {/* {parentState.notesEditMode && <div>hi</div>} */}
      {parentState.notesEditMode && <VisitTransactionEdit {...newProps}/>}
    </div>
  )
}

export default NotesViewer