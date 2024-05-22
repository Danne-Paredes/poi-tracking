import React, { useState, useEffect } from 'react'
import { handleStateUpdate } from './functions' 
import SingleSelect from './SingleSelect'

const CasinoReportTableHeadMonthly = (props) => {
    const { state, setState } = props
    const { dataValsList, selectedCasino, dateViewMode, poiList, selectedMonthYear, currentMonth, currentYear, filteredVisits, monthYearOptions } = state
    const [options, setOptions ] = useState([])
    
    // Helper function to get a month-year string from a date string
  const toMonthYearString = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    // getMonth() returns 0-11, use it to get the month name
    const monthName = months[date.getMonth()];
    return `${monthName} ${year}`;
  };

  // Convert "Month Year" string to a Date object
  const monthYearToDate = (monthYear) => {
    const [month, year] = monthYear.split(' ');
    const monthIndex = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].indexOf(month);
    return new Date(year, monthIndex);
  };

    useEffect(() => {
      setOptions([...dataValsList?.casinos.map((casino) => {
        return { value: casino, label: casino }
      })])

      // Map through the poiList to get all departure and arrival dates, convert to month-year strings
      const allDates = poiList.flatMap(poi =>
        poi.visits
        .filter(visit => visit.casino === selectedCasino)
        .flatMap(visit => [toMonthYearString(visit.departure), toMonthYearString(visit.arrival)])
      );

      // Get unique month-year strings
      const uniqueMonthYears = Array.from(new Set(allDates));

      // Sort by date in descending order
      const sortedMonthYears = uniqueMonthYears.sort((a, b) => monthYearToDate(b) - monthYearToDate(a));

      // Create options list
      const monthYearOptions = sortedMonthYears.map(monthYear => {
        return { value: monthYear, label: monthYear };
      });

      if (monthYearOptions.length > 0) {
        handleStateUpdate(uniqueMonthYears[0], 'selectedMonthYear', setState);
        handleStateUpdate(monthYearOptions, 'monthYearOptions', setState);
      }

      // console.log('Monthly')
    }, [poiList, selectedCasino])

    useEffect(() => {
      const filteredVisits = poiList
        .flatMap(poi => poi?.visits.map(visit =>({
          ...visit,
          poiID: poi.id, 
          name: poi.name,
          description: poi.description,
        })))
        .filter(visit => visit?.casino === selectedCasino)
        .filter(visit => {
          const visitDate = new Date(visit?.arrival);
          return visitDate.getMonth() === currentMonth && visitDate.getFullYear() === currentYear;
        }).sort((a, b) => {
          return a.name.localeCompare(b.name);
        })
        handleStateUpdate(filteredVisits, 'filteredVisits', setState);

    }, [poiList, selectedMonthYear, selectedCasino]);

    const handleMonthYearSelect = (e) =>{
        // Helper function to convert month name to month number
        const getMonthNumber = (monthName) => {
          const months = ["January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"];
          return months.indexOf(monthName);
        };
    
        // Parse the month and year from e.value
        const [monthName, year] = e.value.split(' ');
        const monthNumber = getMonthNumber(monthName);
    
        // Create a new Date object
        const selectedDate = new Date(year, monthNumber);
    
        // Set currentMonth and currentYear
        handleStateUpdate(e.value, 'selectedMonthYear', setState)
        handleStateUpdate(selectedDate.getMonth(), 'currentMonth', setState)
        handleStateUpdate(selectedDate.getFullYear(), 'currentYear', setState)
      }



  

  const numberOfVisits = filteredVisits.length;

  const totalBuyIn = filteredVisits.reduce((sum, visit) => {
    const buyIns = visit.transactions
      .filter(transaction => transaction.type === 'Buy In')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    return sum + buyIns;
  }, 0);

  const totalResults = filteredVisits.reduce((sum, visit) => {
    const results = visit.transactions.reduce((sum, transaction) => {
      return sum + (transaction.type === 'Cash Out' ? -transaction.amount : transaction.amount);
    }, 0);
    return sum + results;
  }, 0);
    

  return (
    <thead className='bg-dark-leather-2'> 
            <tr>
              <th colSpan={4} className='border border-kv-gray p-4'>
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
            { selectedCasino && 
              (<tr>
                <th className='border border-kv-gray p-4' >
                  <SingleSelect
                    options={monthYearOptions}
                    value={selectedMonthYear ? { label: selectedMonthYear, value: selectedMonthYear } : null}
                    onChange={(e)=>{
                      // console.log(e)
                      handleMonthYearSelect(e)
                    }}/>
                 </th>
                <th className='border border-kv-gray p-4'colSpan={3}>Buy-In: <span className='font-bold'>${totalBuyIn.toLocaleString()}</span><br/>Results: <span className={`font-bold ${totalResults > 0 ? 'text-blue-500' : 'text-kv-red'}`}>{totalResults < 0 ? `-$${Math.abs(totalResults).toLocaleString()}` : `$${totalResults.toLocaleString()}`}</span><br/>Visits: {numberOfVisits} </th>
              </tr>)
            }
            <tr>
              <th className='border border-kv-gray p-4' >POI</th>
              {/* <th className='border border-kv-gray p-4' onClick={()=>console.log(poiList)}>POI</th> */}
              <th className='sm:hidden border border-kv-gray p-4'>Details</th>
              <th className='hidden sm:table-cell border border-kv-gray p-4'>Last Visit</th>
              <th className='hidden sm:table-cell border border-kv-gray p-4'>Buy-In</th>
              <th className='hidden sm:table-cell border border-kv-gray p-4'>Results</th>
            </tr>
          </thead>
  )
}

export default CasinoReportTableHeadMonthly