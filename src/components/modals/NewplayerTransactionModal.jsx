import React, {useState, useEffect, useRef} from 'react'
import SingleSelect from '../singleSelect';
import MultiSelect from '../multiSelect';

export const NewPlayerTransactionModal = ({ setShowModal,  addTransaction, index, games}) => {
  const [formState, setFormState] = useState({
    transactionAmount: 0,
    selectedDateTime: '',
    selectedGame:'',
    type: 'Buy In',
    note: '',
    transactionDetails: [],
  });

  const options = [ 
    ...games.map((game) => {
       return { value: game, label: game };
    })];

  const inputRef = useRef(null);
  const modalRef = useRef(null);

  const { transactionAmount, selectedDateTime, type, note, transactionDetails, selectedGame } = formState;

  const handleDateTimeChange = (event) => {
    const inputDate = event.target.value;
    setFormState((prevState) => ({
      ...prevState,
      selectedDateTime: inputDate,
    }));
  };
  
  useEffect(() => {
    console.log('games')
    console.log(games)
    
    const currentDate = new Date();
    const timezoneOffsetInMinutes = currentDate.getTimezoneOffset();
    const adjustedDate = new Date(currentDate.getTime() - timezoneOffsetInMinutes * 60000);

    const adjustedDateTime = adjustedDate.toISOString().slice(0, 16);

    setFormState((prevState) => ({
      ...prevState,
      selectedDateTime: adjustedDateTime,
    }));
  }, []);

  useEffect(()=>{
    type === 'Cash Out' ? setFormState((prevState) => ({
      ...prevState,
      transactionDetails: {
        date:selectedDateTime,
        type:type,
        game: selectedGame,
        amount:transactionAmount,
        note:note,
        index:index
      },
    })) :

    setFormState((prevState) => ({
      ...prevState,
      transactionDetails: {
        date:selectedDateTime,
        type:type,
        amount:transactionAmount,
        note:note,
        index:index
      },
    }));

    },[transactionAmount,selectedDateTime,note,type]);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
  
      const handleEscape = (event) => {
        if (event.key === 'Escape') {
          setShowModal(false);
        }
      };
  
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          setShowModal(false);
        }
      };
  
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
  
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleAmountChange = (e)=>{
    const inputNumber = parseInt(e.target.value);
    setFormState((prevState) => ({
      ...prevState,
      transactionAmount: inputNumber,
    }));
    console.log(`transaction amount: ${transactionAmount}`)
  }
  const handleNoteChange = (e)=>{
    const note = e.target.value;
    setFormState((prevState) => ({
      ...prevState,
      note: note,
    }));
    console.log(`Note: ${note}`)
  }
  const handleTypeChange = (type)=>{
      setFormState((prevState) => ({
          ...prevState,
          type: type,
      }));
      console.log(`type: ${type}`)
  }

  const handleSubmit = () => {
    const {amount,date,type, note,index} = transactionDetails
    console.log('index:')
    console.log(index)
    addTransaction(amount,date,type, note,index)
  };

  return (
    <div
      className="justify-center items-start pt-6 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-dark-denim"
    >
      <div ref={modalRef} className="relative w-auto  mx-auto max-w-3xl">
        {/*content*/}
        <div className="border-0 rounded-lg mt-0 items-center shadow-lg relative flex flex-col w-full bg-dark-leather-2 outline-none focus:outline-none">
          {/*header*/}
          <div onClick={()=>console.log(formState)}  className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
            <h3 className="text-3xl font-semibold text-center text-kv-gray" >
              Add Transaction
            </h3>
          </div>
          {/*body*/}
          <div className="relative p-6 flex-auto">
            <div className='flex justify-center mx-auto items-center text-center block mb-2'>
                <input
                    className='block mb-2'
                    type="datetime-local"
                    defaultValue={selectedDateTime}
                    onChange={handleDateTimeChange}
                />
            </div>
            <div className='justify-center mx-auto items-center text-center block mb-2'>
                <label className=' text-kv-gray mr-5'>
                    <input 
                        className='mr-2'
                        onChange={() => handleTypeChange("Buy In")} 
                        type="radio" 
                        value="Buy In" 
                        name="type" 
                        defaultChecked
                    /> 
                    Buy In
                </label>
                <label className=' text-kv-gray mr-5'>
                    <input 
                        className='mr-2'
                        onChange={() => handleTypeChange("Cash Out")} 
                        type="radio" 
                        value="Cash Out" 
                        name="type"
                    /> 
                    Cash Out
                </label>
                <label className=' text-kv-gray'>
                    <input 
                        className='mr-2'
                        onChange={() => handleTypeChange("Note")} 
                        type="radio" 
                        value="Note" 
                        name="type"
                    /> 
                    Note
                </label>
            </div>
            {type === 'Cash Out' && 
              <div className='w-full flex justify-center'><SingleSelect
                className =  'mb-2 w-28'
                value={selectedGame ? { label: selectedGame, value: selectedGame } : null}
                options={options}
                onChange={(e) =>{
                  const newGame = e.value
                  setFormState((prev)=>({
                    ...prev,
                    selectedGame:newGame
                   }))}
                }
              /></div>
            }
            { type !== "Note" && <div className='flex justify-center mx-auto items-center text-center block mb-2'>
                <input onKeyDown={handleKeyDown} ref={inputRef} type='number' placeholder='Amount' onChange={handleAmountChange}/>
            </div>}
            <div className='flex justify-center mx-auto items-center text-center block mb-2'>
                <textarea onKeyDown={handleKeyDown} placeholder='Notes' onChange={handleNoteChange}></textarea>
            </div>
        </div>

          {/*footer*/}
          <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
            <button
              className="btn-close"
              type="button"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
            <button
              className="btn-gray"
              type="button"
              onClick={handleSubmit}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}