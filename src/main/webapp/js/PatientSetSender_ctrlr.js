/*-
 * #%L
 * i2b2 Send Patient Set Plugin
 * %%
 * Copyright (C) 2015 - 2016 Emory University
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
i2b2.PatientSetSender.Init = function (loadedDiv) {
	// register DIV as valid DragDrop target for Patient Record Sets (PRS) objects
	var op_trgt = {dropTarget: true};
	i2b2.sdx.Master.AttachType("Dem1Set-PRSDROP", "PRS", op_trgt);
	// drop event handlers used by this plugin
	i2b2.sdx.Master.setHandlerCustom("Dem1Set-PRSDROP", "PRS", "DropHandler", i2b2.PatientSetSender.prsDropped);

	// manage YUI tabs
	this.yuiTabs = new YAHOO.widget.TabView("Dem1Set-TABS", {activeIndex: 0});
	this.yuiTabs.on('activeTabChange', function (ev) {
		//Tabs have changed 
		if (ev.newValue.get('id') == "Dem1Set-TAB1") {
			// user switched to Results tab
			if (i2b2.PatientSetSender.model.prsRecord) {
				// contact PDO only if we have data
				if (i2b2.PatientSetSender.model.dirtyResultsData) {
					// recalculate the results only if the input data has changed
					i2b2.PatientSetSender.getResults();
				}
			}
		}
	});

	z = $('anaPluginViewFrame').getHeight() - 34;
	$$('DIV#Dem1Set-TABS DIV.Dem1Set-MainContent')[0].style.height = z;
	$$('DIV#Dem1Set-TABS DIV.Dem1Set-MainContent')[1].style.height = z;
	$$('DIV#Dem1Set-TABS DIV.Dem1Set-MainContent')[2].style.height = z;
	
	i2b2.PM.getEurekaClinicalSession(i2b2.PatientSetSender.EUREKA_SERVICES_URL, {
		onSuccess: function (response) {
			new Ajax.Request(i2b2.PatientSetSender.EUREKA_SERVICES_URL + '/proxy-resource/destinations?type=PATIENT_SET_EXTRACTOR', {
				method: 'get',
				contentType: 'application/json',
				asynchronous: false,
				onSuccess: function (response) {
					var destinations = JSON.parse(response.responseText);
					var s = "<select>";
					for (var i = 0; i < destinations.length; i++) {
						s += '<option value="' + destinations[i].name + '">' + destinations[i].name + '</option>';
					}
					s += "</select>"
					$$("DIV#Dem1Set-mainDiv DIV#Dem1Set-TABS DIV#Dem1Set-SelectDest")[0].innerHTML = s;
				},
				onFailure: function (response) {
					alert('The results from the server could not be understood.  Press F12 for more information.');
					console.error("Bad Results from Cell Communicator: ", response);
				},
				onComplete: function (response) {
					new Ajax.Request(i2b2.PatientSetSender.EUREKA_SERVICES_URL + '/destroy-session', {
						method: 'get',
						onComplete: function (response) {
						}
					});
				}
			});
		},
		onFailure: function (response) {
			alert('The results from the server could not be understood.  Press F12 for more information.');
			console.error("Bad Results from Cell Communicator: ", response);
		}
	});
};

i2b2.PatientSetSender.Unload = function () {
	// purge old data
	i2b2.PatientSetSender.model.prsRecord = false;
	return true;
};

i2b2.PatientSetSender.prsDropped = function (sdxData) {
	sdxData = sdxData[0];	// only interested in first record
	// save the info to our local data model
	i2b2.PatientSetSender.model.prsRecord = sdxData;
	// let the user know that the drop was successful by displaying the name of the patient set
	$("Dem1Set-PRSDROP").innerHTML = i2b2.h.Escape(sdxData.sdxInfo.sdxDisplayName);
	// temporarly change background color to give GUI feedback of a successful drop occuring
	$("Dem1Set-PRSDROP").style.background = "#CFB";
	setTimeout("$('Dem1Set-PRSDROP').style.background='#DEEBEF'", 250);
	// optimization to prevent requerying the hive for new results if the input dataset has not changed
	i2b2.PatientSetSender.model.dirtyResultsData = true;
};

i2b2.PatientSetSender.getResults = function () {
	if (i2b2.PatientSetSender.model.dirtyResultsData) {
		$$("DIV#Dem1Set-mainDiv DIV#Dem1Set-TABS DIV.results-directions")[0].hide();
		$$("DIV#Dem1Set-mainDiv DIV#Dem1Set-TABS DIV.results-finished")[0].hide();
		$$("DIV#Dem1Set-mainDiv DIV#Dem1Set-TABS DIV.results-working")[0].show();
		
		window.name = "opener";
		
		i2b2.PatientSetSender.eurekaServicesURL = i2b2.PatientSetSender.SERVICE_URL + '/proxy-resource/patientset';
		i2b2.PatientSetSender.selectedReceiverUrl = i2b2.PatientSetSender.RECEIVER_SEND_URL;
		
		window.open(i2b2.PatientSetSender.cfg.config.assetDir + 'patient_set_sender.html');
		
		$$("DIV#Dem1Set-mainDiv DIV#Dem1Set-TABS DIV.results-working")[0].hide();
		$$("DIV#Dem1Set-mainDiv DIV#Dem1Set-TABS DIV.results-finished")[0].show();
		$$("DIV#Dem1Set-mainDiv DIV#Dem1Set-TABS DIV.results-finished")[0].innerHTML = '';
	}
};
