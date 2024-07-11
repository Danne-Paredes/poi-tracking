import React, { useState, useEffect } from 'react';
import { handleStateUpdate, exportToEmail, generateHtmlTable, getAdminEmails } from './functions';

const CasinoReportDateViews = (props) => {
  const { state, setState } = props;
  const { dateViewMode = 'monthly', filteredPois=[], selectedCasino, filteredVisits, selectedWeek, selectedDay, selectedMonthYear,emails,htmlTable, user } = state;
  // const [emailData, setEmailData] = useState({
  //   // emails: ['dparedes@knighted.com', 'jpizano@knighted.com','oforsee@knighted.com','lscott@knighted.com'],
  //   emails: ['dparedes@knighted.com'],
  //   htmlTable: ''
  // });

  

  

  const sendEmail = async () => {
    const url = 'https://us-central1-poi-tracking.cloudfunctions.net/sendEmail';
    const emailData = {
      emails,
      htmlTable

    }
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      });
      if (response.ok) {
        console.log('Emails sent successfully');
      } else {
        console.error('Error sending emails:', await response.text());
      }
    } catch (error) {
      console.error('Error sending emails:', error);
    }
  };

  



  return (
    <div className="flex justify-between items-center">
      <ul className="flex-1 flex justify-center items-center gap-3">
        <li>
          <button 
            onClick={()=>{
              handleStateUpdate([], 'filteredVisits', setState);
              handleStateUpdate([], 'monthYearOptions', setState);
              handleStateUpdate([], 'weekOptions', setState);
              handleStateUpdate('monthly', 'dateViewMode', setState);
            }} 
            className={`btn ${dateViewMode === 'monthly' ? 'bg-kv-red-force' : 'bg-black'}`}>
            Monthly View
          </button>
        </li>
        <li>
          <button 
            onClick={()=>{
              handleStateUpdate([], 'filteredVisits', setState);
              handleStateUpdate([], 'monthYearOptions', setState);
              handleStateUpdate([], 'weekOptions', setState);
              handleStateUpdate('weekly', 'dateViewMode', setState);
            }}
            className={`btn ${dateViewMode === 'weekly' ? 'bg-kv-red-force' : 'bg-black'}`} >
            Weekly View
          </button>
        </li>
        <li>
          <button 
            onClick={()=>{
              handleStateUpdate([], 'filteredVisits', setState);
              handleStateUpdate([], 'monthYearOptions', setState);
              handleStateUpdate([], 'weekOptions', setState);
              handleStateUpdate('daily', 'dateViewMode', setState);
            }}
            className={`btn ${dateViewMode === 'daily' ? 'bg-kv-red-force' : 'bg-black'}`}>
            Daily View
          </button>
        </li>
        {user?.title !== 'Lead' && user?.title !== 'Black Belt Lead' && <li>
          <button 
            // onClick={()=>console.log(state)}
            onClick={sendEmail}
            className={`btn`}>
            Export
          </button>
        </li>}
      </ul>
    </div>
  );
};

export default CasinoReportDateViews;