import React,{ useState, useEffect } from 'react'
import { getDataVals, getPoiData } from '../config/firebase'
import SingleSelect from '../components/singleSelect'

const CasinoView = () => {
  const [dataValsList, setDataValsList] = useState({ casinos: [] })
  const [poiList, setPoiList] = useState([])
  const [selectedCasino, setSelectedCasino] = useState('')

  const fetchDataVals = async () => {
    const data = await getDataVals();
    const data2 = await getPoiData();
    setDataValsList(data);
    setPoiList(data2);
  };

  useEffect(() => {
    fetchDataVals();
  }, []);

  const casinoOptions = [ 
    ...dataValsList.casinos.map((casino) => {
        return { value: casino, label: casino };
    })];

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const filteredVisits = poiList
  .flatMap(poi => poi?.visits)
  .filter(visit => visit?.casino === selectedCasino)
  .filter(visit => {
    const visitDate = new Date(visit?.arrival);
    return visitDate.getMonth() === currentMonth && visitDate.getFullYear() === currentYear;
  });

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
    <div className='flex justify-center items-center'>
      <table className='justify-center items-center mt-2 border  border-kv-gray'>
          <thead className='bg-dark-leather-2'> 
            <tr>
              <th colSpan={4} className='border border-kv-gray p-4'>
                <SingleSelect
                  options={casinoOptions}
                  placeholder={"Select A Casino"}
                  value={selectedCasino ? { label: selectedCasino, value: selectedCasino } : null}
                  onChange={(e)=>{
                    setSelectedCasino(e.value)
                  }}
                />
              </th>
            </tr>
            { selectedCasino && 
              (<tr>
                <th className='border border-kv-gray p-4'>{monthNames[currentMonth]} Visits: {numberOfVisits}</th>
                <th className='border border-kv-gray p-4'colSpan={3}>{monthNames[currentMonth]} Buy-In: <span className='font-bold'>${totalBuyIn.toLocaleString()}</span><br/>{monthNames[currentMonth]} Results: <span className={`font-bold ${totalResults > 0 ? 'text-blue-500' : 'text-kv-red'}`}>{totalResults < 0 ? `-$${Math.abs(totalResults).toLocaleString()}` : `$${totalResults.toLocaleString()}`}</span> </th>
              </tr>)
            }
            <tr>
              <th className='border border-kv-gray p-4' onClick={()=>console.log(poiList)}>POI</th>
              <th className='sm:hidden border border-kv-gray p-4'>Details</th>
              <th className='hidden sm:table-cell border border-kv-gray p-4'>Last Visit</th>
              <th className='hidden sm:table-cell border border-kv-gray p-4'>Buy-In</th>
              <th className='hidden sm:table-cell border border-kv-gray p-4'>Results</th>
            </tr>
          </thead>
          <tbody>
          {poiList &&
            poiList
            .filter((poi) => {
                return poi.casinos.includes(selectedCasino) &&
                       (poi.visits || []).some(visit => visit.casino === selectedCasino);
            })
            .sort((a, b) => {
                const mostRecentVisitDateA = (a.visits || [])
                    .reduce((latestDate, visit) => {
                        const visitDate = new Date(visit.departure);
                        return !latestDate || visitDate > latestDate ? visitDate : latestDate;
                    }, null);

                const mostRecentVisitDateB = (b.visits || [])
                    .reduce((latestDate, visit) => {
                        const visitDate = new Date(visit.departure);
                        return !latestDate || visitDate > latestDate ? visitDate : latestDate;
                    }, null);

                // First sort by most recent visit
                if (mostRecentVisitDateA > mostRecentVisitDateB) return -1;
                if (mostRecentVisitDateA < mostRecentVisitDateB) return 1;

                // If visits are equal, sort by name
                return a.name.localeCompare(b.name);
            })
            .map((poi, index) => {
        const monthlyTransactions = (poi.visits || [])
            .filter(visit => visit.casino === selectedCasino )
            .flatMap(visit => visit.transactions || [])
            .filter(transaction => new Date(transaction.date).getMonth() === currentMonth);
            
        const buyInsThisMonth = monthlyTransactions
            .filter(transaction => transaction.type === "Buy In")
            .reduce((sum, transaction) => sum + transaction.amount, 0);
            
        const cashOutsThisMonth = monthlyTransactions
            .filter(transaction => transaction.type === "Cash Out")
            .reduce((sum, transaction) => sum + transaction.amount, 0);

        const mostRecentVisitDate = (poi.visits || [])
        .reduce((latestDate, visit) => {
            const visitDate = new Date(visit.departure);
            return !latestDate || visitDate > latestDate ? visitDate : latestDate;
        }, null);

        const results = cashOutsThisMonth - buyInsThisMonth ;

        return (
          <>
            <tr key={`sm-${poi.id}`} className={`hidden sm:table-row ${index % 2 === 0 ? 'bg-kv-logo-gray' : 'bg-slate-gray'}`}>
                <td className='text-center border-r border-b border-black p-4  text-lg w-8'>
                    {poi.name} <br/>
                    <span className='text-xs italic'>"{poi.description}"</span>
                </td>
                <td className='text-center border-r border-b border-black font-bold p-4'>{mostRecentVisitDate && mostRecentVisitDate.toLocaleDateString()}</td>
                <td className= ' text-center border-r border-b border-black font-bold p-4' >{buyInsThisMonth < 0 ? `-$${Math.abs(buyInsThisMonth).toLocaleString()}` : `$${buyInsThisMonth.toLocaleString()}`}</td>
                <td className={(results > 0  ? 'text-blue-500' : 'text-kv-red') + (results === 0 ? 'text-black' : '') + ' text-center border-b border-black font-bold p-4'}>{results < 0 ? `-$${Math.abs(results).toLocaleString()}` : `$${results.toLocaleString()}`}</td>
            </tr>

            <tr key={`xs-${poi.id}`} className={`sm:hidden ${index % 2 === 0 ? 'bg-kv-logo-gray' : 'bg-slate-gray'}`}>
              <td className='text-center border-r border-b border-black p-4  text-lg w-8'>
                  {poi.name} <br/>
                  <span className='text-xs italic'>"{poi.description}"</span>
              </td>
              <td colSpan={3} className='text-center border-r border-b border-black p-4'>
                Last Visit: {mostRecentVisitDate && mostRecentVisitDate.toLocaleDateString()}
                <br/>
                <br/>
                Buy In: {buyInsThisMonth < 0 ? `-$${Math.abs(buyInsThisMonth).toLocaleString()}` : `$${buyInsThisMonth.toLocaleString()}`}
                <br/>
                Result: <span className={(results > 0  ? 'text-blue-500' : 'text-kv-red') + (results === 0 ? 'text-black' : '') + ' text-center'}>{results < 0 ? `-$${Math.abs(results).toLocaleString()}` : `$${results.toLocaleString()}`}</span>
              </td>
            </tr>
          </>
        );
    })
}
          </tbody>
        </table>
    </div>
  )
}

export default CasinoView