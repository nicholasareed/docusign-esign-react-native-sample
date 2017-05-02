
# DocuSign Esignature React Native Sample App 



## Installation 

	git clone https://github.com/nicholasareed/docusign-esign-react-native-sample
	cd docusign-esign-react-native-sample
	npm i
	react-native link

Rename `config.json.sample` to `config.json` and update the values. 

#### iOS (from scratch) 

Enable iCloud in XCode for react-native-document-picker (name.xcworkspace -> Capabilities -> iCloud): https://github.com/Elyx0/react-native-document-picker




### port 8081 vs 8082 

Many corporate environments have antivirus on the default 8081 port for the packager, so to change that in XCode search for all instances of "8081" and replace them with "8082". Then edit the [React.xcodeproject] -> [Build Phases] -> [Start Package] to change 8081 to 8082 also (or delete the packager script). 


### Running 


	react-native start --port 8082


Useful command to find your local IP: 

	ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' 




