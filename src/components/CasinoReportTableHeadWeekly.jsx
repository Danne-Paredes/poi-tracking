import React, { useState, useEffect } from 'react';
import { handleStateUpdate } from './functions';
import SingleSelect from './SingleSelect';

const CasinoReportTableHeadWeekly = (props) => {
  const { state, setState } = props;
  const { dataValsList, selectedCasino, poiList, selectedWeek='01/28/2024 - 02/03/2024', weekOptions, filteredVisits } = state;
  const [options, setOptions] = useState([]);

  
  const toWeekString = (date) => {
    const sunday = getWeekStartingSunday(date);
    const saturday = new Date(sunday);
    saturday.setDate(saturday.getDate() + 6);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return `${sunday.toLocaleDateString(undefined, options)} - ${saturday.toLocaleDateString(undefined, options)}`;
  };
  
  const getWeekStartingSunday = (date) => {
    const resultDate = new Date(date);
    resultDate.setHours(0, 0, 0, 0); // Reset the time to midnight
    resultDate.setDate(resultDate.getDate() - resultDate.getDay()); // Adjust to previous Sunday
    return resultDate;
  };

  const weekToDate = (weekString) => {
      if (typeof weekString !== 'string') {
          console.error('Invalid week string:', weekString);
          return new Date(); // Return current date or some other fallback
      }
      const parts = weekString.split(' - ');
      if (parts.length !== 2) {
          console.error('Week string does not contain valid start and end dates:', weekString);
          return new Date();
      }
      const [start] = parts;
      const date = new Date(start);
      date.setHours(0, 0, 0, 0); // Reset the time to midnight
      return date;
  };


  useEffect(() => {
    // console.log('useEffect')
    setOptions([...dataValsList?.casinos.map(casino => ({ value: casino, label: casino }))]);
    // console.log('options',[...dataValsList?.casinos.map(casino => ({ value: casino, label: casino }))])

    const allDates = poiList.flatMap(poi =>
      poi.visits
        ?.filter(visit => visit.casino === selectedCasino)
        .flatMap(visit => [toWeekString(new Date(visit.departure)), toWeekString(new Date(visit.arrival))]) || []
    );

    const uniqueWeeks = Array.from(new Set(allDates));
    // console.log('uniqueWeeks', uniqueWeeks)
    const sortedWeeks = uniqueWeeks.sort((a, b) => weekToDate(b) - weekToDate(a));

    const weekOptions = sortedWeeks.map(week => ({ value: week, label: week }));
    // console.log('weekOptions', weekOptions)
    // console.log('weekOptions[0]', weekOptions[0])
    if (weekOptions.length > 0) {
      handleStateUpdate(weekOptions[0].value, 'selectedWeek', setState);
      handleStateUpdate(weekOptions, 'weekOptions', setState);
    }
  }, [poiList, selectedCasino, dataValsList?.casinos]);
  
  const handleWeekSelect = (e) => {
    handleStateUpdate(e.value, 'selectedWeek', setState);
  };
  
  useEffect(() => {
    const filteredVisits = selectedWeek && poiList
        .flatMap(poi => poi.visits?.map(visit => ({
            ...visit,
            poiID: poi.id,
            name: poi.name,
            description: poi.description,
        })) || [])
        .filter(visit => visit.casino === selectedCasino)
        .filter(visit => {
            const departureDate = new Date(visit.departure);
            departureDate.setHours(0, 0, 0, 0); // Reset the time to midnight for accurate comparison
            const weekStart = getWeekStartingSunday(weekToDate(selectedWeek));
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6); // Set to the end of the week

            // Ensure dates are strictly within the week's range
            return departureDate >= weekStart && departureDate <= weekEnd;
        }).sort((a, b) => {
          return a.name.localeCompare(b.name);
        });

      handleStateUpdate(filteredVisits, 'filteredVisits', setState);
  }, [selectedWeek, poiList, selectedCasino, setState]); // Include all dependencies that can affect filteredVisits


  



  const numberOfVisits = filteredVisits ? filteredVisits.length : 0;
  const totalBuyIn = filteredVisits ? filteredVisits.reduce((sum, visit) => sum + visit.transactions.reduce((sum, transaction) => sum + (transaction.type === 'Buy In' ? transaction.amount : 0), 0), 0) : 0;
  const totalResults = filteredVisits ? filteredVisits.reduce((sum, visit) => sum + visit.transactions.reduce((sum, transaction) => sum + (transaction.type === 'Cash Out' ? -transaction.amount : transaction.amount), 0), 0) : 0;

  return (
    <thead className='bg-dark-leather-2'> 
      <tr>
        <th colSpan={4} className='border border-kv-gray p-4' onClick={()=>console.log(filteredVisits)}>
          <SingleSelect
            options={options}
            placeholder="Select A Casino"
            value={selectedCasino ? { label: selectedCasino, value: selectedCasino } : null}
            onChange={(e) => {
              handleStateUpdate(e.value, 'selectedCasino', setState);
              sessionStorage.setItem("currentCasino", JSON.stringify(e.value));
            }}
          />
        </th>
      </tr>
      {selectedCasino && (
        <tr>
          <th className='border border-kv-gray p-4'>
            <SingleSelect
              options={weekOptions} // Make sure weekOptions is defined and correctly formatted
              value={selectedWeek ? { label: selectedWeek, value: selectedWeek } : null}
              onChange={handleWeekSelect}
            />
          </th>
          <th className='border border-kv-gray p-4' colSpan={3}>Buy-In: <span className='font-bold'>${totalBuyIn.toLocaleString()}</span><br/>Results: <span className={`font-bold ${totalResults > 0 ? 'text-blue-500' : 'text-kv-red'}`}>{totalResults < 0 ? `-$${Math.abs(totalResults).toLocaleString()}` : `$${totalResults.toLocaleString()}`}</span><br/>Visits: {numberOfVisits}</th>
        </tr>
      )}
      <tr>
        <th className='border border-kv-gray p-4' onClick={() => console.log(poiList)}>POI</th>
        {/* <th className='sm:hidden border border-kv-gray p-4'>Details</th> */}
        <th className='hidden sm:table-cell border border-kv-gray p-4'>Last Visit</th>
        <th className='hidden sm:table-cell border border-kv-gray p-4'>Buy-In</th>
        <th className='hidden sm:table-cell border border-kv-gray p-4'>Results</th>
      </tr>
    </thead>
  );
}

export default CasinoReportTableHeadWeekly;
