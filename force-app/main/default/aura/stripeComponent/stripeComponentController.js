({
  
      doInit : function(component, event, helper) {
        
        let action = component.get("c.getFieldSetFields");
        action.setParams({
            objectName: "Membership__c",
            fieldSetName1: "Membership_Form",
            //fieldSetName2 :"Primary_Address",
            //fieldSetName3 :"Mailing_Address",
            fieldSetName4 :"Other_Information",
            fieldSetName5 :"Membership_Level"
        });
        action.setCallback(this, function(response){
            let state = response.getState();
            if(state==="SUCCESS"){
                let fieldsWrapper = response.getReturnValue();
                
                // Set the fields1 attribute with the retrieved field paths
                component.set("v.fields1", fieldsWrapper.fields1);
                
                // Log to check if fields are set correctly
                console.log("Fields1: ", component.get("v.fields1"));
                //component.set("v.fields2", fieldsWrapper.fields2);
                //console.log("Fields2: ", component.get("v.fields2"));
                //component.set("v.fields3", fieldsWrapper.fields3);
                //console.log("Fields3: ", component.get("v.fields3"));
                component.set("v.fields4", fieldsWrapper.fields4);
                console.log("Fields4: ", component.get("v.fields4"));
                component.set("v.fields5", fieldsWrapper.fields5);
                console.log("Fields5: ", component.get("v.fields5"));
                
            } else {
                alert("error");
            }
        });
        $A.enqueueAction(action);
    },
    paythrughstripe : function(component, event, helper)
    {
        
        if (helper.validateFields(component) && helper.validatePrimaryAddress(component)) {
            component.set("v.showStripeComponent",true);
        }
        else if(!helper.validatePrimaryAddress(component)){
                        // Display error message if fields are not valid
                       /* var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            "title": "Error",
                            "message": "Please fill Physical Address fields.",
                            "type": "error"
                        });
                        toastEvent.fire();*/
                    }
        	
        else {
            // Display error message if fields are not valid
            /*var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": "Error",
                "message": "Please fill in all required fields.",
                "type": "error"
            });
            toastEvent.fire();*/
        }
        
    },
    
    makePayment : function(component, event, helper) {
        event.preventDefault();
        console.log('called');
        console.log("called");
        let fields = component.find("field");
        console.log("fields: " + fields);
        
        //below details for card
		var name=component.find("cardName").get("v.value");
        var cardNumber = component.find("cardNumber").get("v.value");
        var expiryMonth = component.find("expiryMonth").get("v.value");
        var expiryYear = component.find("expiryYear").get("v.value");
        var cvc = component.find("cvc").get("v.value");
		var amount = component.get("v.amount");
        
       // Call Apex controller to make payment
        var action = component.get("c.processPayment");
        action.setParams({
             "name": name,
            "cardNumber": cardNumber,
            "expiryMonth": expiryMonth,
            "expiryYear": expiryYear,
            "cvc": cvc,
            "amount": amount,
           });
        action.setCallback(this, function(response) {
        var state = response.getState();
            var toastEvent = $A.get("e.force:showToast");
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                console.log("Stripe paymentStatus : " + result.paymentStatus );
                console.log("Stripe ID: " + result.stripeId);
                console.log("Stripe message: " + result.paymentMessage);
                console.log("result"+result);
                if (result.paymentStatus ==="OK") {
                    console.log("Payment successful!");
                    toastEvent.setParams({
                        "title": "Success!",
                        "message": "Payment successful!",
                        "type": "success"
                    });
                    toastEvent.fire();
                    component.set("v.stripePayId",result.stripeId);
                    component.find('form').submit();
                    //$A.get('e.force:refreshView').fire();
                } else {
                    console.error("Error making payment: ", result);
                    toastEvent.setParams({
                        "title": "Error!",
                        "message": "Error making payment: " + result.paymentMessage,
                        "type": "error"
                    });
                    toastEvent.fire();
                }
            } else {
                console.error("Error making payment: ", response.getError());
                toastEvent.setParams({
                    "title": "Error!",
                    "message": "Error making payment. Please try again.",
                    "type": "error"
                });
                toastEvent.fire();
            }
        });
        $A.enqueueAction(action);
        component.set("v.showStripeComponent",false);
    },
	
    
    handleCancel: function(component, event, helper) {
      // for Hide/Close Model,set the "isOpen" attribute to "Fasle"  
      component.set("v.showStripeComponent", false);
   },
    handleSubmit:function(component, event, helper) {
        event.preventDefault();
            if (helper.validateFields(component) && helper.validatePrimaryAddress(component)) {
                //if(helper.validatePrimaryAddress(component))
                //{
                console.log('called form');
                component.find('form').submit();
                /*var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Success!",
                    "message": "Record Saved Successfully",
                    "type": "success"
                });
                toastEvent.fire();*/
                //$A.get('e.force:refreshView').fire();
                //window.location.href = 'https://downtownmobilealliancemainstreetmo--cube84.sandbox.my.site.com/MembershipForm/s/thankyou';
                window.location.href='https://www.downtownmobile.org/membership-thank-you/';
                //}
            }
            else if(!helper.validatePrimaryAddress(component)){
                        // Display error message if fields are not valid
                       /* var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            "title": "Error",
                            "message": "Please fill Physical Address fields.",
                            "type": "error"
                        });
                        toastEvent.fire();*/
                    }
        	
        else {
                        // Display error message if fields are not valid
                        /*var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            "title": "Error",
                            "message": "Please fill in all required fields.",
                            "type": "error"
                        });
                        toastEvent.fire();*/
                    }
            
    },
    handleSuccess : function(component,event,helper) {
        console.log('in>>>handleSuccess');
       var payload = event.getParams().response;
		console.log(payload.id);
       var pp=component.get("v.stripePayId");
       console.log(pp);
        var action = component.get('c.updateACR');
        action.setParams({
            'aConId': payload.id,
           'poc':pp
        })
        action.setCallback(this, function(response) {
            //store state of response
               var state = response.getState();
            if (state === "SUCCESS") {
                
             var res=response.getReturnValue();
                
                if(res.includes('exception')){
                    var msg = res.split("exception,");
                    
                    var errmsg;
                    if(msg[1]){
                        
                    	errmsg=msg[1];
                        
                    }
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Error",
                        "type": "error",
                        "message": errmsg
                    });
                    toastEvent.fire();
               	}
                else{
                    /*var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Success",
                        "type": "success",
                        "message": "Record saved successfully!"
                    });
                    toastEvent.fire();*/
                    //$A.get('e.force:refreshView').fire();
                     //window.location.href = 'https://downtownmobilealliancemainstreetmo--cube84.sandbox.my.site.com/MembershipForm/s/thankyou';
                    window.location.href='https://www.downtownmobile.org/membership-thank-you/';
                    /* var urlEvent = $A.get("e.force:navigateToURL");
                    urlEvent.setParams({
                        "url": "https://www.google.com/"
                    });
                    urlEvent.fire();*/
                }
            //ended new code
            
        }
      });
        $A.enqueueAction(action);
        
       
    },
	
    
    handleCheckboxChange: function(component, event, helper) {
        console.log('called form');
        var isChecked = component.get("v.isChecked");
        if (isChecked) {
            // Copy physical address to mailing address
        var physicalAddress = component.find('paAddress').get('v.value');
            console.log('physicalAddress'+physicalAddress);
        component.set('v.maAddress', physicalAddress);
        var physicalAddress1 = component.find('paAddress1').get('v.value');
              console.log('physicalAddress1'+physicalAddress1);
        component.set('v.maAddress1', physicalAddress1);
        
        var physicalCity = component.find('paCity').get('v.value');
            console.log('physicalCity'+physicalCity);
        component.set('v.maCity', physicalCity);
        
        var physicalState = component.find('paState').get('v.value');
            console.log('physicalState'+physicalState);
        component.set('v.maState', physicalState);
        
        var physicalZip = component.find('paZip').get('v.value');
            console.log('physicalZip'+physicalZip);
        component.set('v.maZip', physicalZip);
        }
        else {
            component.set('v.maAddress', "");
            component.set('v.maAddress1', "");
            component.set('v.maCity', "");
            component.set('v.maState', "");
            component.set('v.maZip', "");
        }
    },
})