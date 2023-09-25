const docusign = require("docusign-esign");
const moment = require("moment");
const fs = require("fs");

let DsJwtAuth = function _DsJwtAuth(req) {
  this.accessToken = null
  this._tokenExpiration = ''
  this.scopes =
    "signature dtr.rooms.read dtr.rooms.write dtr.documents.read dtr.documents.write dtr.profile.read dtr.profile.write dtr.company.read dtr.company.write room_forms click.manage click.send organization_read group_read permission_read user_read user_write account_read domain_read identity_provider_read user_data_redact asset_group_account_read asset_group_account_clone_write asset_group_account_clone_read";
  this.targetAccountId = false;
  this.production = false;
  this.tokenReplaceMin = 10;
  this.tokenReplaceMinGet = 30;
  this.dsOauthServer = this.production
    ? "https://account.docusign.com"
    : "https://account-d.docusign.com";
};

module.exports = DsJwtAuth;


// Get Access Token
DsJwtAuth.prototype.getToken = async function _getToken() {
  let dsClientId = "936dc8a9-90cf-45b6-853e-c29f89ad5808";
  let impersonatedUserGuid = "00d3b054-00eb-4e93-84ae-49ed6e0a4373";
  let rsaKey = fs.readFileSync("config/private.key");

  const jwtLifeSec = 10 * 60,
    dsApi = new docusign.ApiClient();
  dsApi.setOAuthBasePath(this.dsOauthServer.replace("https://", ""));

  const results = await dsApi.requestJWTUserToken(
    dsClientId,
    impersonatedUserGuid,
    this.scopes,
    rsaKey,
    jwtLifeSec
  );

  const expiresAt = moment()
    .add(results.body.expires_in, "s")
    .subtract(this.tokenReplaceMin, "m");
  this.accessToken = results.body.access_token;
  this._tokenExpiration = expiresAt;
  console.log("AccessToken get succes***");
  return {
    accessToken: results.body.access_token,
    tokenExpirationTimestamp: expiresAt,
  };
};


// Get User Info
DsJwtAuth.prototype.getUserInfo = async function _getUserInfo() {
  const { accessToken } = await this.getToken()
  const dsApi = new docusign.ApiClient(),
    targetAccountId = this.targetAccountId,
    baseUriSuffix = "/restapi";

  dsApi.setOAuthBasePath(this.dsOauthServer.replace("https://", ""));
  const results = await dsApi.getUserInfo(accessToken);

  let accountInfo;
  if (!Boolean(targetAccountId)) {
    // find the default account
    accountInfo = results.accounts.find(
      (account) => account.isDefault === "true"
    );
  } else {
    // find the matching account
    accountInfo = results.accounts.find(
      (account) => account.accountId == targetAccountId
    );
  }
  if (typeof accountInfo === "undefined") {
    throw new Error(`Target account ${targetAccountId} not found!`);
  }

  this.accountId = accountInfo.accountId;
  this.accountName = accountInfo.accountName;
  this.basePath = accountInfo.baseUri + baseUriSuffix;
  let obj={
    accountId: this.accountId,
    basePath: this.basePath,
    accountName: this.accountName,
    accessToken: accessToken
  }
  console.log("Account Info get Success***",obj);
  return {
    accountId: this.accountId,
    basePath: this.basePath,
    accountName: this.accountName,
    accessToken: accessToken
  };
};

