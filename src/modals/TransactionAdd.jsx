import React from 'react'
import { useState, useEffect } from 'react';
import { handleStateUpdate, timeTransformer, getAdjustedDateTime, useLongPress, handleTransactionRemove } from '../components/functions';
import SingleSelect from '../components/SingleSelect';
import TodaysTransaction from '../components/TodaysTransaction';

const TransactionAdd = (props) => {
   
const {   state: parentState,
            setState: setParentState,
            currentPoiList, 
            setCurrentPoiList, 
            inputRef, 
            handleKeyDown, 
            selectedCasino,
            // transactionIndex = null, 
            modalClose } = props;
            

 // Destructure 'games' from 'dataValsList' within 'parentState'
const { dataValsList: { games = [], limits = [], casino_limits = {} } = {}, index, selectedPoi = { transactions: [] }, transactionDetails, transactionIndex } = parentState;

let current_transactions;
if (selectedPoi.transactions) {
  current_transactions = selectedPoi.transactions;
}

const gamesLimits = casino_limits[parentState?.selectedCasino] || null

// Use flatMap to combine games and limits
const options = gamesLimits ? gamesLimits.map((game) => ({
                                                            value: game,
                                                            label: game
                                                          })) : games.flatMap((game) =>
                                                                                        limits.map((limit) => ({
                                                                                          value: `${game}-${limit}`,
                                                                                          label: `${game.toUpperCase()}-${limit}`, // Label for the option, you can customize this
                                                                                        }))
                                                                                      );



         
  const [formState, setFormState] = useState({
    amount: 0,
    date:'',
    type: "Buy In",
    note:'',
    game:''
  });

  const { amount, date, type, note, game} = formState

useEffect(() => {
  inputRef.current.focus();
  setFormState((prev)=>({
    ...prev,
    date: getAdjustedDateTime()
  }))
  if (transactionIndex !== null && current_transactions && current_transactions.length > transactionIndex) {
    const transaction = current_transactions[transactionIndex];
    console.log('transaction')
    if (transaction) {
      setFormState({
        amount: transaction.amount,
        date: transaction.date,
        type: transaction.type,
        note: transaction.note,
        game: transaction.game || ''  // Make sure to handle undefined game
      });
    }}
}, [])

useEffect(() => {
  setParentState((prev)=>({
    ...prev,
    transactionDetails: formState
  }))
}, [formState])

useEffect(() => {
  // console.log('transaction index change')
  // console.log(transactionIndex,current_transactions)
  if (transactionIndex !== null && current_transactions) {
  // if (transactionIndex !== null && current_transactions && current_transactions.length > transactionIndex) {
    const transaction = current_transactions[transactionIndex];
    // console.log('transaction',transaction)
    if (transaction) {
      setFormState({
        amount: transaction.amount,
        date: transaction.date,
        type: transaction.type,
        note: transaction.note,
        game: transaction.game || ''  // Make sure to handle undefined game
      });
    }
  } else {
    setFormState({
      amount: 0,
      date: getAdjustedDateTime(),
      type: "Buy In",
      note: '',
      game: ''
    });
  }
}, [transactionIndex, current_transactions]); 


const handleLongPress = (index) => {
  // Define the action to be performed on long press
  const customAmount = current_transactions[index].type === 'Buy In' ? `+${current_transactions[index].amount}` : `-${current_transactions[index].amount}`
  // console.log(current_transactions[index])
  // console.log('Handling long press on index:', index); // Make sure this logs
  if (window.confirm(`Remove Transaction? \nAmount: ${customAmount}\nTime: ${timeTransformer(current_transactions[index].date)}`)) {
      handleTransactionRemove(index, current_transactions, currentPoiList, setCurrentPoiList, parentState, setFormState)
      handleStateUpdate(null,'transactionIndex',setParentState )
      setFormState({
        amount: 0,
        date: getAdjustedDateTime(),
        type: "Buy In",
        note: '',
        game: ''
      });
  }
};

const longPressEventHandlers = useLongPress(handleLongPress, 500); // 500ms for long press

  return (
    <div className="relative p-6 flex-auto">
      <div className='text-kv-gray font-bold'>Date:</div>
      <div className='flex justify-center mx-auto items-center text-center block mb-2'>
          <input
              className='block mb-2'
              type="datetime-local"
              value={date}
              onChange={(e)=>handleStateUpdate(e.target.value,'date', setFormState)}
          />
      </div>
      <div className='text-kv-gray rounded-md mb-2'>
      {/* <div className='bg-kv-logo-gray rounded-md mb-2'> */}
      {current_transactions && 
        <TodaysTransaction current_transactions={current_transactions}  state={parentState} setState={setParentState} setFormState={setFormState}  longPressEventHandlers={longPressEventHandlers}/>
      }
      </div>
      <div className='text-kv-gray font-bold'>Type:</div>
      <div className='justify-center mx-auto items-center text-center block mb-2'>
          <label className=' text-kv-gray mr-5'>
              <input 
                  className='mr-2'
                  onChange={() => handleStateUpdate("Buy In", 'type' ,setFormState)} 
                  // onClick={()=>console.log(formState)}
                  type="radio" 
                  value="Buy In" 
                  name="type" 
                  checked={type === "Buy In"}  // Ensure it is checked based on type
                  /> 
                    Buy In
              </label>
              <label className=' text-kv-gray mr-5'>
                  <input 
                      className='mr-2'
                      onChange={() => handleStateUpdate("Cash Out", 'type', setFormState)} 
                      type="radio" 
                      value="Cash Out" 
                      name="type"
                      checked={type === "Cash Out"}  // Ensure it is checked based on type
                  /> 
                  Cash Out
              </label>
              <label className=' text-kv-gray'>
                  <input 
                      className='mr-2'
                      onChange={() => handleStateUpdate("Note", 'type', setFormState)} 
                      type="radio" 
                      value="Note" 
                      name="type"
                      checked={type === "Note"}  // Ensure it is checked based on type
                  /> 
              Note
          </label>
      </div>
      { type !== "Note" && 
        <>
          <div className='text-kv-gray font-bold'>Game:</div>
          <div className='w-full flex justify-center'><SingleSelect
            className =  'mb-2 w-28'
            value={game ? { label: game, value: game } : null}
            options={options}
            onChange={(e) =>handleStateUpdate(e.value, 'game', setFormState)}
          /></div>
          <div className='text-kv-gray font-bold'>Amount:</div>
          <div className='flex justify-center mx-auto items-center text-center block mb-2'>
            <input className='text-center' onKeyDown={handleKeyDown} ref={inputRef} type='number' value={amount}  placeholder='Amount' onChange={(e)=>handleStateUpdate(parseInt(e.target.value),'amount',setFormState)}/>
          </div>
        </>
      }
      <div className='text-kv-gray font-bold'>Notes:</div>
      <div className='flex justify-center mx-auto items-center text-center  mb-2'>
          <textarea onKeyDown={handleKeyDown} placeholder='Notes' value={note}   onChange={(e)=>handleStateUpdate(e.target.value,'note',setFormState)}></textarea>
      </div>
  </div>
  )
}

export default TransactionAdd