import React from 'react'

const MainSection = () => {
   
   
   React.useEffect(()=>{
    const getResult=async()=>{
      const res=await fetch('http://localhost:3000/api/signProc')
      const result=await res.json()
      console.log(result);
    } 
    getResult()
   },[])
  return (
    <div>MainSection</div>
  )
}

export default MainSection