import React from 'react'

const MainSection = () => {
   
   const createEnvelop=async()=>{
    const res=await fetch('http://localhost:3000/api/signProc')
      const result=await res.json()
      console.log(result);
   }
  return (
    <>
    <div>MainSection</div>
    <button onClick={createEnvelop}>Create Envelop</button>
    </>
  )
}

export default MainSection