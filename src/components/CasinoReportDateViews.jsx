import React from 'react'
import { handleStateUpdate, convertDataToHtmlTable, copyToClipboard } from './functions'
import DataExporter from './DataExporter'

const CasinoReportDateViews = (props) => {
    const { state, setState } = props
    const { dateViewMode = 'monthly' } = state

    const data = [
      { Name: "John Doe", Email: "john@example.com", Status: "Active" },
      { Name: "Jane Doe", Email: "jane@example.com", Status: "Inactive" }
  ];

  return (
    <div className="flex justify-between items-center">
        <ul className="flex-1 flex justify-center items-center gap-3 sm:flex hidden">
          <li>
            <button 
              onClick={()=>{
                handleStateUpdate([], 'filteredVisits', setState)
                handleStateUpdate([], 'monthYearOptions', setState)
                handleStateUpdate([], 'weekOptions', setState)
                handleStateUpdate('monthly', 'dateViewMode', setState)
                // console.log('monthly')
              }} 
              className={`btn ${dateViewMode === 'monthly' ? 'bg-kv-red-force' : 'bg-black'}`}>
              Monthly View
            </button>
          </li>
          <li>
            <button 
              onClick={()=>{
                handleStateUpdate([], 'filteredVisits', setState)
                handleStateUpdate([], 'monthYearOptions', setState)
                handleStateUpdate([], 'weekOptions', setState)
                handleStateUpdate('weekly', 'dateViewMode', setState)
                // console.log('weekly')
              }}
              className={`btn ${dateViewMode === 'weekly' ? 'bg-kv-red-force' : 'bg-black'}`} >
              Weekly View
            </button>
          </li>
          <li>
            <button 
              onClick={()=>{
                handleStateUpdate([], 'filteredVisits', setState)
                handleStateUpdate([], 'monthYearOptions', setState)
                handleStateUpdate([], 'weekOptions', setState)
                handleStateUpdate('daily', 'dateViewMode', setState)
                // console.log('daily')
              }}
              className={`btn ${dateViewMode === 'daily' ? 'bg-kv-red-force' : 'bg-black'}`}>
              Daily View
            </button>
          </li>
          {/* <li>
            <DataExporter data={data}/>
          </li> */}
        </ul>
    </div>
  )
}

export default CasinoReportDateViews