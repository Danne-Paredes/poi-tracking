import React, {useState, useEffect} from 'react'
import SingleSelect from './singleSelect';

const TransactionUI = ({ games, details, madeEdit, handleFormUpdate }) => {

    const options = [ 
        ...games.map((game) => {
           return { value: game, label: game };
        })];

  return (
    <div className="relative p-6 flex-auto">
            <div className='flex justify-center mx-auto items-center text-center block mb-2'>
                <input
                    className='block mb-2'
                    type="datetime-local"
                    defaultValue={details && details.date}
                    onChange={(e)=>handleFormUpdate(e.target.value,'date')}
                />
            </div>
            <div className='justify-center mx-auto items-center text-center block mb-2'>
                <label className=' text-kv-gray mr-5'>
                    <input 
                        className='mr-2'
                        onChange={() => handleFormUpdate("Buy In", 'type')} 
                        type="radio" 
                        value="Buy In" 
                        name="type" 
                        checked={details && details.type === "Buy In"}
                    /> 
                    Buy In
                </label>
                <label className=' text-kv-gray mr-5'>
                    <input 
                        className='mr-2'
                        onChange={() => handleFormUpdate("Cash Out", 'type')} 
                        type="radio" 
                        value="Cash Out" 
                        name="type"
                        checked={details && details.type === "Cash Out"}
                    /> 
                    Cash Out
                </label>
                <label className=' text-kv-gray'>
                    <input 
                        className='mr-2'
                        onChange={() => handleFormUpdate("Note", 'type')} 
                        type="radio" 
                        value="Note" 
                        name="type"
                        checked={details && details.type === "Note"}
                    /> 
                    Note
                </label>
            </div>
            {details && details.type === 'Cash Out' && 
              <div className='w-full flex justify-center'>
                <SingleSelect
                    className =  'mb-2 w-28'
                    value={details && details.game ? { label: details && details.game, value: details && details.game } : null}
                    options={options}
                    onChange={(e) =>{ handleFormUpdate(e.value, 'game')}}
                />
              </div>
            }
            { details && details.type !== "Note" && <div className='flex justify-center mx-auto items-center text-center block mb-2'>
                <input type='number' value={details && details.amount} placeholder='Amount' onChange={(e) => handleFormUpdate(parseInt(e.target.value), 'amount')}/>
                {/* <input onKeyDown={handleKeyDown} ref={inputRef} type='number' value={transactionAmount} placeholder='Amount' onChange={(e) => handleFormUpdate(e, 'transactionAmount')}/> */}
            </div>}
            <div className='flex justify-center mx-auto items-center text-center block mb-2'>
                {/* <textarea  placeholder='Notes' value={note} onChange={(e) => console.log(e)}></textarea> */}
                <textarea  placeholder='Notes' value={details && details.note} onChange={(e) => handleFormUpdate(e.target.value, 'note')}></textarea>
                {/* <textarea onKeyDown={handleKeyDown} placeholder='Notes' value={note} onChange={(e) => handleFormUpdate(e, 'note')}></textarea> */}
            </div>
        </div>

  )
}

export default TransactionUI