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
// this file contains a list of all files that need to be loaded dynamically for this i2b2 Cell
// every file in this list will be loaded after the cell's Init function is called
{
	files:[
		"PatientSetSender_config.js",
		"PatientSetSender_ctrlr.js"
	],
	css:[ 
		"PatientSetSender.css"
	],
	config: {
		// additional configuration variables that are set by the system
		short_name: "Send Patient Set",
		name: "Send Patient Set",
		description: "Perform an action on a patient set.",
		category: ["celless","plugin","local"],
		plugin: {
			isolateHtml: false,  // this means do not use an IFRAME
			isolateComm: false,  // this means to expect the plugin to use AJAX communications provided by the framework
			standardTabs: true, // this means the plugin uses standard tabs at top
			html: {
				source: 'injected_screens.html',
				mainDivId: 'Dem1Set-mainDiv'
			}
		}
	}
}