DsJwtAuth.prototype.makeTemplate = async function _makeTemplate() {
  let docPdfBytes;
  docPdfBytes = fs.readFileSync('config/World_Wide_Corp_lorem.pdf');
  // add the documents
  let doc = new docusign.Document()
  let docB64 = Buffer.from(docPdfBytes).toString("base64");
  doc.documentBase64 = docB64;
  doc.name = "Lorem Ipsum";
  doc.fileExtension = "pdf";
  doc.documentId = "1";

  let signer1 = docusign.Signer.constructFromObject({
    roleName: "signer",
    recipientId: "1",
    routingOrder: "1",
  });

  let cc1 = new docusign.CarbonCopy();
  cc1.roleName = "cc";
  cc1.routingOrder = "2";
  cc1.recipientId = "2";

  let signHere = docusign.SignHere.constructFromObject({
    documentId: "1",
    pageNumber: "1",
    xPosition: "191",
    yPosition: "148",
  }),
    check1 = docusign.Checkbox.constructFromObject({
      documentId: "1",
      pageNumber: "1",
      xPosition: "75",
      yPosition: "417",
      tabLabel: "ckAuthorization",
    }),
    check2 = docusign.Checkbox.constructFromObject({
      documentId: "1",
      pageNumber: "1",
      xPosition: "75",
      yPosition: "447",
      tabLabel: "ckAuthentication",
    }),
    check3 = docusign.Checkbox.constructFromObject({
      documentId: "1",
      pageNumber: "1",
      xPosition: "75",
      yPosition: "478",
      tabLabel: "ckAgreement",
    }),
    check4 = docusign.Checkbox.constructFromObject({
      documentId: "1",
      pageNumber: "1",
      xPosition: "75",
      yPosition: "508",
      tabLabel: "ckAcknowledgement",
    }),
    list1 = docusign.List.constructFromObject({
      documentId: "1",
      pageNumber: "1",
      xPosition: "142",
      yPosition: "291",
      font: "helvetica",
      fontSize: "size14",
      tabLabel: "list",
      required: "false",
      listItems: [
        docusign.ListItem.constructFromObject({ text: "Red", value: "red" }),
        docusign.ListItem.constructFromObject({
          text: "Orange",
          value: "orange",
        }),
        docusign.ListItem.constructFromObject({
          text: "Yellow",
          value: "yellow",
        }),
        docusign.ListItem.constructFromObject({
          text: "Green",
          value: "green",
        }),
        docusign.ListItem.constructFromObject({ text: "Blue", value: "blue" }),
        docusign.ListItem.constructFromObject({
          text: "Indigo",
          value: "indigo",
        }),
        docusign.ListItem.constructFromObject({
          text: "Violet",
          value: "violet",
        }),
      ],
    }),
    numerical = docusign.Numerical.constructFromObject({
      validationType: "Currency",
      documentId: "1",
      pageNumber: "1",
      xPosition: "163",
      yPosition: "260",
      font: "helvetica",
      fontSize: "size14",
      tabLabel: "numericalCurrency",
      height: "23",
      width: "84",
      required: "false"
    }),
    radioGroup = docusign.RadioGroup.constructFromObject({
      documentId: "1",
      groupName: "radio1",
      radios: [
        docusign.Radio.constructFromObject({
          font: "helvetica",
          fontSize: "size14",
          pageNumber: "1",
          value: "white",
          xPosition: "142",
          yPosition: "384",
          required: "false",
        }),
        docusign.Radio.constructFromObject({
          font: "helvetica",
          fontSize: "size14",
          pageNumber: "1",
          value: "red",
          xPosition: "74",
          yPosition: "384",
          required: "false",
        }),
        docusign.Radio.constructFromObject({
          font: "helvetica",
          fontSize: "size14",
          pageNumber: "1",
          value: "blue",
          xPosition: "220",
          yPosition: "384",
          required: "false",
        }),
      ],
    }),
    text = docusign.Text.constructFromObject({
      documentId: "1",
      pageNumber: "1",
      xPosition: "153",
      yPosition: "230",
      font: "helvetica",
      fontSize: "size14",
      tabLabel: "text",
      height: "23",
      width: "84",
      required: "false",
    });

  let signer1Tabs = docusign.Tabs.constructFromObject({
    checkboxTabs: [check1, check2, check3, check4],
    listTabs: [list1],
    numericalTabs: [numerical],
    radioGroupTabs: [radioGroup],
    signHereTabs: [signHere],
    textTabs: [text],
  });
  signer1.tabs = signer1Tabs;

  let recipients = docusign.Recipients.constructFromObject({
    signers: [signer1],
    carbonCopies: [cc1],
  });

  let template = new docusign.EnvelopeTemplate.constructFromObject({
    // The order in the docs array determines the order in the env
    documents: [doc],
    emailSubject: "Please sign this document",
    description: "Example template created via the API",
    name: "Example Signer and CC template",
    shared: "false",
    recipients: recipients,
    status: "created",
  });

  // console.log(template);

  return template;
}

