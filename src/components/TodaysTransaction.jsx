import React, { useState } from 'react'
import { handleStateUpdate, timeTransformer, dateTimeTransformer, } from './functions'
import { AiOutlinePlusCircle, AiOutlineEdit } from 'react-icons/ai'


const TodaysTransaction = ({current_transactions, state,  setState, longPressEventHandlers, setFormState=null, current_visit = {label:null}, formState}) => {
    const [isHovered, setIsHovered] = useState(false);
    // const { editedArrival, editedDeparture } = formState
    const handleEdit = (index)=> {
        if (state.selectedModal !== 'notesViewer'){
            if (state.selectedModal !== 'transactionAdd'){
                handleStateUpdate('transactionAdd','selectedModal',setState )
                handleStateUpdate(index,'transactionIndex',setState )
                handleStateUpdate(current_transactions[index], 'transactionDetails', setState)
            }
            handleStateUpdate(index,'transactionIndex',setState )
            handleStateUpdate(current_transactions[index], 'transactionDetails', setState)
            setFormState != null && setFormState(current_transactions[index])
        // console.log(state)
        // console.log(current_transactions[index])
        } else {
            const transactionToEdit = {
                arrival: current_visit.value,
                departure: current_visit.departure,
                type: current_visit.transactions[index].type,
                game: current_visit.transactions[index].game || '',
                amount: current_visit.transactions[index].amount,
                date: current_visit.transactions[index].date,
                note: current_visit.transactions[index].note || '',
            }

            // handleStateUpdate(true, 'editMode', setFormState)
            handleStateUpdate(true, 'notesEditMode', setState)
            handleStateUpdate(transactionToEdit, 'transactionToEdit', setFormState)
            handleStateUpdate(index, 'transactionIndex', setState)
            // handleStateUpdate(transactionToEdit, 'transactionToEdit', setFormState)
            // handleStateUpdate(index, 'transactionIndex', setFormState)
        }
    }

    const handleAddTransactionToPastVisit = () =>{
        // console.log('yo')
        const transactionToEdit = {
            arrival: current_visit.value,
            departure: current_visit.departure,
            type: 'Buy In',
            game: '',
            amount: 0,
            date: current_visit.value,
            note:  '',
        }
        handleStateUpdate(true, 'notesEditMode', setState)
        handleStateUpdate(transactionToEdit, 'transactionToEdit', setFormState)
        handleStateUpdate(true, 'addToPastVisit', setState)
    }

  return (
    <>
        {state.selectedModal === 'notesViewer' && current_visit.departure && (
            !state.notesEditMode ? (
                <>
                    <div className='text-center font-bold p-1' onClick={()=>console.log(state)}>{`Arrival: ${current_visit.label}`}</div>
                    <div className='text-center font-bold p-1' onClick={()=>console.log(current_visit)}>{`Departure: ${dateTimeTransformer(current_visit.departure)}`}</div>
                </>
            ) : (
                <>
                    <div className='text-kv-gray font-bold'>Arrival:</div>
                    <div className='flex justify-center mx-auto items-center text-center text-black block mb-2'>
                        <input
                            className='block mb-2'
                            type="datetime-local"
                            value={formState?.editedArrival}
                            // onChange={(e)=>console.log(e)}
                            onChange={(e)=>handleStateUpdate(e.target.value,'editedArrival', setFormState)}
                        />
                    </div>
                    <div className='text-kv-gray font-bold'>Departure:</div>
                    <div className='flex justify-center text-black mx-auto items-center text-center block mb-2'>
                        <input
                            className='block mb-2'
                            type="datetime-local"
                            value={formState?.editedDeparture}
                            onChange={(e)=>handleStateUpdate(e.target.value,'editedDeparture', setFormState)}
                        />
                    </div>
                </>
            )
        )}
        <div className='text-kv-gray font-bold text-center'>Transactions:</div>
        <div className="flex flex-col justify-center items-center">
            <ul className='list-none font-bold'>
            {current_transactions.filter(transaction => transaction.type !== "Note").map((transaction, index) => (
                <li 
                    key={index} 
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    {...longPressEventHandlers(index)}
                    className={`group flex justify-between items-center px-4 ${state?.transactionIndex === index ? 'bg-kv-red':''} ${formState?.transactionIndex === index ? 'bg-kv-red':''}`}
                >
                    <div className="flex flex-col flex-1">
                    <div className="flex space-x-4 justify-between pr-2">
                        <span>{timeTransformer(transaction.date)}</span>
                        <span>{transaction.type === 'Buy In' ? `+$${transaction.amount.toLocaleString()}` : `-$${transaction.amount.toLocaleString()}`}</span>
                        <span>{`${transaction.game}`}</span>
                    </div>
                    {transaction.note && (
                        <div className="flex justify-center mt-2">
                        <span className="text-center">{transaction.note}</span>
                        </div>
                    )}
                    </div>
                    <div className="flex items-center justify-center">
                    <button className="btn-xxs invisible group-hover:visible" onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(index);
                    }}>
                        <AiOutlineEdit size="1em"/>
                    </button>
                    </div>
                </li>
                ))}

            </ul>
            {state.selectedModal === 'notesViewer' && current_visit.departure && !state.notesEditMode && (
                <div className="flex justify-center w-full mt-4"> {/* Ensures the button is centered under the list */}
                    <button className="flex  text-black justify-center items-center bg-kv-red hover:bg-kv-logo-gray rounded-full w-7 h-7"
                        onClick={handleAddTransactionToPastVisit}
                        >
                        <AiOutlinePlusCircle/>
                    </button>
                </div>
            )}
        </div>

    </>
  )
}

export default TodaysTransaction