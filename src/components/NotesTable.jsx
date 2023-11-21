import React, { useState } from 'react'
import { AiOutlineEdit, AiOutlinePlusCircle, AiOutlineMinusCircle }  from 'react-icons/ai'

const NotesTable = ({
    longPressEventHandlers, 
    timeTransformer, 
    setOpenPlayerTransactionEditModal, 
    setFormState, 
    removeTransactionAtIndex, 
    selectedVisit,
    poi,
    visibilityStates,
    setEditMode,
    editedTransaction,
        }) => {


            const [ defaultItem, setDefaultItem ] = useState(()=>{
                const currentDate = new Date();
                currentDate.setHours(currentDate.getHours() - 7);
                const adjustedDateTime = currentDate.toISOString().slice(0, 16);
                const newDefault = {
                    transactionAmount: 0,
                    selectedGame:'',
                    date: adjustedDateTime,
                    type: 'Buy In',
                    note: '',
                    edited: false,}
                return newDefault
            })

    return (
        <table className='justify-center items-center mt-2 border border-kv-gray'>
            <thead>
                <tr>
                    <th className='border border-kv-gray p-4'>Time</th>
                    <th className='border border-kv-gray p-4'>Buy In</th>
                    <th className='border border-kv-gray p-4'>Cash Out</th>
                </tr>
            </thead>
            <tbody>
                {selectedVisit.transactions.length > 0 && selectedVisit.transactions.map((item, index) => 
                    <React.Fragment key={index}>
                        <tr className={index % 2 === 0 ? 'bg-kv-logo-gray' : 'bg-slate-gray'} {...longPressEventHandlers(index)}>
                            <td className='text-center border-r border-b border-black p-4'>{timeTransformer(item.date)}</td>
                            <td className='text-center border-r border-b border-black p-4'>{item.type === 'Buy In' && `$${item.amount.toLocaleString()}`}</td>
                            <td className='text-center border-b border-black p-4'>{item.type === 'Cash Out' && `$${item.amount.toLocaleString()}`}</td>
                        </tr>
                        <tr className={index % 2 === 0 ? 'bg-kv-logo-gray' : 'bg-slate-gray'} {...longPressEventHandlers(index)}>
                            <td colSpan={3} className={index === selectedVisit.transactions.length - 1 ? 'border-b border-kv-gray p-4' : 'border-b border-black p-4'}>{item.game ? `${item.game}: ${item.note}`:item.note}</td>
                        </tr>
                        <tr className={visibilityStates[index] ? 'items-center justify-center mb-2 border-none' : 'hidden'}>

                            <td>
                                <button className={selectedVisit.value !== poi.arrival ? 'btn-xs-red mx-auto ml-2' : 'hidden'} onClick={() => {
                                    editedTransaction(defaultItem, null)
                                    setEditMode(true)
                                    }}><AiOutlinePlusCircle />
                                </button>
                            </td>

                            <td>
                                <button className='btn-xs-red mx-auto' onClick={() => 
                                    {
                                        setFormState(prev => ({ ...prev,
                                            currentTransaction: item
                                    }));
                                    sessionStorage.setItem('currentIndex', JSON.stringify(index));
                                    // setOpenPlayerTransactionEditModal(true);
                                    console.log(item)
                                    console.log(index)
                                    editedTransaction(item,index)
                                    setEditMode(true)
                                    }}><AiOutlineEdit />
                                </button>
                            </td>
                        
                            <td>
                                <button className='btn-xs-red mx-auto' onClick={() => {
                                    if (window.confirm('Are you sure you want to remove this transaction?')) {
                                        //   handlePoiRemove(index);
                                        console.log('remove transaction: ' + index);
                                        removeTransactionAtIndex(index);
                                    }
                                    }}><AiOutlineMinusCircle />
                                </button>
                            </td>
                        </tr>
                    </React.Fragment>)}
            </tbody>
        </table>);
  }

  export default NotesTable