import React, { useState, useEffect } from 'react'
import { dateTransformer, getAdjustedDateTime, handleStateUpdate } from './functions' 
import SingleSelect from './SingleSelect'

const CasinoReportTableHeadDaily = (props) => {
    const { state, setState } = props
    const { dataValsList, selectedCasino, dateViewMode, poiList, selectedMonthYear, currentMonth, currentYear, selectedDay, filteredVisits } = state
    const [options, setOptions ] = useState([])

    useEffect(() => {
      setOptions([...dataValsList?.casinos.sort((a, b) => a.localeCompare(b)).map(casino => ({ value: casino, label: casino }))]);
      handleStateUpdate(dateTransformer(getAdjustedDateTime()),'selectedDay', setState)
    },[poiList, selectedCasino, dataValsList?.casinos])

    useEffect(() => {
      const dateToDayStart = (dateString) => {
        const date = new Date(dateString);
        date.setHours(0, 0, 0, 0); // Set time to midnight to ignore time differences
        return date;
    };
    
    const filteredVisits = selectedDay && poiList
        .flatMap(poi => poi.visits.map(visit => ({
            ...visit,
            poiID: poi.id,
            name: poi.name,
            description: poi.description,
        })))
        .filter(visit => visit.casino === selectedCasino)
        .filter(visit => {
            const departureDate = dateToDayStart(visit.departure);
            const selectedDate = dateToDayStart(selectedDay);
            return departureDate.getTime() === selectedDate.getTime(); // Compare timestamps for equality
        })
        .sort((a, b) => a.name.localeCompare(b.name));
    
          // console.log('selectedDay',selectedDay)
        handleStateUpdate(filteredVisits, 'filteredVisits', setState);
    }, [selectedDay, poiList, selectedCasino, setState]); // Include all dependencies that can affect filteredVisits

    const numberOfVisits = filteredVisits?.length;

  const totalBuyIn = filteredVisits?.reduce((sum, visit) => {
    const buyIns = visit.transactions
      .filter(transaction => transaction.type === 'Buy In')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    return sum + buyIns;
  }, 0);

  const totalResults = filteredVisits?.reduce((sum, visit) => {
    const results = visit.transactions.reduce((sum, transaction) => {
      return sum + (transaction.type === 'Cash Out' ? -transaction.amount : transaction.amount);
    }, 0);
    return sum + results;
  }, 0);

  return (
    <thead className='bg-dark-leather-2'> 
            <tr>
              <th colSpan={4} className='border border-kv-gray p-4' onClick={()=>console.log(selectedDay)}>
                <SingleSelect
                  options={options}
                  placeholder={"Select A Casino"}
                  value={selectedCasino ? { label: selectedCasino, value: selectedCasino } : null}
                  onChange={(e)=>{
                    handleStateUpdate(e.value,'selectedCasino', setState);
                    sessionStorage.setItem("currentCasino", JSON.stringify(e.value)); 
                  }}
                  />
              </th>
            </tr>
            {selectedCasino && (
              <tr>
                <th className='border border-kv-gray p-4'>
                {/* <th className='border border-kv-gray p-4' onClick={()=>console.log(filteredVisits)}> */}
                  <input
                      className='justify-center mx-auto items-center text-center text-black block mb-2'
                      type="date"
                      defaultValue={selectedDay}
                      onChange={(event)=>{
                                          // console.log(event.target.value)
                                          handleStateUpdate(event.target.value, 'selectedDay', setState)
                                        }}
                  />
                </th>
                <th className='border border-kv-gray p-4'colSpan={3}>Buy-In: <span className='font-bold'>${totalBuyIn?.toLocaleString()}</span><br/>Results: <span className={`font-bold ${totalResults > 0 ? 'text-blue-500' : 'text-kv-red'}`}>{totalResults < 0 ? `-$${Math.abs(totalResults)?.toLocaleString()}` : `$${totalResults?.toLocaleString()}`}</span><br/>Visits: {numberOfVisits} </th>
              </tr>
            )}
            
            <tr>
              <th className='border border-kv-gray p-4' onClick={()=>console.log(poiList)}>POI</th>
              {/* <th className='sm:hidden border border-kv-gray p-4'>Details</th> */}
              <th className='hidden sm:table-cell border border-kv-gray p-4'>Last Visit</th>
              <th className='hidden sm:table-cell border border-kv-gray p-4'>Buy-In</th>
              <th className='hidden sm:table-cell border border-kv-gray p-4'>Results</th>
            </tr>
          </thead>
  )
}

export default CasinoReportTableHeadDaily