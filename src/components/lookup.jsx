import { VisitViewer } from './visitViewer';
import React, { useState, useEffect } from 'react'
import { getDataVals, getPoiData } from '../config/firebase'
import { useParams, useLocation } from 'react-router-dom';
import SingleSelect from './singleSelect';
import MultiSelect from './multiSelect';
import { dateTimeTransformer, dateTransformer, timeTransformer } from './functions'


const Lookup = (props) => {
    const { id } = useParams();
    const location = useLocation();
    const poi = location.state?.poi;

    const [dataValsList, setDataValsList] = useState({ casinos: [] })
    const [poiList, setPoiList] = useState([])
    const [currentPoi, setCurrentPoi] = useState(poi?poi:{name:'', casinos:[]})
    const [currentPoiList, setCurrentPoiList] = useState(() => {
        const savedPoiList = sessionStorage.getItem('currentPoiList');
        return savedPoiList ? JSON.parse(savedPoiList) : [];
      });
    const [selectedCasino, setSelectedCasino] = useState('')
    const [expandedVisitIndex, setExpandedVisitIndex] = useState(null);


    const toggleVisibility = (visitIndex) => {
        if (expandedVisitIndex === visitIndex) {
          setExpandedVisitIndex(null);  // collapse if the same row is clicked again
        } else {
          setExpandedVisitIndex(visitIndex);  // expand selected visit's transactions
        }
      };


    useEffect(() => {
        console.log('currentPoi')
        console.log(currentPoi)

        const fetchDataVals = async () => {
          const data = await getDataVals();
          const data2 = await getPoiData();
          setDataValsList(data);
          setPoiList(data2);
      
          // Update currentPoiList with new visits from poiList and add new visit if transactions are present
          const updatedCurrentPoiList = currentPoiList.map(currentPoi => {
            const matchingPoi = data2.find(poi => poi.id === currentPoi.id);
      
            // 1. If there's a matching POI from data2, use its visits, else use the currentPoi's visits.
            let visits = matchingPoi.visits ? [...matchingPoi.visits] : [...currentPoi.visits];
      
            // 2. If transactions are present, add the new visit.
            if (currentPoi.transactions && currentPoi.transactions.length > 0) {
              const newVisit = {
                arrival: currentPoi.arrival,
                casino: selectedCasino,
                transactions: currentPoi.transactions
              };
              visits.push(newVisit);
            }
      
            return { ...currentPoi, visits: visits };
          });
      
          setCurrentPoiList(updatedCurrentPoiList);
          sessionStorage.setItem('currentPoiList', JSON.stringify(updatedCurrentPoiList));
        };
        fetchDataVals();
        
    }, []);



  return (
    <div className='justify-center items-center'> 
        <div className='flex justify-center items-center'>
                <table className='justify-center items-center mt-2 border  border-kv-gray'>
                    <thead className='bg-dark-leather-2' onClick={() => console.log(currentPoi)}>
                        <tr>
                            <th>Select POI</th>
                            <th>Casino Filter</th>
                        </tr>
                        <tr>
                            <th className='p-2'>
                                <SingleSelect
                                        value={currentPoi.name ? { label: currentPoi.name, value: currentPoi.name } : null}
                                        options={
                                                    poiList
                                                        .filter((poi) => selectedCasino ? poi.casinos.includes(selectedCasino) : true)
                                                        .map(poi => ({
                                                            value: poi.name,
                                                            label: poi.name,
                                                            }))
                                                }
                                        onChange={(e) => {
                                                    const matchingPoi = poiList.find((poi) => poi.name === e.value);
                                                    setCurrentPoi(matchingPoi);
                                                }}
                                    />
                            </th>
                            <th className='p-2'>
                                <SingleSelect
                                    value={selectedCasino ? { label: selectedCasino, value: selectedCasino } : null}
                                    options={
                                                dataValsList.casinos.map(casino => ({
                                                    value: casino,
                                                    label: casino,
                                                    }))
                                            }
                                    onChange={(e) => {
                                                setSelectedCasino(e.value);
                                            }}
                                />
                            </th>
                        </tr>
                    </thead>
                </table>
        </div>
        <div className='flex justify-center items-center'>
                <table className='justify-center items-center mt-2 border  border-kv-gray'>
                    <thead className='bg-dark-leather-2'>
                        <tr>
                            <th className='border border-kv-gray p-4 '>
                                Description
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
                               {currentPoi.description}
                            </th>
                            <th className='border border-kv-gray p-4'>
                                {currentPoi.visits && 
                                    (() => {
                                        let totalBuyInPerVisit = 0;
                                        const visitBuyInSums = [];

                                        currentPoi.visits.forEach(visit => {
                                            const buyInTransactions = visit.transactions.filter(transaction => transaction.type === "Buy In");
                                            if (buyInTransactions.length > 0) {
                                                const sumBuyInForVisit = buyInTransactions.reduce((sum, trans) => sum + trans.amount, 0);
                                                visitBuyInSums.push(sumBuyInForVisit);
                                            }
                                        });

                                        const overallAverage = visitBuyInSums.reduce((a, b) => a + b, 0) / visitBuyInSums.length;
                                        return `$${Math.round(overallAverage)}`
                                    })()
                                }
                            </th>
                            <th className='border border-kv-gray p-4 max-w-xs'>
                                {currentPoi.casinos && currentPoi.casinos.join(', ')}
                            </th>
                        </tr>
                        <tr><th colSpan={3}>Player Notes</th></tr>
                        <tr><th colSpan={3}><textarea name="" id="" cols="40" rows="3" className='text-black' value={currentPoi.notes || ''} readOnly /></th></tr>
                    </thead>
                </table>
        </div>
        {  currentPoi.name != '' &&
             <VisitViewer   currentPoi={currentPoi}  expandedVisitIndex={expandedVisitIndex} toggleVisibility={toggleVisibility} dateTimeTransformer={dateTimeTransformer} timeTransformer={timeTransformer}  />
        }
    </div>
  )
}

export default Lookup