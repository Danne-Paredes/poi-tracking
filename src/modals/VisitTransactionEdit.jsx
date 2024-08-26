import React from 'react'
import { useState, useEffect } from 'react';
import { handleStateUpdate, timeTransformer, getAdjustedDateTime, useLongPress, handleTransactionRemove } from '../components/functions';
import SingleSelect from '../components/SingleSelect';

const VisitTransactionEdit = ( props ) => {
    const {   state: parentState,
        setState: setParentState,
        currentPoiList, 
        setCurrentPoiList, 
        inputRef, 
        handleKeyDown, 
        selectedCasino,
        modalClose,
        formState,
        setFormState } = props;

        

    // Destructure 'games' from 'dataValsList' within 'parentState'
    const { dataValsList: { games = [], limits = [] } = {}, index, selectedPoi = { transactions: [] }, transactionDetails, transactionIndex } = parentState;

    const { transactionToEdit, editedDate: date, editedType: type, editedAmount:amount, editedNote: note, editedGame: game  } = formState;

    let current_transactions;
    if (selectedPoi.transactions) {
        current_transactions = selectedPoi.transactions;
    }

    // Use flatMap to combine games and limits
    const options = games.flatMap((game) =>
        limits.map((limit) => ({
        value: `${game}-${limit}`,
        label: `${game.toUpperCase()}-${limit}`, // Label for the option, you can customize this
        }))
    );

        
  

    useEffect(() => {
        inputRef.current.focus();
    }, [])



    return (
    <div className="relative p-6 flex-auto">
    
    
    <div className='text-kv-gray font-bold'>Date:</div>
    <div className='flex justify-center mx-auto items-center text-center block mb-2'>
        <input
            className='block mb-2'
            type="datetime-local"
            value={date}
            onChange={(e)=>handleStateUpdate(e.target.value,'editedDate', setFormState)}
        />
    </div>
    
    <div className='text-kv-gray font-bold' >Type:</div>
    <div className='justify-center mx-auto items-center text-center block mb-2'>
        <label className=' text-kv-gray mr-5'>
            <input 
                className='mr-2'
                onChange={() => handleStateUpdate("Buy In", 'editedType' ,setFormState)} 
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
                    onChange={() => handleStateUpdate("Cash Out", 'editedType', setFormState)} 
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
                    onChange={() => handleStateUpdate("Note", 'editedType', setFormState)} 
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
        <div className='w-full flex justify-center'><SingleSelect
        className =  'mb-2 w-28'
        value={game ? { label: game, value: game } : null}
        options={options}
        onChange={(e) =>handleStateUpdate(e.value, 'editedGame', setFormState)}
        /></div>
        <div className='flex justify-center mx-auto items-center text-center block mb-2'>
        <div className='text-kv-gray font-bold'>Amount:</div>
        <input className='text-center' onKeyDown={handleKeyDown} ref={inputRef} type='number' value={amount}  placeholder='Amount' onChange={(e)=>handleStateUpdate(parseInt(e.target.value),'editedAmount',setFormState)}/>
        </div>
    </>}
    <div className='text-kv-gray font-bold'>Notes:</div>
    <div className='flex justify-center mx-auto items-center text-center block mb-2'>
        <textarea onKeyDown={handleKeyDown} placeholder='Notes' value={note}   onChange={(e)=>handleStateUpdate(e.target.value,'editedNote',setFormState)}></textarea>
    </div>
    </div>
    )
}

export default VisitTransactionEdit