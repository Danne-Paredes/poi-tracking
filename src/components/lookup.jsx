import React, { useState, useEffect } from 'react'
import  EditNotes  from './editNotes'

const Lookup = (props) => {
//   const [openPlayerTransactionEditModal,setOpenPlayerTransactionEditModal] = useState(false)

  const casinos = [
        "Artichoke Joes",
        "Bay 101",
        "580 Casino",
        "Cordova",
        "Lodi",
        "Lotus",
        "Manteca",
        "Napa",
        "Palace"
    ]

 console.log(casinos)   

  const data = {
                  "name": "Duran",
                  "arrival": "2023-09-12T14:13",
                  "description": "Goes by Michael",
                  "casinos": "Lodi",
                  "visits": [
                      {
                          "casino": "Lodi",
                          "arrival": "2023-09-08T19:09",
                          "departure": "2023-09-08T20:09",
                          "transactions": [
                              {
                                  "amount": 100000,
                                  "date": "2023-09-08T19:09",
                                  "type": "Buy In",
                                  "note": ""
                              },
                              {
                                  "amount": 750,
                                  "date": "2023-09-08T19:13",
                                  "type": "Buy In",
                                  "note": ""
                              },
                              {
                                  "amount": 2200,
                                  "date": "2023-09-08T20:09",
                                  "type": "Cash Out",
                                  "note": ""
                              }
                          ]
                      },
                      {
                          "casino": "Lotus",
                          "arrival": "2023-09-09T19:10",
                          "departure": "2023-09-09T12:46",
                          "transactions": [
                              {
                                  "amount": 1000,
                                  "date": "2023-09-09T12:23",
                                  "type": "Buy In",
                                  "note": ""
                              },
                              {
                                  "amount": 1000,
                                  "date": "2023-09-09T12:33",
                                  "type": "Buy In",
                                  "note": "Tried to chop long bank"
                              },
                              {
                                  "amount": 200,
                                  "date": "2023-09-09T13:33",
                                  "type": "Cash Out",
                                  "note": "No luck with dragons"
                              }
                          ]
                      },
                      {
                          "casino": "Cordova",
                          "arrival": "2023-09-10T19:10",
                          "departure": "2023-09-13T12:46",
                          "transactions": [
                              {
                                  "amount": 1000,
                                  "date": "2023-09-13T12:23",
                                  "type": "Buy In",
                                  "note": ""
                              },
                              {
                                  "amount": 1000,
                                  "date": "2023-09-13T12:33",
                                  "type": "Buy In",
                                  "note": "Tried to chop long bank"
                              },
                              {
                                  "amount": 200,
                                  "date": "2023-09-13T13:33",
                                  "type": "Cash Out",
                                  "note": "No luck with dragons"
                              }
                          ]
                      }
                  ],
                  "id": "69417386-8d1c-496e-8d8f-dfd8e5d12404"
              }
  return (
    <div className='bg-black justify-center items-center'> 
        <EditNotes casinos={casinos} data={data} selectedVisit={data.visits[0]}/>
    </div>
  )
}

export default Lookup