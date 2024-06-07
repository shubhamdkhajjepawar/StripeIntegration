({
	
    validateFields: function(component) {
         console.log('called helper validateFields');
        var isValid = true;
        // Get all required field elements
        var requiredFields = component.find('field');
        requiredFields.forEach(function(field) {
            var fieldName = field.get('v.fieldName');
            console.log("fieldName --> "+fieldName);
            // Check if the field value is blank
            if (!field.get('v.value') && fieldName !== 'WEBSITE__c' && fieldName !== 'OTHER_IMPORTANT_CONTACTS__c') {
                console.log("15 Inside If ");
                isValid = false;
                // Add error class to highlight the field
                $A.util.addClass(field, 'slds-has-error');
                
            } else {
                console.log("20 Inside If ");
                // Remove error class if field has a value
                $A.util.removeClass(field, 'slds-has-error');
                
            }
        });
        
        return isValid;
    },

	validatePrimaryAddress: function(component) {
        var isValid1 = true;
        console.log('called helper validatePrimaryAddress');
        var paAddress1 = component.find('paAddress').get('v.value');
        console.log("paAddress1"+paAddress1);
        /*var paAddress11 = component.find('paAddress1').get('v.value');
        console.log("paAddress11"+paAddress11);*/
        var paCity1 = component.find('paCity').get('v.value');
        console.log("paCity1"+paCity1);
        var paState1 = component.find('paState').get('v.value');
        console.log("paState1"+paState1);
        var paZip1 = component.find('paZip').get('v.value');
        console.log("paZip1"+paZip1);
        
        //mailing address code
        var maAddress1 = component.find('maAddress').get('v.value');
        console.log("maAddress1"+maAddress1);
        /*var maAddress11 = component.find('maAddress1').get('v.value');
        console.log("maAddress11"+maAddress11);*/
        var maCity1 = component.find('maCity').get('v.value');
        console.log("maCity1"+maCity1);
        var maState1 = component.find('maState').get('v.value');
        console.log("maState1"+maState1);
        var maZip1 = component.find('maZip').get('v.value');
        console.log("maZip1"+maZip1);
        
        
        //var paymentType = component.find('payType').get('v.value');
        //console.log("paymentType"+paymentType);
        //var fieldElement = component.find("paymentTypeField");

        //ended mailing address code
        // Check if any of the primary address fields are empty
        if (!paAddress1 || !paCity1 || !paState1 || !paZip1 || 
            !maAddress1 || !maCity1 || !maState1 || !maZip1 )
        {
            	 console.log("114 Inside if");
            //return false; // Validation fails
            isValid1 = false;
             $A.util.addClass(component.find('paAddress'), 'slds-has-error');
            //$A.util.addClass(component.find('paAddress1'), 'slds-has-error');
            $A.util.addClass(component.find('paCity'), 'slds-has-error');
            $A.util.addClass(component.find('paState'), 'slds-has-error');
            $A.util.addClass(component.find('paZip'), 'slds-has-error');
            //$A.util.addClass(component.find('payType'), 'slds-has-error');
            
            $A.util.addClass(component.find('maAddress'), 'slds-has-error');
            //$A.util.addClass(component.find('maAddress1'), 'slds-has-error');
            $A.util.addClass(component.find('maCity'), 'slds-has-error');
            $A.util.addClass(component.find('maState'), 'slds-has-error');
            $A.util.addClass(component.find('maZip'), 'slds-has-error');
            
        } else {
            console.log("122 Inside else");
            //return true; // Validation passes
            $A.util.removeClass(component.find('paAddress'), 'slds-has-error');
            //$A.util.removeClass(component.find('paAddress1'), 'slds-has-error');
            $A.util.removeClass(component.find('paCity'), 'slds-has-error');
            $A.util.removeClass(component.find('paState'), 'slds-has-error');
            $A.util.removeClass(component.find('paZip'), 'slds-has-error');
           // $A.util.removeClass(component.find('payType'), 'slds-has-error');
            
            $A.util.removeClass(component.find('maAddress'), 'slds-has-error');
            //$A.util.removeClass(component.find('maAddress1'), 'slds-has-error');
            $A.util.removeClass(component.find('maCity'), 'slds-has-error');
            $A.util.removeClass(component.find('maState'), 'slds-has-error');
            $A.util.removeClass(component.find('maZip'), 'slds-has-error');
        }
       
		return isValid1;  
    },
    
    
    validateMailingAddress: function(component) {
        var isValid11 = true;
        console.log('called helper validateMailingAddress');
        var maAddress1 = component.find('maAddress').get('v.value');
        console.log("maAddress1"+maAddress1);
        /*var maAddress11 = component.find('maAddress1').get('v.value');
        console.log("maAddress11"+maAddress11);*/
        var maCity1 = component.find('maCity').get('v.value');
        console.log("maCity1"+maCity1);
        var maState1 = component.find('maState').get('v.value');
        console.log("maState1"+maState1);
        var maZip1 = component.find('maZip').get('v.value');
        console.log("maZip1"+maZip1);
        // Check if any of the primary address fields are empty
       /* if (maAddress1 === null || maAddress1 === undefined || maAddress11 === null || maAddress11 === undefined || 
        maCity1 === null || maCity1 === undefined || maState1 === null || maState1 === undefined || 
        maZip1 === null || maZip1 === undefined)*/ 
        if (!maAddress1  || !maCity1 || !maState1 || !maZip1) 
        {
            isValid11 = false;
            	 console.log("157 Inside if");
            return false; // Validation fails
             $A.util.addClass(component.find('maAddress'), 'slds-has-error');
            //$A.util.addClass(component.find('maAddress1'), 'slds-has-error');
            $A.util.addClass(component.find('maCity'), 'slds-has-error');
            $A.util.addClass(component.find('maState'), 'slds-has-error');
            $A.util.addClass(component.find('maZip'), 'slds-has-error');
        } else {
            console.log("165 Inside else");
            return true; // Validation passes
            $A.util.removeClass(component.find('maAddress'), 'slds-has-error');
            //$A.util.removeClass(component.find('maAddress1'), 'slds-has-error');
            $A.util.removeClass(component.find('maCity'), 'slds-has-error');
            $A.util.removeClass(component.find('maState'), 'slds-has-error');
            $A.util.removeClass(component.find('maZip'), 'slds-has-error');
        }
        return isValid11;  
    },
    
	
})