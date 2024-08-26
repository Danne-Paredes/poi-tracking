import React, { useState, useEffect } from 'react';

const LookupDescription = ({ isLoading, activeCasinos, currentPoi }) => {
  const [sumBuyInForVisit, setSumBuyInForVisit] = useState(0);
  const [overallAverageBuyIn, setOverallAverageBuyIn] = useState(0);

  // Function to calculate visit buy-in sums
  const calculateVisitBuyInSums = () => {
    const visitBuyInSums = [];
    currentPoi.visits.forEach((visit) => {
      const buyInTransactions = visit.transactions.filter((transaction) => transaction.type === "Buy In");
      if (buyInTransactions.length > 0) {
        const sumBuyInForVisit = buyInTransactions.reduce((sum, trans) => sum + trans.amount, 0);
        visitBuyInSums.push(sumBuyInForVisit);
      }
    });
    return visitBuyInSums;
  };

  // Recalculate values when currentPoi.visits changes
  useEffect(() => {
    console.log('useEffect triggered'); // Debugging
    if (currentPoi.visits && currentPoi.visits.length > 0) {
      const visitBuyInSums = calculateVisitBuyInSums();
      const sum = visitBuyInSums.reduce((a, b) => a + b, 0);
      const average = visitBuyInSums.length > 0 ? sum / visitBuyInSums.length : 0;

      setSumBuyInForVisit(sum);
      setOverallAverageBuyIn(average);
    } else {
      setSumBuyInForVisit(0);
      setOverallAverageBuyIn(0);
    }
  }, [currentPoi.visits, currentPoi]);

  return (
    <>
      <div className='hidden sm:flex justify-center items-center'>
        <table className='justify-center items-center mt-2 border border-kv-gray'>
          <thead className='bg-dark-leather-2'>
            <tr>
              <th className='border border-kv-gray p-4 '>
                Total Buy In
              </th>
              <th className='border border-kv-gray p-4'>
                Average Buy In
              </th>
              <th className='border border-kv-gray p-4'>
                Active Casinos
              </th>
            </tr>
            <tr>
              <th className='border border-kv-gray p-4 italic'>
                {`$${Math.round(sumBuyInForVisit).toLocaleString()}`}
              </th>
              <th className='border border-kv-gray p-4'>
                {`$${Math.round(overallAverageBuyIn).toLocaleString()}`}
              </th>
              <th className='border border-kv-gray p-4 max-w-xs'>
                {isLoading ? <p>Loading...</p> : Array.isArray(activeCasinos) && activeCasinos.join(', ')}
              </th>
            </tr>
            <tr>
              <th colSpan={3}>Description:</th>
            </tr>
            <tr>
              <th colSpan={3}>{currentPoi.description}</th>
            </tr>
            <tr>
              <th colSpan={3}>Player Notes</th>
            </tr>
            <tr>
              <th colSpan={3}><textarea name="" id="" cols="40" rows="3" className='text-black' value={currentPoi.notes || ''} readOnly /></th>
            </tr>
          </thead>
        </table>
      </div>
      <div className='flex sm:hidden justify-center items-center px-2'>
        <table className='justify-center items-center mt-2 border mx-2 border-kv-gray'>
          <thead className='bg-dark-leather-2 mx-2'>
            <tr>
              <th className='border border-kv-gray p-4'>
                Total Buy In: <br />
                {`$${Math.round(sumBuyInForVisit).toLocaleString()}`} <br />
                Average Buy In: <br />
                {`$${Math.round(overallAverageBuyIn).toLocaleString()}`}
              </th>
              <th className='border border-kv-gray p-4'>
                Active Casinos: <br />
                {isLoading ? <p>Loading...</p> : Array.isArray(activeCasinos) && activeCasinos.join(', ')}
              </th>
            </tr>
            <tr>
              <th colSpan={2} className='border border-kv-gray p-4 '>
                Description: <br />
                {currentPoi.description}
              </th>
            </tr>
            <tr>
              <th colSpan={2}>Player Notes</th>
            </tr>
            <tr>
              <th colSpan={2}><textarea name="" id="" cols="40" rows="3" className='text-black mx-2' value={currentPoi.notes || ''} readOnly /></th>
            </tr>
          </thead>
        </table>
      </div>
    </>
  );
};

export default LookupDescription;
