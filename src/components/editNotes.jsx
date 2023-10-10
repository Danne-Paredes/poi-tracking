import React, {useState, useEffect, useRef} from 'react'
import SingleSelect from './singleSelect';


const EditNotes = ({casinos, data, selectedVisit }) => {
    console.log('selectedVisit')
    console.log(selectedVisit)

    // const selectedVisit = data ? data.visits[0] : []
    const casinoOptions = casinos && casinos 
    ? casinos.map((casino) => {
         return { value: casino, label: casino };
      })
    : [];
    const typeOptions = [
        {value: 'Buy In', label: 'Buy In'},
        {value: 'Cash Out', label: 'Cash Out'},
        {value: 'Note', label: 'Note'},
    ]
  return (
    <div>
        <div className="w-full p-2 flex justify-center items-center">
            <label className='text-kv-gray'>
                Casino:
                <SingleSelect
                    className="max-w-xs snap-center"
                    value={selectedVisit.casino ? { label: selectedVisit.casino, value: selectedVisit.casino } : null}
                    options={casinoOptions}
                    placeholder='Select a casino'
                    onChange={(e) => {
                        // const updatedVisits = [...data.visits];
                        // updatedVisits[selectedVisitIndex].casino = e.value;
                        // handleDataChange({ ...data, visits: updatedVisits });
                    }}
                    />
            </label>
        </div>
        <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-1/2 p-2 flex flex-col items-center">
            <h2 className='text-kv-gray'>
                Arrival: 
                {selectedVisit.arrival ? 
                    <input
                    className='justify-center mx-auto items-center text-center block mb-2 text-black'
                    type="datetime-local"
                    value={selectedVisit.arrival}
                    onChange={(e) => {
                        // const updatedVisits = [...data.visits];
                        // updatedVisits[selectedVisitIndex].arrival = e.target.value;
                        // handleDataChange({ ...data, visits: updatedVisits });
                    }}
                    />
                    : null}
            </h2>
            </div>
            <div className="w-full sm:w-1/2 p-2">
            <h2 className='text-kv-gray'>
                Departure: 
                {selectedVisit.departure ? 
                    <input
                    className='justify-center mx-auto items-center text-center block mb-2 text-black'
                    type="datetime-local"
                    value={selectedVisit.departure}
                    onChange={(e) => {
                        // const updatedVisits = [...data.visits];
                        // updatedVisits[selectedVisitIndex].departure = e.target.value;
                        // handleDataChange({ ...data, visits: updatedVisits });
                    }}
                    />
                    : null}
            </h2>
            </div>
        </div>
        <div className="w-full sm:w-2/3  mx-auto">
        { selectedVisit.transactions && selectedVisit.transactions.map((transaction, index) => (
    <div 
        key={index} 
        className={(index % 2 === 0 ? 'bg-kv-logo-gray' : 'bg-slate-gray') + ' p-2 flex flex-col items-center'}
    >
        <div className="flex justify-between w-full mb-2">
            <div className='mr-2 flex flex-col bg-green-600'>
                <label className='block'>Date: </label>
                <input
                className='ml-2 text-black text-sm'
                type="datetime-local"
                value={transaction.date}
                onChange={(e) => {
                    // Your change handler code
                }}
                />
            </div>
            <div className='flex flex-col w-1/3 bg-red-600'>
               <label className='block'>Amount: </label>
                <input 
                className='ml-2 text-black max-w-xs px-1 text-sm'
                value={transaction.amount}
                type='number'
                onChange={(e) => {
                    // Your change handler code
                }}
                />
            </div>
            <div className='mr-2 flex flex-col bg-purple-600'>
               <label>Type: </label>
                <SingleSelect
                    options={typeOptions}
                    value={transaction.type ? { label: transaction.type, value: transaction.type } : null}
                    onChange={(e) => {
                        // Your change handler code
                    }}
                />
            </div>
        </div>
        <div className="w-full">
            Note:
            <textarea 
                className='ml-2 text-black w-full'
                value={transaction.note}
                onChange={(e) => {
                // Your change handler code
                }}
            />
        </div>
    </div>
    ))
}

        </div>
    </div>
  )
}

export default EditNotes