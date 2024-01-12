import { VisitViewer } from './visitViewer';
import React, { useState, useEffect } from 'react'
import { getDataVals, getPoiData } from '../config/firebase'
import { useParams, useLocation } from 'react-router-dom';
import SingleSelect from './singleSelect';
import MultiSelect from './multiSelect';
import { dateTimeTransformer, dateTransformer, timeTransformer } from './functions'
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker from '@hassanmojab/react-modern-calendar-datepicker';
import LookupSelector from './lookupSelector';
import LookupDescription from './lookupDescription';


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
    //   const currentDate = new Date();
      
    //   return {
    //     from: {
    //       day: 1,
    //       month: 1, // January
    //       year: currentDate.getFullYear() // Current year
    //     },
    //     to: {
    //       day: currentDate.getDate(), // Current day
    //       month: currentDate.getMonth() + 1, // getMonth() is zero-based, so add 1
    //       year: currentDate.getFullYear() // Current year
    //     }
    //   };
    // });
      

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
    
      const casinoOptions = dataValsList.casinos.map(casino => ({
        value: casino,
        label: casino
      }))

      const poiOptions = poiList.filter(poi => selectedCasino ? poi.casinos.includes(selectedCasino) : true).map(poi => ({
        value: poi.name,
        label: poi.name
      })).sort((a, b) => a.label.localeCompare(b.label))


      const handlePoiChange = (e) =>{
          const matchingPoi = poiList.find(poi => poi.name === e.value);
          setCurrentPoi(matchingPoi);
      }


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
            let visits = [];

            if (matchingPoi && matchingPoi.visits) {
                visits = [...matchingPoi.visits];
            } else if (currentPoi && currentPoi.visits) {
                visits = [...currentPoi.visits];
            }

            let casinos = [];

            if (matchingPoi && matchingPoi.casinos) {
                casinos = [...matchingPoi.casinos];
            } else if (currentPoi && currentPoi.casinos) {
                casinos = [...currentPoi.casinos];
            }

            
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
            const departureDate = visit.departure? new Date(visit.departure): new Date(visit.arrival);
        
            // Adjust startDate and endDate to cover the full day
            const startOfDay = startDate.setHours(0,0,0,0);
            const endOfDay = endDate.setHours(23,59,59,999);
        
            return arrivalDate.getTime() >= startOfDay && departureDate.getTime() <= endOfDay;
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
      let earliest = new Date(); // Initialize with current date, assuming visits are in the past
      let latest = new Date(0); // Initialize with the earliest time possible
      
      visits.forEach(visit => {
        const arrivalDate = new Date(visit.arrival);
        
        if (arrivalDate <= earliest) {
          earliest = arrivalDate;
        }
      
        if (visit.departure) { // If departure exists, use it for comparison
          const departureDate = new Date(visit.departure);
          if (departureDate >= latest) {
            latest = departureDate;
          }
        } else { // If no departure, use the largest arrival date so far
          if (arrivalDate >= latest) {
            latest = arrivalDate;
          }
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
        <LookupSelector 
          currentPoi={currentPoi} 
          selectedCasino={selectedCasino} 
          setSelectedCasino={setSelectedCasino} 
          selectedDayRange={selectedDayRange} 
          setSelectedDayRange={setSelectedDayRange} 
          renderCustomInput={renderCustomInput} 
          setFilteredPoi={setFilteredPoi} 
          visitDateRange={visitDateRange} 
          casinoOptions={casinoOptions} 
          poiOptions={poiOptions} 
          handlePoiChange={handlePoiChange} 
        />
        <LookupDescription   
          currentPoi={currentPoi} 
          isLoading={isLoading} 
          activeCasinos={activeCasinos}  
          />
        {  currentPoi.name != '' &&
             <VisitViewer   currentPoi={filteredPoi === null? currentPoi : filteredPoi}  expandedVisitIndex={expandedVisitIndex} toggleVisibility={toggleVisibility} dateTimeTransformer={dateTimeTransformer} timeTransformer={timeTransformer}  />
        }
    </div></div>
  )
}


    export default Lookup