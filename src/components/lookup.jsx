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
    const [currentPoi, setCurrentPoi] = useState(poi?poi:{name:''})
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
        const fetchDataVals = async () => {
          const data = await getDataVals();
          const data2 = await getPoiData();
          setDataValsList(data);
          setPoiList(data2);
      
          // Update currentPoiList with new visits from poiList and add new visit if transactions are present
          const updatedCurrentPoiList = currentPoiList.map(currentPoi => {
            const matchingPoi = data2.find(poi => poi.id === currentPoi.id);
      
            // 1. If there's a matching POI from data2, use its visits, else use the currentPoi's visits.
            let visits = matchingPoi ? [...matchingPoi.visits] : [...currentPoi.visits];
      
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
        <button onClick={()=>console.log(poiList)}>poiList</button>
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
        {  currentPoi.name != '' &&
             <VisitViewer   currentPoi={currentPoi}  expandedVisitIndex={expandedVisitIndex} toggleVisibility={toggleVisibility} dateTimeTransformer={dateTimeTransformer} timeTransformer={timeTransformer}  />
        }
    </div>
  )
}

export default Lookup