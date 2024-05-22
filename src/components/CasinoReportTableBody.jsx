import React, { useState, useEffect } from 'react'
import { handleStateUpdate, useLongPress } from './functions' 
import SingleSelect from './SingleSelect'

const CasinoReportTableBody = (props) => {
    const { state, setState } = props
    const { dataValsList, selectedCasino, dateViewMode, poiList, selectedMonthYear, currentMonth, currentYear, filteredVisits, filteredPois } = state

    useEffect(() => {
      const poiIdSet = new Set(); // Set to keep track of unique poiIDs
      const newFilteredPois = [];
  
      // Iterate over filteredVisits to collect unique poiIDs
      filteredVisits?.forEach(visit => {
          if (!poiIdSet.has(visit.poiID)) {
              poiIdSet.add(visit.poiID);
              newFilteredPois.push({
                  poiID: visit.poiID,
                  visits: [visit],
                  name: visit.name,
                  description: visit.description,
                  // Add additional attributes as needed
              }); 
          } else {
            newFilteredPois.forEach(poi =>{
              if (poi.poiID === visit.poiID) {
                poi.visits = [...poi.visits, visit]
              }
            })
          }
      });

      // console.log(newFilteredPois)
  
      // Now newFilteredPois contains unique POIs by ID
      handleStateUpdate(newFilteredPois, 'filteredPois', setState);
  }, [filteredVisits, setState]); // Ensure this runs whenever filteredVisits changes
  
  const handleLongPress = (index) => {
    // Define the action to be performed on long press
    console.log('hi')
    handleStateUpdate(true, 'openModal', setState)
    handleStateUpdate(index, 'index', setState)
  };
  
const longPressEventHandlers = useLongPress(handleLongPress, 500); // 500ms for long press



  return (
    <tbody>
      {
        filteredPois && filteredPois.map((poi, index) =>{
           // Ensure that poi.visits is an array before calling flatMap
          const transactions = (poi.visits || []).flatMap(visit => visit.transactions);
          
          const buyInsThisMonth = transactions
          .filter(transaction => transaction.type === "Buy In")
          .reduce((sum, transaction) => sum + transaction.amount, 0);
          
          const cashOutsThisMonth = transactions
          .filter(transaction => transaction.type === "Cash Out")
          .reduce((sum, transaction) => sum + transaction.amount, 0);
          
          const mostRecentVisitDate = (poi.visits || [])
          .reduce((latestDate, visit) => {
            const visitDate = new Date(visit.departure);
            return !latestDate || visitDate > latestDate ? visitDate : latestDate;
          }, null);
          
          const results = cashOutsThisMonth - buyInsThisMonth ;
          return (<>
                    <tr key={`sm-${poi.id}`} className={`hidden sm:table-row ${index % 2 === 0 ? 'bg-kv-logo-gray' : 'bg-slate-gray'}`} {...longPressEventHandlers(index)}>
                       <td className='text-center border-r border-b border-black p-4  text-lg w-1/2'>
                         {poi.name} <br/>
                         <span className='text-xs italic'>"{poi.description}"</span>
                     </td>

                      <td className='text-center border-r border-b border-black font-bold p-4'>{mostRecentVisitDate && mostRecentVisitDate.toLocaleDateString()}</td>
                      <td className= ' text-center border-r border-b border-black font-bold p-4' >{buyInsThisMonth < 0 ? `-$${Math.abs(buyInsThisMonth).toLocaleString()}` : `$${buyInsThisMonth.toLocaleString()}`}</td>
                      <td className={(results > 0  ? 'bg-blue-500' : 'bg-kv-red') + (results === 0 ? 'text-black' : '') + ' text-center border-b border-black font-bold p-4'}>{results < 0 ? `-$${Math.abs(results).toLocaleString()}` : `$${results.toLocaleString()}`}</td>
                  </tr>
                </>)
        })
      }
    </tbody>
  )
}

export default CasinoReportTableBody