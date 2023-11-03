import { VisitViewer } from './visitViewer';
import React, { useState, useEffect } from 'react'
import { getDataVals, getPoiData } from '../config/firebase'
import { useParams, useLocation } from 'react-router-dom';
import SingleSelect from './singleSelect';
import MultiSelect from './multiSelect';
import { dateTimeTransformer, dateTransformer, timeTransformer } from './functions'
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker from '@hassanmojab/react-modern-calendar-datepicker';


const Lookup = (props) => {
    const { id } = useParams();
    const location = useLocation();
    const poi = location.state?.poi;
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDayRange, setSelectedDayRange] = useState({
        from: null,
        to: null
      });

    const [visitDateRange, setVisitDateRange] = useState({
        from: null,
        to: null
      });

    const [dataValsList, setDataValsList] = useState({ casinos: [] })
    const [poiList, setPoiList] = useState([])
    const [currentPoi, setCurrentPoi] = useState(poi?poi:{name:'', casinos:[]})
    const [filteredPoi, setFilteredPoi] = useState(null)

    const [currentPoiList, setCurrentPoiList] = useState(() => {
        const savedPoiList = sessionStorage.getItem('currentPoiList');
        return savedPoiList ? JSON.parse(savedPoiList) : [];
      });
    const [selectedCasino, setSelectedCasino] = useState(() => {
        const savedCasino = sessionStorage.getItem('currentCasino');
        return savedCasino ? JSON.parse(savedCasino) : 'Select A Casino';
      }); // Initialize as an empty array
    const [expandedVisitIndex, setExpandedVisitIndex] = useState(null);
    const [activeCasinos, setActiveCasinos] = useState([])


    const toggleVisibility = (visitIndex) => {
        if (expandedVisitIndex === visitIndex) {
          setExpandedVisitIndex(null);  // collapse if the same row is clicked again
        } else {
          setExpandedVisitIndex(visitIndex);  // expand selected visit's transactions
        }
      };


    useEffect(() => {
        

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
            let casinos = matchingPoi.casinos ? [...matchingPoi.casinos] : [...currentPoi.casinos];

            
            id && casinos && setActiveCasinos(casinos);
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
        setIsLoading(false);
        
    }, []);

    useEffect(() => {
      setActiveCasinos(currentPoi.casinos)
    }, [currentPoi])
    
    useEffect(() => {
        if (currentPoi && selectedDayRange.from && selectedDayRange.to) {
          // Convert selectedDayRange to Date objects for comparison
          const startDate = new Date(selectedDayRange.from.year, selectedDayRange.from.month - 1, selectedDayRange.from.day);
          const endDate = new Date(selectedDayRange.to.year, selectedDayRange.to.month - 1, selectedDayRange.to.day);
      
          // Filter visits within the date range
          const filteredVisits = currentPoi.visits.filter(visit => {
            const arrivalDate = new Date(visit.arrival);
            const departureDate = new Date(visit.departure);
            return arrivalDate >= startDate && departureDate <= endDate;
          });
      
          // Update filteredPoi with a copy of currentPoi with the filtered visits
          setFilteredPoi({
            ...currentPoi,
            visits: filteredVisits
          });
        }
      }, [selectedDayRange, currentPoi, setFilteredPoi]);
    
    // render regular HTML input element
  const renderCustomInput = ({ ref }) => (
        <textarea
        readOnly
        className={`w-[120px] text-black text-center mr-2`}
        ref={ref} // necessary
        placeholder="Select to filter"
        value={selectedDayRange.from !== null  && selectedDayRange.to !== null ? `${selectedDayRange.from.month}/${selectedDayRange.from.day}/${selectedDayRange.from.year} -\n${selectedDayRange.to.month}/${selectedDayRange.to.day}/${selectedDayRange.to.year}` : ''}
        />
    )

    const updateVisitDateRange = (visits) => {
        let earliest = new Date(visits[0].arrival);
        let latest = new Date(visits[0].departure);
      
        visits.forEach(visit => {
          const arrivalDate = new Date(visit.arrival);
          const departureDate = new Date(visit.departure);
          
          if (arrivalDate < earliest) {
            earliest = arrivalDate;
          }
          if (departureDate > latest) {
            latest = departureDate;
          }
        });
      
        setVisitDateRange({
          from: {
            day: earliest.getDate(),
            month: earliest.getMonth() + 1, // getMonth() is zero-based, so add 1
            year: earliest.getFullYear()
          },
          to: {
            day: latest.getDate(),
            month: latest.getMonth() + 1, // getMonth() is zero-based, so add 1
            year: latest.getFullYear()
          }
        });
        setSelectedDayRange({
          from: {
            day: earliest.getDate(),
            month: earliest.getMonth() + 1, // getMonth() is zero-based, so add 1
            year: earliest.getFullYear()
          },
          to: {
            day: latest.getDate(),
            month: latest.getMonth() + 1, // getMonth() is zero-based, so add 1
            year: latest.getFullYear()
          }
        });
      };
      
      // Call this function whenever you need to update the date range, for example in a useEffect or after data is loaded
      useEffect(() => {
        if (currentPoi && currentPoi.visits && currentPoi.visits.length > 0) {
          updateVisitDateRange(currentPoi.visits);
          
        }
      }, [currentPoi]);
      


  return (
    <div className='justify-center items-center'> 
        <div className="overflow-y-auto h-screen">
        <div className='flex justify-center items-center'>
            <div className=' inline-block align-middle mb-6'>
                <table className='justify-center items-center mt-2 border border-kv-gray'>
                    <thead className='bg-dark-leather-2' onClick={() => console.log(currentPoi)}>
                        <tr>
                            <th>Select POI</th>
                            <th>Casino Filter</th>
                            <th>Date Range</th>
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
                                                            })).sort((a, b) => a.label.localeCompare(b.label))
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
                                                sessionStorage.setItem("currentCasino", JSON.stringify(e.value));
                                            }}
                                />
                            </th>
                            <th>
                                <DatePicker
                                    value={selectedDayRange}
                                    className={'mr-2'}
                                    onChange={setSelectedDayRange}
                                    inputPlaceholder="Select a day"
                                    renderInput={renderCustomInput} 
                                    minimumDate={visitDateRange.from}
                                    maximumDate={visitDateRange.to}
                                    shouldHighlightWeekends
                                />
                            </th>
                        </tr>
                    </thead>
                </table>
                </div>
                {selectedDayRange.to !== visitDateRange.to && selectedDayRange.from !== visitDateRange.from  && <button 
                    className='btn-xs mt-8 ml-1'
                    onClick={ ()=>
                        {
                            setSelectedDayRange({
                            from: visitDateRange.from,
                            to: visitDateRange.to})
                            setFilteredPoi(null)
                        }
                    }
                    >Reset</button>}
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
                                        return `$${Math.round(overallAverage).toLocaleString()}`
                                    })()
                                }
                            </th>
                            <th className='border border-kv-gray p-4 max-w-xs'>
                                {isLoading ? <p>Loading...</p> : Array.isArray(activeCasinos) && activeCasinos.join(', ')}
                            </th>
                        </tr>
                        <tr><th colSpan={3}>Player Notes</th></tr>
                        <tr><th colSpan={3}><textarea name="" id="" cols="40" rows="3" className='text-black' value={currentPoi.notes || ''} readOnly /></th></tr>
                    </thead>
                </table>
        </div>
        {  currentPoi.name != '' &&
             <VisitViewer   currentPoi={filteredPoi === null? currentPoi : filteredPoi}  expandedVisitIndex={expandedVisitIndex} toggleVisibility={toggleVisibility} dateTimeTransformer={dateTimeTransformer} timeTransformer={timeTransformer}  />
        }
    </div></div>
  )
}

export default Lookup