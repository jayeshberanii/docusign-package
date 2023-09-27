import DsJwtAuth from 'docusign-package'
const iKey="936dc8a9-90cf-45b6-853e-c29f89ad5808"
const userGuide="00d3b054-00eb-4e93-84ae-49ed6e0a4373"
let tabValues={
  "eSignName": {
      "tabLabel": "Name of Investor",
      "tabId": "eSignNameOfInvestor",
      "anchorString": "/f01/",
      "value": "Jayesh Berani"
  },
  "eSignEmailAddress": {
      "tabLabel": "E-mail address",
      "tabId": "eSignEmailAddress",
      "anchorString": "/f02/",
      "value": "jayesh.aspire@gmail.com"
  },
  "eSignName": {
    "tabLabel": "Name of Project",
    "tabId": "eSignNameOfInvestor",
    "anchorString": "/f03/",
    "value": "My Project"
},
}
export default async function handler(req, res) {
  const a = await new DsJwtAuth({iKey:iKey,userGuide:userGuide})
  // const b =await a.createEnvelope({
  //   dsReturnUrl:"http://localhost:3000/callback",
  //   signerEmail:"jberani1432@gmail.com",
  //   signerName:"jayesh jayesh",
  //   emailSubject:"no subject",
  //   signerClientId:1000,
  //   status:'sent',
  //   outputFileName:"lorem ipsum", 
  //   docName:'Resume.docx',
  //   tabValues:tabValues
  // })
  const b=await a.createTemplateWithEnvelope()
  console.log(b,":::::::::::::::::::::");
  res.status(200).json(b)
}
