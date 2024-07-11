import React,{ useState, useEffect } from 'react'
import { handleStateUpdate, fetchDataVals, getComponentByName, getAdminEmails, generateHtmlTable } from '../components/functions'
import { CasinoReportModalViewer } from '../components/CasinoReportModalViewer';
import { CasinoReportEmailModal } from '../components/CasinoReportEmailModal';
import CasinoReportDateViews from '../components/CasinoReportDateViews'
import CasinoReportTableBodyMonthly from '../components/CasinoReportTableBody'
import CasinoReportTableHeadMonthly from '../components/CasinoReportTableHeadMonthly'

const CasinoView = ({user}) => {
  const [ state, setState ] = useState({
    poi: { casinos: []},
    poiList: [],
    sortedVisit:[],
    selectedModal: '',
    openModal: false,
    dataValsList: { casinos:[]},
    selectedCasino:'',
    selectedMonthYear: '',
    dateViewMode: 'monthly',
    filteredVisits: [],
    openModal: false,
    openEmailModal: false,
    emails: [user.email],
    htmlTable: '',
    filteredPois:[]
  });

  const { poiList, dataValsList, selectedCasino, currentMonth, currentYear, selectedMonthYear, dateViewMode, openModal, openEmailModal, filteredPois, } = state
  
  const [currentPoiList, setCurrentPoiList] = useState([])

  
  
  
  useEffect(() => {
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentDate = new Date();
    const savedCasino = sessionStorage.getItem('currentCasino')
    // const emails = getAdminEmails(selectedCasino, setState)
    // console.log(emails)
    
    handleStateUpdate(savedCasino?  JSON.parse(savedCasino) : 'Select A Casino' , 'selectedCasino', setState)
    handleStateUpdate(currentDate.getMonth(), 'currentMonth', setState)
    handleStateUpdate(currentDate.getFullYear(), 'currentYear', setState)
    handleStateUpdate(user, 'user', setState);
    fetchDataVals( setState, selectedCasino, setCurrentPoiList);
  }, []);
  
  useEffect(() => {
    // const emails = getAdminEmails(selectedCasino, setState)
    const htmlTable = generateHtmlTable(filteredPois, state); // Generate HTML table from filteredPois
    handleStateUpdate(htmlTable,"htmlTable",setState);
  }, [filteredPois]);
  
  
  const props = { state, setState }
  
  return (
    <div >
    {/* <div onClick={()=>console.log(`${dateViewMode}Body`)}> */}
      <CasinoReportDateViews {...props} />
      <div className='flex justify-center items-center' >
        <table className='casino-view justify-center items-center mt-2 border  border-kv-gray mx-2 mb-5' >
            { getComponentByName(`${dateViewMode}Head`, props) }
            {/* <CasinoReportTableHeadMonthly {...props} />
            */}
            <CasinoReportTableBodyMonthly {...props} /> 
          </table>
      </div>
      {openModal && <CasinoReportModalViewer {...props} />}
      {openEmailModal && <CasinoReportEmailModal {...props} />}
    </div>
  )
}

export default CasinoView