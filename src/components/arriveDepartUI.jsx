import React, {useState, useEffect} from 'react'
import SingleSelect from './singleSelect';

const ArriveDepartUI = ({ games, details, handleFormUpdate }) => {

    const options = [ 
        ...games.map((game) => {
           return { value: game, label: game };
        })];
    
    const [ type, setType ] = useState('Arrival')

  return (
    <div className="relative p-6 flex-auto">
            <label className=' text-kv-gray mr-5'>
              <input 
                  className='mr-2'
                  onChange={() => setType("Arrival")} 
                  type="radio" 
                  value="Arrival" 
                  checked={type === "Arrival"}
              /> 
              Arrival
            </label>
            <label className=' text-kv-gray'>
                <input 
                    className='mr-2 mb-5'
                    onChange={() => setType("Departure")} 
                    type="radio" 
                    value="Departure" 
                    checked={type === "Departure"}
                /> 
                Departure
            </label>
            <div className='flex justify-center mx-auto items-center text-center block mb-2'>
                { type == 'Arrival' && <input
                    className='block mb-2'
                    type="datetime-local"
                    defaultValue={details.value}
                    onChange={e=>handleFormUpdate('updatedArrival',e.target.value)}
                />}
                { type == 'Departure' && <input
                    className='block mb-2'
                    type="datetime-local"
                    defaultValue={details.departure}
                    onChange={e=>handleFormUpdate('updatedDeparture',e.target.value)}
                />}
            </div>
        </div>

  )
}

export default ArriveDepartUI