DsJwtAuth.prototype.createTemplate = async function _createTemplate() {
  const response = await this.getUserInfo()
  // console.log(response);
  let dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(response.basePath);
  dsApiClient.addDefaultHeader("Authorization", "Bearer " + response.accessToken);
  let envelopesApi = new docusign.EnvelopesApi(dsApiClient);
  let templatesApi = new docusign.TemplatesApi(dsApiClient),
    results = null,
    templateId = null, // the template that exists or will be created.
    templateName = "test-template"
  resultsTemplateName = null,
    createdNewTemplate = null;

  results = await templatesApi.listTemplates(response.accountId, {
    searchText: templateName,
  });
  // console.log(results.envelopeTemplates[0].owner);

  if (results.resultSetSize > 0) {
    templateId = results.envelopeTemplates[0].templateId;
    const formData = await envelopesApi.getFormData("d5699753-f73f-4701-9905-53e644161ee9", "6a0c77f7-f642-4d74-b1f6-1b104eb6fd3b");
    console.log(formData,"::::: Form Data ::::::");
    resultsTemplateName = results.envelopeTemplates[0].name;
    createdNewTemplate = false;
  } else {
    throw new Error('template not found in your account')
    // // Template doesn't exist. Therefore create it...
    // // Step 2 Create the template
    // //ds-snippet-start:eSign8Step3
    // let templateReqObject = makeTemplate(args);
    // results = await templatesApi.createTemplate(args.accountId, {
    //   envelopeTemplate: templateReqObject,
    // });
    // //ds-snippet-end:eSign8Step3
    // createdNewTemplate = true;
    // // Retrieve the new template Name / TemplateId
    // results = await templatesApi.listTemplates(args.accountId, {
    //   searchText: args.templateName,
    // });
    // templateId = results.envelopeTemplates[0].templateId;
    // resultsTemplateName = results.envelopeTemplates[0].name;
  }
  let obj={
    templateId: templateId,
    templateName: resultsTemplateName,
  }
  console.log("Get template success***",obj);
  return {
    templateId: templateId,
    templateName: resultsTemplateName,
    createdNewTemplate: createdNewTemplate,
  };
}
function makeSenderViewRequest(args) {
  let viewRequest = new docusign.ReturnUrlRequest();
  viewRequest.returnUrl = "http://localhost:3000/";
  return viewRequest;
}
function makeRecipientViewRequest(args) {

  let viewRequest = new docusign.RecipientViewRequest();

  viewRequest.returnUrl = "http://localhost:3000" + "?state=123";

  // viewRequest.authenticationMethod = "none";

  viewRequest.email = 'jayeshberanii@gmail.com';
  viewRequest.userName = 'jayeshberani';
  // viewRequest.clientUserId = '00d3b054-00eb-4e93-84ae-49ed6e0a4373';

  return viewRequest;
}

DsJwtAuth.prototype.sendEnvelopeUsingEmbeddedSending = async function _sendEnvelopeUsingEmbeddedSending(){
  const response = await this.getUserInfo()
  const templateResponse=await this.createTemplate()
  let dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(response.basePath);
  dsApiClient.addDefaultHeader("Authorization", "Bearer " + response.accessToken);
  let envelopesApi = new docusign.EnvelopesApi(dsApiClient);

  let viewRequest=makeSenderViewRequest()

  results = await envelopesApi.createSenderView(response.accountId, templateResponse.templateId, {
    returnUrlRequest: viewRequest,
  });

  // console.log(results);
  let url = results.url;

  return { envelopeId: templateResponse.templateId, redirectUrl: url };
}

DsJwtAuth.prototype.sendEnvelopeForEmbeddedSigning = async function _sendEnvelopeForEmbeddedSigning(){
  const response = await this.getUserInfo()
  const templateResponse=await this.createTemplate()
  let dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(response.basePath);
  dsApiClient.addDefaultHeader("Authorization", "Bearer " + response.accessToken);
  let envelopesApi = new docusign.EnvelopesApi(dsApiClient);

  let viewRequest=makeRecipientViewRequest()

  let results = await envelopesApi.createRecipientView(response.accountId, templateResponse.templateId, {
    recipientViewRequest: viewRequest,
  });
  console.log(results.url);

  return { envelopeId: templateResponse.templateId, redirectUrl: results.url };

}

const a = new DsJwtAuth()
a.createTemplate()

