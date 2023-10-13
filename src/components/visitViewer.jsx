import React from "react";
export function VisitViewer({
  currentPoi,
  expandedVisitIndex,
  toggleVisibility,
  dateTimeTransformer,
  timeTransformer
}) {
  return <div className='flex justify-center items-center'>
                <table className='justify-center items-center mt-2 border  border-kv-gray'>
                    <thead className='bg-dark-leather-2' onClick={() => console.log(currentPoi)}>
                        <tr>
                            <th className='border border-kv-gray p-4 '>
                                Casino
                            </th>
                            <th className='border border-kv-gray p-4'>
                                Arrival / Departure
                            </th>
                            <th className='border border-kv-gray p-4'>
                                Result
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {currentPoi.visits && currentPoi.visits.map((visit, visitIndex) => {
          const buyInsThisVisit = visit.transactions.filter(transaction => transaction.type === "Buy In").reduce((sum, transaction) => sum + transaction.amount, 0);
          const cashOutsThisVisit = visit.transactions.filter(transaction => transaction.type === "Cash Out").reduce((sum, transaction) => sum + transaction.amount, 0);
          const visitResult = cashOutsThisVisit - buyInsThisVisit;

          if (visitIndex === expandedVisitIndex || expandedVisitIndex === null) {
            return <>
                                        <tr key={`visit-${visitIndex}`} className={visitIndex % 2 === 0 ? 'bg-kv-logo-gray' : 'bg-slate-gray'} onClick={() => toggleVisibility(visitIndex)}>
                                            <td className='text-center border-r border-b border-black p-4'>{visit.casino ? visit.casino : null}</td>
                                            <td className='text-center border-r border-b border-black p-4 w-15'> Arrival: {visit.arrival ? dateTimeTransformer(visit.arrival) : null} <br />Departure: {visit.departure ? dateTimeTransformer(visit.departure) : null}</td>
                                            <td className='text-center border-r border-b border-black p-4'>{visitResult}</td>
                                        </tr>
                                        {visitIndex === expandedVisitIndex && <>
                                                <tr className='bg-dark-leather-2 text-kv-gray'>
                                                    <th className='border border-kv-gray p-4'>
                                                        Time
                                                    </th>
                                                    <th className='border border-kv-gray p-4 '>
                                                        Buy In
                                                    </th>
                                                    <th className='border border-kv-gray p-4'>
                                                        Cash Out
                                                    </th>
                                                </tr>
                                                {visit.transactions && visit.transactions.map((transaction, transactionIndex) => <>
                                                            <tr className={visitIndex % 2 === 0 ? 'bg-kv-logo-gray' : 'bg-slate-gray'}>
                                                                <td className='text-center border-r border-b border-black p-4'>{timeTransformer(transaction.date)}</td>
                                                                <td className='text-center border-r border-b border-black p-4'>{transaction.type === 'Buy In' && transaction.amount}</td>
                                                                <td className='text-center border-r border-b border-black p-4'>{transaction.type === 'Cash Out' && transaction.amount}</td>
                                                            </tr>
                                                            <tr className={visitIndex % 2 === 0 ? 'bg-kv-logo-gray' : 'bg-slate-gray'}>
                                                                <td colSpan={3} className='text-center border-r border-b border-black p-4'>{transaction.note}</td>
                                                            </tr>
                                                        </>)}
                                            </>}
                                    </>;
          }

          return null; // Skip rendering for non-expanded rows       
        })}
                    </tbody>
                </table>
            </div>;
}
  