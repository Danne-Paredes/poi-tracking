import React, { useState, useEffect } from 'react'
import { AiOutlinePlusCircle, AiOutlineMinusCircle, AiOutlineEdit } from 'react-icons/ai'
import { timeTransformer } from './functions';

const SelectedVisit = ({ selectedVisit, removeTransactionAtIndex } ) => {
    // State to manage the visibility of each transaction
  const [visibilityStates, setVisibilityStates] = useState(
    selectedVisit?.transactions.map(() => false) // Initialize all as false (hidden)
  );

  useEffect(() => {
    setVisibilityStates(selectedVisit.transactions.map(() => false));
  }, [selectedVisit.transactions]);
  // Toggle function for each transaction
  const toggleVisibility = (index) => {
    setVisibilityStates(states =>
      states.map((state, stateIndex) => (stateIndex === index ? !state : false))
    );
  };

  

  return (
    <>
        {selectedVisit.transactions && selectedVisit.transactions.map((transaction, index) => (
        <div key={index}>
          <div 
            className={(index % 2 === 0 ? 'bg-kv-logo-gray' : 'bg-slate-gray') + 
              ' p-2  mx-auto flex flex-col items-center mb-2 border-kv-gray border-4'}
            onClick={() => toggleVisibility(index)} // Toggle visibility on click
          >
                <div className="flex justify-between mb-2 mr-2 w-3/4">
                <div className='mr-2'>
                <span className='font-bold'>Time:</span>
                    <br/>
                    {timeTransformer(transaction.date)}
                </div>
                <div className='mr-2'>
                <span className='font-bold'>Amount:</span>
                    <br/>
                    ${transaction.amount.toLocaleString()}
                </div>
                <div className='mr-2'>
                <span className='font-bold'>Type:</span>
                    <br/>
                    {transaction.type}
                </div>
                </div>
                <div className="w-3/4">
                <span className='font-bold'>Note:</span>
                <br/>
                {transaction.note}
                </div>
            </div>
            <div className={visibilityStates[index] ? 'items-center flex justify-center mb-2' : 'hidden'}>
                <button className='btn-xs-gray'><AiOutlinePlusCircle/></button>
                <button className='btn-xs-gray'><AiOutlineEdit/></button>
                <button className='btn-xs-gray' onClick={() => {
                                    if (window.confirm('Are you sure you want to remove this transaction?')) {
                                    //   handlePoiRemove(index);
                                    console.log('remove transaction: '+index)
                                    removeTransactionAtIndex(index)
                                    }
                                  }}><AiOutlineMinusCircle/></button>
            </div>
        </div>
        ))}
    </>
  )
}

export default SelectedVisit