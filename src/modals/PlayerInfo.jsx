import React, { useState } from 'react'
import { useEffect } from 'react';
import { handleStateUpdate, getWeekStartEnd, getMonthStartEnd } from '../components/functions';

const PlayerInfo = (props) => {
    const { state: parentState, setState: setParentState, currentPoiList, setCurrentPoiList, inputRef, handleKeyDown, selectedCasino, modalClose } = props;
    const { poiList = [],
            selectedPoi ,
            casinos = parentState.dataValsList.casinos,
            playerInfoEdited = false,
        } = parentState || {};
        const [ state, setState ] = useState({
            notes:'',
            description:'',
            weeklyStats:[],
            monthlyStats: [],
            firstLoad:true,
        })
        const { notes, description, weeklyStats, monthlyStats, firstLoad } = state
        useEffect(() => {
            const currentDate = new Date();
            const { start: weekStart, end: weekEnd } = getWeekStartEnd(currentDate);
            const { start: monthStart, end: monthEnd } = getMonthStartEnd(currentDate);
        
            const weeklyVisits = selectedPoi.visits
                                                    .filter(visit => {
                                                        const visitDate = new Date(visit.arrival);
                                                        return visitDate >= weekStart && visitDate <= weekEnd;
                                                    });
        
            const monthlyVisits = selectedPoi.visits
                                                    .filter(visit => {
                                                        const visitDate = new Date(visit.arrival);
                                                        return visitDate >= monthStart && visitDate <= monthEnd;
                                                    });

                                                    // console.log('selectedPoi1',selectedPoi)
            handleStateUpdate(monthlyVisits, 'monthlyStats', setState)
            handleStateUpdate(weeklyVisits, 'weeklyStats', setState)
            handleStateUpdate(selectedPoi.description, 'description', setState)
            handleStateUpdate(selectedPoi.notes, 'notes', setState)
            handleStateUpdate(false,'playerInfoEdited',setParentState)
            // console.log(weeklyVisits)
        }, [])
        
        useEffect(() => {
            console.log(playerInfoEdited)
            if (!playerInfoEdited) {
                console.log('selectedPoi2',selectedPoi)
                handleStateUpdate(selectedPoi?.description, 'description', setState)
                handleStateUpdate(selectedPoi?.notes || '', 'notes', setState)
            }
        }, [playerInfoEdited])

        useEffect(() => {
            const newSelectedPoi = {
                ...selectedPoi,
                description:description,
                notes:notes
            }

                handleStateUpdate(newSelectedPoi, 'selectedPoi', setParentState)
        }, [notes, description])

        
        


    const numberOfVisitsWeekly = weeklyStats.length;

    const totalBuyInWeekly = weeklyStats?.reduce((sum, visit) => {
        const buyIns = visit.transactions
        .filter(transaction => transaction.type === 'Buy In')
        .reduce((sum, transaction) => sum + transaction.amount, 0);
        return sum + buyIns;
    }, 0);

    const totalResultsWeekly = weeklyStats?.reduce((sum, visit) => {
        const results = visit.transactions.reduce((sum, transaction) => {
        return sum + (transaction.type === 'Cash Out' ? -transaction.amount : transaction.amount);
        }, 0);
        return sum + results;
    }, 0);

    const numberOfVisitsMonthly = monthlyStats.length;

    const totalBuyInMonthly = monthlyStats.reduce((sum, visit) => {
        const buyIns = visit.transactions
        .filter(transaction => transaction.type === 'Buy In')
        .reduce((sum, transaction) => sum + transaction.amount, 0);
        return sum + buyIns;
    }, 0);

    const totalResultsMonthly = monthlyStats.reduce((sum, visit) => {
        const results = visit.transactions.reduce((sum, transaction) => {
        return sum + (transaction.type === 'Cash Out' ? -transaction.amount : transaction.amount);
        }, 0);
        return sum + results;
    }, 0);
        
    return (
        <div>
            <table>

            <thead className='bg-dark-leather-2'> 
                { weeklyStats && 
                (<tr className='text-kv-gray'>
                    <th className=' p-4'>
                        Weekly
                        <br/>
                        Buy-In: <span className='font-bold'>
                            ${totalBuyInWeekly.toLocaleString()}
                            </span>
                        <br/>
                        Results: <span className={`font-bold ${totalResultsWeekly > 0 ? 'text-blue-500' : 'text-kv-red'}`}>
                            {totalResultsWeekly < 0 ? `-$${Math.abs(totalResultsWeekly).toLocaleString()}` : `$${totalResultsWeekly.toLocaleString()}`}
                        </span>
                        <br/>
                        Visits: {numberOfVisitsWeekly}
                        </th>
                        
                        { monthlyStats && <th className=' p-4'colSpan={3}>
                            Monthly
                            <br/>
                            Buy-In: <span className='font-bold'>${totalBuyInMonthly.toLocaleString()}</span><br/>Results: <span className={`font-bold ${totalResultsMonthly > 0 ? 'text-blue-500' : 'text-kv-red'}`}>{totalResultsMonthly < 0 ? `-$${Math.abs(totalResultsMonthly).toLocaleString()}` : `$${totalResultsMonthly.toLocaleString()}`}</span><br/>Visits: {numberOfVisitsMonthly} </th> }
                </tr>)
                }
            </thead>
            </table>
            
             <div className="mb-4">
                <span className='text-kv-gray ml-2' onClick={()=>console.log(state)}>Description:</span>
                <input
                    id="description"
                    className='justify-center mx-auto items-center text-center block mt-2'
                    onKeyDown={handleKeyDown}
                    placeholder="Enter Description"
                    onChange={(e) => {
                                        handleStateUpdate(true,'playerInfoEdited',setParentState)
                                        handleStateUpdate(e.target.value, 'description', setState)
                                    }}
                    value={description}
                    required
                    />
            </div>
            <div className="mb-4">
                <span className='text-kv-gray ml-2'>Notes:</span>
                <textarea
                    id="notes"
                    className='justify-center mx-auto items-center text-center block mt-2'
                    onKeyDown={handleKeyDown}
                    placeholder="Enter Notes"
                    onChange={(e) => {
                                        handleStateUpdate(true,'playerInfoEdited',setParentState)
                                        handleStateUpdate(e.target.value, 'notes', setState)
                                    }}
                    value={notes}
                    required
                    />
            </div>
        </div>
    )
}

export default PlayerInfo