import React, {useState, useEffect, } from 'react'
import SingleSelect from '../components/SingleSelect';
import MultiSelect from '../components/MultiSelect';

import { getAdjustedDateTime, timeTransformer, handleStateUpdate, useLongPress, handleTransactionRemove } from '../components/functions';
import TodaysTransaction from '../components/TodaysTransaction';

const ArriveDepart = (props) => {
    const {   state: parentState,
        setState: setParentState,
        currentPoiList, 
        setCurrentPoiList, 
        inputRef, 
        handleKeyDown, 
        selectedCasino, 
        modalClose } = props;


    const [formState, setFormState] = useState({
        updatedPoi: parentState.selectedPoi || [],
        selectedDepartureDateTime: getAdjustedDateTime(),
        type: 'Arrival',
        arrival:parentState.selectedPoi.arrival,
        });
    const { selectedDepartureDateTime,arrival, updatedPoi, type, total, winLoss } = formState;

    const calculatedTotal = () => {
        let total = 0;
        if (parentState.selectedPoi?.transactions) {
          parentState.selectedPoi?.transactions.forEach(transaction => {
            if (transaction.type === 'Buy In') {
              // console.log(`+${transaction.amount}`)
              total -= parseInt(transaction.amount, 10);
            } else if (transaction.type === 'Cash Out') {
              // console.log(`-${transaction.amount}`)
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
        inputRef.current.focus();
        setParentState((prev)=>({
            ...prev,
            updatedDeparture: null
        }))
        handleStateUpdate(calculatedTotal(), 'total', setFormState)
    
    }, [])

    useEffect(() => {
        const newPoi = {...updatedPoi}

        if (type === 'Arrival') {
            setParentState((prev)=>({
                ...prev,
                updatedArrival: arrival,
            }))
        } else {
            newPoi.departure = selectedDepartureDateTime
            setParentState((prev)=>({
                ...prev,
                updatedDeparture: selectedDepartureDateTime,
            }))
        }
    
        // console.log(newPoi)

    }, [selectedDepartureDateTime,arrival])
    
    const handleLongPress = (index) => {
        // Define the action to be performed on long press
        const customAmount = updatedPoi.transactions[index].type === 'Buy In' ? `+${updatedPoi.transactions[index].amount}` : `-${updatedPoi.transactions[index].amount}`
        console.log(updatedPoi.transactions[index])
        console.log('Handling long press on index:', index); // Make sure this logs
        if (window.confirm(`Remove Transaction? \nAmount: ${customAmount}\nTime: ${timeTransformer(updatedPoi.transactions[index].date)}`)) {
            handleTransactionRemove(index, updatedPoi.transactions, currentPoiList, setCurrentPoiList, parentState, setFormState)
            handleStateUpdate(calculatedTotal(), 'total', setFormState)
        }
      };
      
    const longPressEventHandlers = useLongPress(handleLongPress, 500); // 500ms for long press

  return (
    <div className="relative p-6 flex-auto">
        <label className=' text-kv-gray mr-5'>
            <input 
                ref={inputRef}
                className='mr-2'
                onKeyDown={handleKeyDown}
                onChange={() => handleStateUpdate("Arrival", 'type', setFormState)} 
                type="radio" 
                value="Arrival" 
                checked={type === "Arrival"}
            /> 
            Arrival
        </label>
        <label className=' text-kv-gray'>
            <input 
                className='mr-2 mb-5'
                onKeyDown={handleKeyDown}
                onChange={() => {
                    
                    handleStateUpdate(getAdjustedDateTime(), 'updatedDeparture', setParentState)
                    handleStateUpdate("Departure", 'type', setFormState)
                    }} 
                type="radio" 
                value="Departure" 
                checked={type === "Departure"}
            /> 
            Departure
        </label>
        <div className='flex justify-center mx-auto items-center text-center block mb-2'>
            { type == 'Arrival' && <input
                ref={inputRef}
                onKeyDown={handleKeyDown}
                className='block mb-2'
                type="datetime-local"
                defaultValue={updatedPoi.arrival}
                onChange={(e)=>handleStateUpdate(e.target.value, 'arrival', setFormState)}
            />}
            { type == 'Departure' && <input
                onKeyDown={handleKeyDown}
                className='block mb-2'
                type="datetime-local"
                defaultValue={selectedDepartureDateTime}
                onChange={(e)=>handleStateUpdate(e.target.value, 'selectedDepartureDateTime', setFormState)}
            />}
        </div>
        <div className='text-kv-gray rounded-md'>
        {/* <div className='bg-kv-logo-gray rounded-md'> */}
        {updatedPoi.transactions && 
           <TodaysTransaction current_transactions={updatedPoi.transactions} state={parentState} setState={setParentState} longPressEventHandlers={longPressEventHandlers}/>
        }
        <div className='mt-2 text-kv-gray justify-center text-center items-center text-xl font-bold'>Total: <span className={winLoss == 'Win' ? 'text-blue-500' : 'text-kv-red'}>{total}</span></div>
        </div>
    </div>
  )
}

export default ArriveDepart