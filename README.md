
# npm-package

A brief description of what this project does and who it's for


## Installation

Install our package with npm

```bash
  npm install npm-package
```
    
## Usage/Examples

```javascript
import DsJwtAuth from 'docusign-package'

const obj={
    integrationKey:"",
    userId:""
}

async function handler() {
  const JwtAuth = await new DsJwtAuth(obj)
}
```
```javascript
async function getToken() {
  const JwtAuth = await new DsJwtAuth(obj)
  const response = await JwtAuth.getToken()
}
```
```javascript
const payload={
    dsReturnUrl:"http://localhost:3000/callback",
    signerEmail:"test@gmail.com",
    signerName:"lorem ipsum",
    emailSubject:"subject here",
    signerClientId:1000,
    status:'sent',
    outputFileName:"lorem ipsum", 
    docName:'document.docx',
    tabValues:{
        "eSignName": {
            "tabLabel": "Name",
            "tabId": "eSignName",
            "anchorString": "/f01/",
            "value": "lorem ipsum"
        },
        "eSignEmailAddress": {
            "tabLabel": "E-mail address",
            "tabId": "eSignEmailAddress",
            "anchorString": "/f02/",
            "value": "test@gmail.com"
        },
        "eSignName": {
            "tabLabel": "Project Name",
            "tabId": "eSignNameOfInvestor",
            "anchorString": "/f03/",
            "value": "lorem ipsum"
        },
    }
}
async function createEnvelope() {
  const JwtAuth = await new DsJwtAuth(obj)
  const response = await JwtAuth.createEnvelope(payload)
}
```

```javascript
const templateRoles=[
    {
      roleName: 'Signer',           // Role name as defined in the template
      name: 'lorem ipsum',       // Recipient's name
      email: 'test@gmail.com', // Recipient's email
      roleName: 'Signer',
      authenticationMethod: 'None',
      tabs: {
        textTabs: [
          {
            tabLabel: 'T01',
            value: 'lorem ipsum',
          },
          {
            tabLabel: 'T02',
            value: 'lorem ipsum',
          },
        ],
      },
    },
    // Add more recipients and roles as needed
]

async function createTemplateWithEnvelope() {
  const JwtAuth = await new DsJwtAuth(obj)
  const response = await JwtAuth.createTemplateWithEnvelope(templateName,templateRoles)
}
```
