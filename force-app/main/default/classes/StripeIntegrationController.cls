public without sharing class StripeIntegrationController {
    public class PaymentResult {
    @AuraEnabled
    public String stripeId { get; set; }
    @AuraEnabled
    public String paymentStatus { get; set; }
    @AuraEnabled
    public String paymentMessage { get; set; }
}
    
    
    
    @AuraEnabled
    //public static string processPayment(String name,string cardNumber, Integer expiryMonth, Integer expiryYear, string cvc, Decimal amount)
    public static PaymentResult processPayment(String name,string cardNumber, Integer expiryMonth, Integer expiryYear, string cvc, Decimal amount)
    {
     	PaymentResult result = new PaymentResult();
        //added new code on 15-04
         try {
            String apiKey = 'sk_test_51OyyKJEsYxenfr26MN8juMKqTSZWNkOb4cKGFG2R4855VzVYWjM0xPfhKlZsXPayhnN3czmmulMH5dkXhyzpulWv00CCfMaw8p';
            String baseUrl = 'https://api.stripe.com/v1';
            
            // Create token
            String tokenUrl = baseUrl + '/tokens';
            String tokenBody = 'card[number]=' + EncodingUtil.urlEncode(cardNumber, 'UTF-8') +
                               '&card[exp_month]=' + expiryMonth +
                               '&card[exp_year]=' + expiryYear +
                               '&card[cvc]=' + EncodingUtil.urlEncode(cvc, 'UTF-8');
            HttpRequest tokenRequest = new HttpRequest();
            tokenRequest.setEndpoint(tokenUrl);
            tokenRequest.setMethod('POST');
            tokenRequest.setHeader('Authorization', 'Bearer ' + apiKey);
            tokenRequest.setHeader('Content-Type', 'application/x-www-form-urlencoded');
            tokenRequest.setBody(tokenBody);
            Http http = new Http();
            HttpResponse tokenResponse = http.send(tokenRequest);
            String tokenJson = tokenResponse.getBody();
            Map<String, Object> tokenMap = (Map<String, Object>) JSON.deserializeUntyped(tokenJson);
            String tokenId = (String) tokenMap.get('id');
            System.debug('ctokenId'+tokenId);
            // Create charge
            Decimal decimalValue = amount * 100;
			Integer integerValue = decimalValue.intValue();
            String chargeUrl = baseUrl + '/charges';
            String chargeBody = //'amount=' + String.valueOf(amount * 100) + // Stripe requires amount in cents
                				'amount=' + integerValue +
                                '&currency=usd' +
                                '&description=Payment for Salesforce service' +
                                '&source=' + tokenId;
            HttpRequest chargeRequest = new HttpRequest();
            chargeRequest.setEndpoint(chargeUrl);
            chargeRequest.setMethod('POST');
            chargeRequest.setHeader('Authorization', 'Bearer ' + apiKey);
            chargeRequest.setHeader('Content-Type', 'application/x-www-form-urlencoded');
            chargeRequest.setBody(chargeBody);
            HttpResponse chargeResponse = http.send(chargeRequest);
            System.debug('chargeResponse.'+chargeResponse);
            String chargeJson=chargeResponse.getBody();
             System.debug('chargeJson'+chargeJson);
            Map<String, Object> chargeMap = (Map<String, Object>) JSON.deserializeUntyped(chargeJson);
              System.debug('chargeMap'+chargeMap);  
            if (chargeResponse.getStatusCode() == 200 || chargeResponse.getStatusCode() == 201) {
                System.debug('chargeResponse.getStatusCode()'+chargeResponse.getStatusCode());
                System.debug('chargeResponse'+chargeResponse);
                //return 'SUCCESS';
                result.stripeId =  (String) chargeMap.get('id');
                result.paymentStatus = chargeResponse.getStatus();
                //return chargeResponse.getStatus();
            } else if(chargeResponse.getStatusCode() != 200 || chargeResponse.getStatusCode() != 201) 
            {
                 System.debug('chargeResponse.getStatusCode()'+chargeResponse.getStatusCode());
                System.debug('(string)chargeMap.get(message)'+(string)chargeMap.get('message'));
                String errorMessage = (String)chargeMap.get('error.message');
    			result.paymentMessage = errorMessage != null ? errorMessage : 'Payment Failed. Please Check Card Deatils';
    			result.paymentStatus = chargeResponse.getStatus();
            }
             else
             {
                 System.debug('(string)chargeMap.get(message)'+(string)chargeMap.get('message'));
                 result.paymentMessage=(string)chargeMap.get('message');
                 result.paymentStatus = 'ERROR';
             }
             //return 'SUCCESS';
        } catch(Exception e) {
            System.debug('Exception e'+e);
            result.paymentStatus = e.getMessage();
        }
		return result;
        //ended new code on 15-04
    }
    
     @AuraEnabled 
    public static string updateACR(Id aConId, string poc){
        
        try{
          	Membership__c acr=[select id,stripePayId__c  from Membership__c where id=:aConId WITH SECURITY_ENFORCED Limit 1];
            acr.stripePayId__c =poc ;
            update acr;
            return acr.Id;
        }
        catch(Exception e){
            return e.getMessage();
        }
    }
    
    
    // Helper method to convert map to query string
    private static String convertParamsToQueryString(Map<String, String> params) {
        String queryString = '';
        for (String key : params.keySet()) {
            queryString += EncodingUtil.urlEncode(key, 'UTF-8') + '=' + EncodingUtil.urlEncode(params.get(key), 'UTF-8') + '&';
        }
        System.debug('queryString'+queryString);
        return queryString.substring(0, queryString.length() - 1);
    }
	
    @AuraEnabled
    public static FieldSetWrapper getFieldSetFields(String objectName, String fieldSetName1, 
                                                    String fieldSetName4,String fieldSetName5) //String fieldSetName2,String fieldSetName3,
    {
        FieldSetWrapper fieldSetWrapper = new FieldSetWrapper();
        
        fieldSetWrapper.fields1 = new List<String>();
        //fieldSetWrapper.fields2 = new List<String>();
        //fieldSetWrapper.fields3 = new List<String>();
       	fieldSetWrapper.fields4 = new List<String>();
        fieldSetWrapper.fields5 = new List<String>();
        // Get the object describe result
        Schema.DescribeSObjectResult describeResult = Schema.getGlobalDescribe().get(objectName).getDescribe();
        
        // Get the field sets
        Schema.FieldSet fieldSet1 = describeResult.fieldSets.getMap().get(fieldSetName1);
        //Schema.FieldSet fieldSet2 = describeResult.fieldSets.getMap().get(fieldSetName2);
        //Schema.FieldSet fieldSet3 = describeResult.fieldSets.getMap().get(fieldSetName3);
        Schema.FieldSet fieldSet4 = describeResult.fieldSets.getMap().get(fieldSetName4);
        Schema.FieldSet fieldSet5 = describeResult.fieldSets.getMap().get(fieldSetName5);
        // Iterate through field set members and add field paths to lists
        for(Schema.FieldSetMember fsm : fieldSet1.getFields()) {
            fieldSetWrapper.fields1.add(fsm.getFieldPath());
        }
        /*for(Schema.FieldSetMember fsm : fieldSet2.getFields()) {
            fieldSetWrapper.fields2.add(fsm.getFieldPath());
        }
        for(Schema.FieldSetMember fsm : fieldSet3.getFields()) {
            fieldSetWrapper.fields3.add(fsm.getFieldPath());
        }*/
        for(Schema.FieldSetMember fsm : fieldSet4.getFields()) {
            fieldSetWrapper.fields4.add(fsm.getFieldPath());
        }
        for(Schema.FieldSetMember fsm : fieldSet5.getFields()) {
            fieldSetWrapper.fields5.add(fsm.getFieldPath());
        }
        return fieldSetWrapper;
    }
    
    public class FieldSetWrapper {
        @AuraEnabled
        public List<String> fields1 { get; set; }
       /* @AuraEnabled
        public List<String> fields2 { get; set; }
        @AuraEnabled
        public List<String> fields3 { get; set; }*/
        @AuraEnabled
        public List<String> fields4 { get; set; }
        @AuraEnabled
        public List<String> fields5 { get; set; }
    }
    
}